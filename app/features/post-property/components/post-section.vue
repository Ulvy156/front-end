<template>
  <section class="w-full px-4 mt-6 md:w-[80%] md:px-0 md:mt-10 m-auto flex flex-col gap-6">
    <stepProgress
      :step-keys="stepKeys"
      :current-step="active"
      :saved-text="savedText"
      :saved-fresh="savedFresh"
      @jump="handleGoTo"
    />

    <template v-if="!justPublished">
      <!-- Step Content -->
      <el-form ref="formRef" :model="form" :rules="formRules">
        <component :is="currentComponent" @go-to="handleGoTo" />
      </el-form>

      <!-- Controls -->
      <stepsNavigation
        :current-step="active + 1"
        :total-steps="steps.length"
        :loading="loading"
        @back="prev"
        @next="next"
        @save="saveNow"
        @submit="publish"
      />
    </template>

    <!-- Post-publish success -->
    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center gap-4 py-16 px-6">
      <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <BaseIconClient name="check" :size="30" color="#047857" />
      </div>
      <h2 class="text-xl font-extrabold text-gray-900">{{ t('post_property.success.title') }}</h2>
      <p class="text-sm text-(--gray) max-w-sm">
        {{ t('post_property.success.message', { title: form.propertyTitle || t('post_property.preview.untitled') }) }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 mt-2">
        <BaseButton type="info" @click="justPublished = false">
          {{ t('post_property.success.back_to_preview') }}
        </BaseButton>
        <BaseButton @click="goToMyListings">
          {{ t('post_property.success.view_listing') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, inject, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import type { FormInstance } from "element-plus";
import stepProgress from "./step-progress.vue";
import stepsNavigation from "./steps-navigation.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { useApi } from "@/composables/useApi";
import { createProperty } from "@/features/post-property/services/create-property";
import { useDraftAutosave } from "@/features/post-property/composables/useDraftAutosave";
import { usePropertyFormValidation } from "@/features/post-property/composables/usePropertyFormValidation";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const authStore = useAuthStore();
const notify = useNotify();
const { extract } = useErrorMsg();
const queryClient = useQueryClient();

const form = inject<any>("postPropertyForm");
const formRef = ref<FormInstance>();

const { formRules, validateStep, firstInvalidStep } = usePropertyFormValidation(formRef);

const active = ref(0);
const loading = ref(false);
const justPublished = ref(false);
const publishResult = ref<string | null>(null);
const publishError = ref<string | null>(null);

const { savedText, savedFresh, saveNow, clearDraft } = useDraftAutosave(form);

const stepKeys = [
  'post_property.steps.one',
  'post_property.steps.two',
  'post_property.steps.three',
  'post_property.steps.four',
  'post_property.steps.five',
  'post_property.steps.six',
  'post_property.steps.seven',
];

const steps = [
  defineAsyncComponent(() => import("./property-type.vue")),
    defineAsyncComponent(() => import('./basic-info.vue')),
    defineAsyncComponent(() => import('./location.vue')),
    defineAsyncComponent(() => import('./price.vue')),
    defineAsyncComponent(() => import('./amenities.vue')),
    defineAsyncComponent(() => import('./photos.vue')),
    defineAsyncComponent(() => import('./preview.vue')),
];

const currentComponent = computed(() => steps[active.value]);

const handleGoTo = async (step: number) => {
  if (step < 0 || step >= steps.length) return;
  justPublished.value = false;

  // Jumping backward (e.g. a "Back to preview" link) never needs validation.
  if (step <= active.value) {
    active.value = step;
    return;
  }

  // Jumping forward — validate every step being skipped, same as Continue does
  // one at a time. Stop at the first invalid step instead of silently skipping it.
  for (let i = active.value; i < step; i++) {
    if (!(await validateStep(i))) {
      active.value = i;
      return;
    }
  }
  active.value = step;
};

const next = async () => {
  if (active.value >= steps.length - 1) return;

  // Validate current step before allowing navigation to next step
  if (!(await validateStep(active.value))) {
    return; // Stay on current step if validation fails
  }

  active.value++;
};

const prev = () => {
  if (active.value > 0) active.value--;
};

const goToMyListings = () => {
  router.push('/landlord/properties');
};

const publish = async () => {

  if (!form) {
    publishError.value = t('post_property.errors.form_missing');
    notify.error(publishError.value);
    return;
  }

  // Validate the whole form; jump to the first step with an error if any
  const { valid, invalidFields } = await new Promise<{ valid: boolean; invalidFields?: Record<string, unknown> }>((resolve) => {
    formRef.value?.validate((isValid: boolean, fields?: Record<string, unknown>) => resolve({ valid: isValid, invalidFields: fields }));
  });

  if (!valid) {
    active.value = firstInvalidStep(invalidFields || {});
    return;
  }

  loading.value = true;
  publishError.value = null;
  publishResult.value = null;

  const api = useApi();

  try {

    const typeMap: Record<string, number> = {
      room: 1,
      studio: 2,
      apartment: 3,
      house: 4,
      single_room: 5,
    };

    const minStayMap: Record<string, number> = {
      "1m": 1,
      "3m": 3,
      "6m": 6,
      "1y": 12,
      "2y": 24,
    };

    const parkingTypeMap: Record<string, string> = {
      BIKE: "BICYCLE",
      MOTORBIKE: "MOTO",
      MOTO: "MOTO",
      CAR: "CAR",
      TUK_TUK: "TUK_TUK",
      BICYCLE: "BICYCLE",
    };


    const safeNumber = (v: any): number | undefined => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

     const districtId = Number(form.districtId);
     if (!districtId) {
       publishError.value = t('post_property.errors.district_required');
       notify.error(publishError.value);
       return;
     }

     // Validate address
     if (!form.streetAddress) {
       publishError.value = t('post_property.errors.address_required');
       notify.error(publishError.value);
       return;
     }

     // Validate property type
     if (!typeMap[form.propertyType]) {
       publishError.value = t('post_property.errors.property_type_invalid');
       notify.error(publishError.value);
       return;
     }


     const amenityKeys = Array.isArray(form.amenities)
       ? form.amenities
           .map((v: unknown) => Number(v))
           .filter((n: unknown) => Number.isFinite(n))
       : [];

     const ruleKeys = Array.isArray(form.ruleKeys)
       ? form.ruleKeys
           .map((v: any) => Number(v))
           .filter((n: number) => Number.isFinite(n))
       : [];

     // Validate minimum stay
     if (!minStayMap[form.minStay]) {
       publishError.value = t('post_property.errors.min_stay_invalid');
       notify.error(publishError.value);
       return;
     }

     const parkings = Array.isArray(form.parkings)
   ? form.parkings
       .map((pk: string) => {
         const type = parkingTypeMap[pk] || pk;

         const rawSlots = form.parkingDetails?.[pk]?.slots;
         const rawPrice = form.parkingDetails?.[pk]?.price;
         const isFree = form.parkingDetails?.[pk]?.isFree ?? true;

         const slotsNum = Number(rawSlots);
         const priceNum = Number(rawPrice);

         if (!["MOTO", "BICYCLE", "CAR", "TUK_TUK"].includes(type)) {
           return null;
         }

         const parking: any = {
           type,
           slots: Number.isFinite(slotsNum) ? slotsNum : 0,
           isFree,
         };


         if (!isFree) {
           if (Number.isFinite(priceNum)) {
             parking.price = priceNum;
           } else {
             parking.price = 0;
           }
         }

         return parking;
       })
       .filter(Boolean)
   : [];

     const payload = {
        userId: authStore.user?.id ?? "",

        districtId,
        address: form.streetAddress || "",
        lat: form.latitude ? Number(form.latitude) : undefined,
        lng: form.longitude ? Number(form.longitude) : undefined,

        title: form.propertyTitle || "",
        description: form.description || "",

        monthly_price: Number(form.rent) || 0,
        deposit: safeNumber(form.deposit),

        bedroom: safeNumber(form.bedrooms),
        bathroom: safeNumber(form.bathrooms),

        propertyTypeId: typeMap[form.propertyType] || 0,

        sizeSqm: Number(form.size) || 0,
        floor: 1,
        totalFloors: 1,

        furnished: !!form.fullyFurnished,
        isPublished: true,


        availableFrom: form.availableFrom
          ? new Date(form.availableFrom).toISOString()
          : undefined,

        minimumStayLength: minStayMap[form.minStay],

        folderType: form.propertyType,

        amenityKeys,
        ruleKeys,
        parkings,
        openTime: form.openTime || undefined,
        closeTime: form.closeTime || undefined,
      };


       const result = await createProperty(api, payload, form.photoFiles || []);

      publishResult.value = t('post_property.published_success', { id: result.id });

      // Refresh landlord properties/dashboard caches so the new listing shows up immediately
      await queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
      await queryClient.invalidateQueries({ queryKey: ['landlord-dashboard'] });

      clearDraft();
      justPublished.value = true;
    } catch (error: any) {
     publishError.value = extract(error);
     notify.error(publishError.value);
   } finally {
     loading.value = false;
   }
 };
</script>
