<template>
  <section class="w-[80%] mt-10 m-auto">
    <!-- Step Header -->
    <el-steps :active="active" finish-status="success">
      <el-step :title="t('post_property.steps.one')" />
      <el-step :title="t('post_property.steps.two')" />
      <el-step :title="t('post_property.steps.three')" />
      <el-step :title="t('post_property.steps.four')" />
      <el-step :title="t('post_property.steps.five')" />
      <el-step :title="t('post_property.steps.six')" />
      <el-step :title="t('post_property.steps.seven')" />
    </el-steps>

    <!-- Step Content -->
    <div class="mt-8">
      <component :is="currentComponent" @go-to="handleGoTo" />
    </div>

    <!-- Controls -->
    <div class="mt-6 flex justify-between">
      <stepsNavigation
        :current-step="active + 1"
        :total-steps="steps.length"
        :loading="loading"
        @back="prev"
        @next="next"
        @save="saveDraft"
        @submit="publish"
      />
    </div>

  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, inject, ref } from "vue";
import stepsNavigation from "./steps-navigation.vue";
import { useApi } from "@/composables/useApi";
import { createProperty } from "@/features/post-property/services/create-property";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const authStore = useAuthStore();
const notify = useNotify();
const { extract } = useErrorMsg();

const form = inject<any>("postPropertyForm");
const formErrors = inject<any>("formErrors");

const active = ref(0);
const loading = ref(false);
const publishResult = ref<string | null>(null);
const publishError = ref<string | null>(null);

// Form validation
function validateForm(): boolean {
  let isValid = true;

  // Property type
  if (!form.propertyType) {
    formErrors.propertyType = t('post_property.errors.required');
    isValid = false;
  }

  //  Basic info
  if (!form.propertyTitle?.trim()) {
    formErrors.propertyTitle = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.description?.trim()) {
    formErrors.description = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.size || Number(form.size) <= 0) {
    formErrors.size = t('post_property.errors.required');
    isValid = false;
  }

  // Location
  if (!form.province) {
    formErrors.province = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.districtId || Number(form.districtId) === 0) {
    formErrors.district = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.streetAddress?.trim()) {
    formErrors.streetAddress = t('post_property.errors.required');
    isValid = false;
  }

  //  Pricing
  if (!form.rent || Number(form.rent) <= 0) {
    formErrors.rent = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.minStay) {
    formErrors.minStay = t('post_property.errors.required');
    isValid = false;
  }
  if (!form.availableFrom) {
    formErrors.availableFrom = t('post_property.errors.required');
    isValid = false;
  }

  //  Photos
  if (!form.photoFiles || form.photoFiles.length < 3) {
    formErrors.photos = t('post_property.errors.photos_min');
    isValid = false;
  }

  //  Amenities
  if (!form.amenities || form.amenities.length === 0) {
    formErrors.amenities = t('post_property.errors.amenities_required');
    isValid = false;
  }

  return isValid;
}


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

const handleGoTo = (step: number) => {
  if (step >= 0 && step < steps.length) active.value = step;
};

const next = () => {
  if (active.value >= steps.length - 1) return;

  // Validate current step before allowing navigation to next step
  if (!validateStep(active.value)) {
    return; // Stay on current step if validation fails
  }

  active.value++;
};

// Validate only the current step and set errors for that step
function validateStep(stepIndex: number): boolean {
  // Define error keys for each step
  const stepErrorKeysMap: Record<number, string[]> = {
    0: ['propertyType'],
    1: ['propertyTitle', 'description', 'size'],
    2: ['province', 'district', 'streetAddress'],
    3: ['rent', 'minStay', 'availableFrom'],
    4: ['amenities'],
    5: ['photos'],
    6: []
  };

  // Get the error keys for the current step, default to empty array if stepIndex out of range
  const stepErrorKeys = stepErrorKeysMap[stepIndex] || [];

  // Clear existing errors for the current step
  stepErrorKeys.forEach(key => {
    formErrors[key] = '';
  });

  let isValid = true;

  switch (stepIndex) {
    case 0: // Property type step
      if (!form.propertyType) {
        formErrors.propertyType = t('post_property.errors.required');
        isValid = false;
      }
      break;
    case 1: // Basic info step
      if (!form.propertyTitle?.trim()) {
        formErrors.propertyTitle = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.description?.trim()) {
        formErrors.description = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.size || Number(form.size) <= 0) {
        formErrors.size = t('post_property.errors.required');
        isValid = false;
      }
      break;
    case 2: // Location step
      if (!form.province) {
        formErrors.province = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.districtId || Number(form.districtId) === 0) {
        formErrors.district = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.streetAddress?.trim()) {
        formErrors.streetAddress = t('post_property.errors.required');
        isValid = false;
      }
      break;
    case 3: // Price step
      if (!form.rent || Number(form.rent) <= 0) {
        formErrors.rent = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.minStay) {
        formErrors.minStay = t('post_property.errors.required');
        isValid = false;
      }
      if (!form.availableFrom) {
        formErrors.availableFrom = t('post_property.errors.required');
        isValid = false;
      }
      break;
    case 4: // Amenities step
      if (!form.amenities || form.amenities.length === 0) {
        formErrors.amenities = t('post_property.errors.amenities_required');
        isValid = false;
      }
      break;
    case 5: // Photos step
      if (!form.photoFiles || form.photoFiles.length < 3) {
        formErrors.photos = t('post_property.errors.photos_min');
        isValid = false;
      }
      break;
    case 6: // Preview step - no validation needed
      break;
    default:
      break;
  }

  return isValid;
}

const prev = () => {
  if (active.value > 0) active.value--;
};

const saveDraft = () => {
  console.log("Save Draft clicked");
};

const publish = async () => {

  if (!form) {
    publishError.value = t('post_property.errors.form_missing');
    notify.error(publishError.value);
    return;
  }

  // Clear previous errors
  Object.keys(formErrors).forEach(k => formErrors[k] = '');

  // Validate form
  if (!validateForm()) {
    // Jump to first step that has an error
    if (formErrors.propertyTitle || formErrors.description || formErrors.size || formErrors.propertyType) {
      active.value = 0; // Property type or basic info (step 0 or 1)
      // More specifically: propertyType is step0, propertyTitle/description/size are step1
      if (formErrors.propertyType) {
        active.value = 0;
      } else {
        active.value = 1;
      }
    } else if (formErrors.province || formErrors.district || formErrors.streetAddress) {
      active.value = 2; // Location step
    } else if (formErrors.rent || formErrors.minStay || formErrors.availableFrom) {
      active.value = 3; // Price step
    } else if (formErrors.amenities) {
      active.value = 4; // Amenities step
    } else if (formErrors.photos) {
      active.value = 5; // Photos step (step index 5)
    }
    return; // stop here
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
           .map((v) => Number(v))
           .filter((n) => Number.isFinite(n))
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
      notify.success(publishResult.value);
      // Redirect
      router.push('/properties');
    } catch (error: any) {
     publishError.value = extract(error);
     notify.error(publishError.value);
   } finally {
     loading.value = false;
   }
 };
</script>