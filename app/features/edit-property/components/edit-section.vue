<template>
  <section class="w-full px-4 mt-6 md:w-[80%] md:px-0 md:mt-10 m-auto">
    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton :rows="1" leading="square" leading-size="300px" :lines="3" />
      <BaseSkeleton :rows="4" :lines="2" />
    </div>

    <!-- Error -->
    <div v-else-if="isError || !property" class="py-20">
      <BaseEmpty />
      <div class="flex justify-center mt-4">
        <BaseButton @click="router.push('/landlord/properties')">
          {{ t('landlord.propertyDetail.backToProperties') }}
        </BaseButton>
      </div>
    </div>

    <!-- Locked by admin -->
    <div v-else-if="property.isLocked" class="py-20">
      <BaseEmpty :description="t('landlord.propertyDetail.lockedByAdminHint')" />
      <div class="flex justify-center mt-4">
        <BaseButton @click="router.push(`/landlord/properties/${propertyId}`)">
          {{ t('landlord.propertyDetail.backToProperty') }}
        </BaseButton>
      </div>
    </div>

    <!-- Populating form -->
    <div v-else-if="!initialized" class="space-y-4">
      <BaseSkeleton :rows="1" leading="square" leading-size="300px" :lines="3" />
    </div>

    <!-- Edit form -->
    <template v-else>
      <stepProgress
        :step-keys="stepKeys"
        :current-step="active"
        saved-text=""
        :saved-fresh="false"
        class="mb-6"
        @jump="handleGoTo"
      />

      <el-form ref="formRef" :model="form" :rules="formRules">
        <propertyType v-if="active === 0" :form="form" />
        <basicInfo v-else-if="active === 1" :form="form" />
        <locationStep v-else-if="active === 2" :form="form" />
        <price v-else-if="active === 3" :form="form" />
        <amenities v-else-if="active === 4" :form="form" />
        <editPhotos
          v-else-if="active === 5"
          :property-id="propertyId"
          :images="property.images"
          :form="form"
          @refresh="refetchProperty"
        />
        <preview v-else :form="form" @go-to="handleGoTo" />
      </el-form>

      <div class="mt-6 flex justify-between">
        <stepsNavigation
          :current-step="active + 1"
          :total-steps="TOTAL_STEPS"
          :loading="loading"
          :show-draft-controls="false"
          :submit-label="t('landlord.editProperty.saveChanges')"
          :submitting-label="t('landlord.editProperty.saving')"
          submit-icon="check"
          @back="prev"
          @next="next"
          @submit="handleSave"
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseEmpty from '~/components/ui/BaseEmpty.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import stepProgress from '~/features/post-property/components/step-progress.vue'
import stepsNavigation from '~/features/post-property/components/steps-navigation.vue'
import propertyType from '~/features/post-property/components/property-type.vue'
import basicInfo from '~/features/post-property/components/basic-info.vue'
import locationStep from '~/features/post-property/components/location.vue'
import price from '~/features/post-property/components/price.vue'
import amenities from '~/features/post-property/components/amenities.vue'
import preview from '~/features/post-property/components/preview.vue'
import editPhotos from './edit-photos.vue'
import { useEditProperty } from '../composables/useEditProperty'
import { usePropertyFormValidation } from '~/features/post-property/composables/usePropertyFormValidation'
import { usePropertyRuleOptions } from '~/features/browse-properties/composable/usePropertyRuleOptions'
import { usePropertyAmenityOptions } from '~/features/browse-properties/composable/usePropertyAmenityOptions'
import { useQueryClient } from '@tanstack/vue-query'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notify = useNotify()
const { extract } = useErrorMsg()
const queryClient = useQueryClient()

const propertyId = computed(() => route.params.id as string)

const { property, isPending, isError, mapPropertyToForm, submitUpdate } = useEditProperty(propertyId)

const form = ref<any>(null)
const active = ref(0)
const loading = ref(false)
const initialized = ref(false)

const TOTAL_STEPS = 7

const stepKeys = [
  'post_property.steps.one',
  'post_property.steps.two',
  'post_property.steps.three',
  'post_property.steps.four',
  'post_property.steps.five',
  'post_property.steps.six',
  'post_property.steps.seven',
]

const formRef = ref<FormInstance>()
const { formRules, validateStep, firstInvalidStep } = usePropertyFormValidation(formRef, form)

watch(property, (p) => {
  if (p && !initialized.value) {
    form.value = reactive(mapPropertyToForm(p))
    initialized.value = true
  }
}, { immediate: true })

// The property-detail API doesn't return rule ids (only names), so hydrate
// form.ruleKeys by matching the property's allowed rules against the loaded
// rule options by name, same as the retired edit-amenities.vue used to.
const { data: ruleOptions } = usePropertyRuleOptions()
const ruleKeysInitialized = ref(false)
watch([ruleOptions, property], ([options, p]) => {
  if (ruleKeysInitialized.value || !options.length || !p?.rules?.length || !form.value) return
  const allowedNames = new Set(
    p.rules.filter((r: any) => r.is_allow).map((r: any) => r.nameEn),
  )
  form.value.ruleKeys = options
    .filter((opt: any) => allowedNames.has(opt.nameEn))
    .map((opt: any) => opt.id)
  ruleKeysInitialized.value = true
}, { immediate: true })

// Same problem, same fix, for amenities: GET /landlord/properties/:id also
// drops amenity ids (only nameEn/nameKh/icon survive), so hydrate
// form.amenities by name-matching against the loaded amenity catalog instead
// of trusting property.amenities[].id (which is always undefined server-side
// today). NOTE: the amenity picker itself only shows a subset of the full
// catalog (a separate backend limitation) — any of the property's amenities
// outside that visible subset can't be matched here and will appear
// unchecked, same as they would if picked fresh.
const { data: amenityOptions } = usePropertyAmenityOptions()
const amenitiesInitialized = ref(false)
watch([amenityOptions, property], ([options, p]) => {
  if (amenitiesInitialized.value || !options.length || !p?.amenities?.length || !form.value) return
  const ownedNames = new Set(p.amenities.map((a: any) => a.nameEn))
  form.value.amenities = options
    .filter((opt: any) => ownedNames.has(opt.nameEn))
    .map((opt: any) => opt.id)
  amenitiesInitialized.value = true
}, { immediate: true })

function refetchProperty() {
  queryClient.invalidateQueries({ queryKey: ['edit-property', propertyId.value] })
}

const handleGoTo = async (step: number) => {
  if (step < 0 || step >= TOTAL_STEPS) return

  // Jumping backward never needs validation.
  if (step <= active.value) {
    active.value = step
    return
  }

  // Jumping forward — validate every step being skipped, same as Continue does
  // one at a time. Stop at the first invalid step instead of silently skipping it.
  for (let i = active.value; i < step; i++) {
    if (!(await validateStep(i))) {
      active.value = i
      return
    }
  }
  active.value = step
}

async function next() {
  if (active.value >= TOTAL_STEPS - 1) return
  if (!(await validateStep(active.value))) return
  active.value++
}

function prev() {
  if (active.value > 0) {
    active.value--
  } else {
    router.push(`/landlord/properties/${propertyId.value}`)
  }
}

async function handleSave() {
  const { valid, invalidFields } = await new Promise<{ valid: boolean; invalidFields?: Record<string, unknown> }>((resolve) => {
    formRef.value?.validate((isValid: boolean, fields?: Record<string, unknown>) => resolve({ valid: isValid, invalidFields: fields }))
  })

  if (!valid) {
    active.value = firstInvalidStep(invalidFields || {})
    return
  }

  loading.value = true
  try {
    await submitUpdate(form.value)
    notify.success(t('landlord.editProperty.updateSuccess'))
    router.push(`/landlord/properties/${propertyId.value}`)
  } catch (err) {
    notify.error(extract(err))
  } finally {
    loading.value = false
  }
}
</script>
