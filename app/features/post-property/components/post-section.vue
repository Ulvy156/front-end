<template>
  <section class="w-full px-4 mt-6 md:w-[80%] md:px-0 md:mt-10 m-auto flex flex-col gap-6">
    <stepProgress
      :step-keys="stepKeys"
      :current-step="active"
      @jump="handleGoTo"
    />

    <!-- Step Content -->
    <el-form ref="formRef" :model="form" :rules="formRules">
      <component :is="currentComponent" @go-to="handleGoTo" />
    </el-form>

    <!-- Controls -->
    <actionBar
      :current-step="active + 1"
      :total-steps="steps.length"
      :loading="loading"
      :saving-draft="savingDraft"
      @back="prev"
      @next="next"
      @save="handleSaveDraft"
      @submit="publish"
    />
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, inject, ref, onMounted } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import type { FormInstance } from "element-plus";
import stepProgress from "./step-progress.vue";
import actionBar from "./action-bar.vue";
import { useApi } from "@/composables/useApi";
import { createProperty } from "@/features/post-property/services/create-property";
import { usePropertyFormValidation } from "@/features/post-property/composables/usePropertyFormValidation";
import { usePropertyDraftSession } from "@/features/post-property/composables/usePropertyDraftSession";
import { usePropertyTypeMap } from "~/composables/usePropertyTypeMap";
import { getDraft, publishDraft } from "~/features/property-draft/services/property-draft";
import {
  MIN_STAY_MAP,
  safeNumber,
  buildAmenityKeys,
  buildRuleKeys,
  buildParkings,
} from "@/features/post-property/utils/propertyPayloadMaps";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from 'vue-router';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notify = useNotify();
const { extract } = useErrorMsg();
const queryClient = useQueryClient();

const form = inject<any>("postPropertyForm");
const formRef = ref<FormInstance>();

const { formRules, validateStep, firstInvalidStep } = usePropertyFormValidation(formRef, form);

const active = ref(0);
const loading = ref(false);
const publishError = ref<string | null>(null);

const { draftId, savingDraft, loadDraftIntoForm, saveDraft } = usePropertyDraftSession();
const { byKey: typeByKey } = usePropertyTypeMap();

onMounted(async () => {
  const queryDraftId = route.query.draftId;
  if (!queryDraftId || typeof queryDraftId !== 'string') return;

  try {
    const draft = await getDraft(api, queryDraftId);
    loadDraftIntoForm(form, draft);
  } catch (err) {
    notify.error(extract(err));
    router.push('/landlord/drafts');
  }
});

const handleSaveDraft = async () => {
  if (!form || savingDraft.value) return;
  const isFirstSave = !draftId.value;
  try {
    await saveDraft(form);
    notify.success(t(isFirstSave ? 'post_property.draft_saved' : 'post_property.draft_updated'));
  } catch (err) {
    notify.error(extract(err));
  }
};

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

  const api = useApi();

  try {

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
     if (!typeByKey.value[form.propertyType]) {
       publishError.value = t('post_property.errors.property_type_invalid');
       notify.error(publishError.value);
       return;
     }

     // Validate minimum stay
     if (!MIN_STAY_MAP[form.minStay]) {
       publishError.value = t('post_property.errors.min_stay_invalid');
       notify.error(publishError.value);
       return;
     }

     const amenityKeys = buildAmenityKeys(form);
     const ruleKeys = buildRuleKeys(form);
     const parkings = buildParkings(form);

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

        propertyTypeId: typeByKey.value[form.propertyType] || 0,

        sizeSqm: Number(form.size) || 0,
        sizeWidthM: safeNumber(form.sizeWidthM),
        sizeLengthM: safeNumber(form.sizeLengthM),
        floor: 1,
        totalFloors: 1,

        furnished: !!form.fullyFurnished,
        isPublished: true,


        availableFrom: form.availableFrom
          ? new Date(form.availableFrom).toISOString()
          : undefined,

        minimumStayLength: MIN_STAY_MAP[form.minStay],

        folderType: form.propertyType,

        amenityKeys,
        ruleKeys,
        parkings,
        openTime: form.openTime || undefined,
        closeTime: form.closeTime || undefined,
      };

      const newFiles = (form.photoFiles || []).filter((f: unknown): f is File => f instanceof File);

      let result: { id: number; message?: string };
      if (draftId.value) {
        await saveDraft(form);
        result = await publishDraft(api, draftId.value);
        queryClient.invalidateQueries({ queryKey: ['property-drafts'] });
        draftId.value = null;
      } else {
        result = await createProperty(api, payload, newFiles);
      }

      // Refresh landlord properties/dashboard caches so the new listing shows up immediately
      await queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
      await queryClient.invalidateQueries({ queryKey: ['landlord-dashboard'] });

      notify.success(t('post_property.published_success', { id: result.id }));
      router.push('/landlord/properties');
    } catch (error: any) {
     publishError.value = extract(error);
     notify.error(publishError.value);
   } finally {
     loading.value = false;
   }
 };
</script>
