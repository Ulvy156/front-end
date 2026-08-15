import { computed, type Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useAppSettingsStore } from '~/stores/appSettings'

export function usePropertyFormValidation(formRef: Ref<FormInstance | undefined>) {
  const { t } = useI18n()
  const appSettingsStore = useAppSettingsStore()

  const requiredMsg = () => t('post_property.errors.required')

  const formRules = computed<FormRules>(() => ({
    propertyType: [
      { required: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    propertyTitle: [
      { required: true, whitespace: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    description: [
      { required: true, whitespace: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    size: [
      {
        validator: (_rule, value, callback) => {
          if (!value || Number(value) <= 0) callback(new Error(requiredMsg()))
          else callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    province: [
      { required: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    districtId: [
      {
        validator: (_rule, value, callback) => {
          if (!value || Number(value) === 0) callback(new Error(requiredMsg()))
          else callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    streetAddress: [
      { required: true, whitespace: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    rent: [
      {
        validator: (_rule, value, callback) => {
          const n = Number(value)
          if (!value || n <= 0) return callback(new Error(requiredMsg()))
          const min = appSettingsStore.minPropertyPrice
          const max = appSettingsStore.maxPropertyPrice
          if (min !== null && n < min) return callback(new Error(t('post_property.errors.rent_too_low', { min })))
          if (max !== null && n > max) return callback(new Error(t('post_property.errors.rent_too_high', { max })))
          callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    minStay: [
      { required: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    availableFrom: [
      { required: true, message: requiredMsg(), trigger: ['blur', 'change'] },
    ],
    amenities: [
      {
        validator: (_rule, value, callback) => {
          if (!Array.isArray(value) || value.length === 0) callback(new Error(t('post_property.errors.amenities_required')))
          else callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    photoFiles: [
      {
        validator: (_rule, value, callback) => {
          if (!Array.isArray(value) || value.length < 3) callback(new Error(t('post_property.errors.photos_min')))
          else callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    photos: [
      {
        validator: (_rule, value, callback) => {
          if (!Array.isArray(value) || value.length < 3) callback(new Error(t('post_property.errors.photos_min')))
          else callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
  }))

  const stepFieldMap: Record<number, string[]> = {
    0: ['propertyType'],
    1: ['propertyTitle', 'description', 'size'],
    2: ['province', 'districtId', 'streetAddress'],
    3: ['rent', 'minStay', 'availableFrom'],
    4: ['amenities'],
    5: ['photoFiles', 'photos'],
    6: [],
  }

  function validateStep(stepIndex: number): Promise<boolean> {
    const props = stepFieldMap[stepIndex] || []
    if (props.length === 0) return Promise.resolve(true)
    return new Promise((resolve) => {
      formRef.value?.validateField(props, (isValid: boolean) => resolve(isValid))
    })
  }

  function firstInvalidStep(invalidFields: Record<string, unknown>): number {
    const invalidProps = Object.keys(invalidFields)
    for (let i = 0; i <= 6; i++) {
      if ((stepFieldMap[i] || []).some((p) => invalidProps.includes(p))) return i
    }
    return 0
  }

  return {
    formRules,
    stepFieldMap,
    validateStep,
    firstInvalidStep,
  }
}
