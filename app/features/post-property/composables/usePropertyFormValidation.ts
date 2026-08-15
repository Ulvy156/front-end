import { computed, unref, type Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useAppSettingsStore } from '~/stores/appSettings'
import { isPositiveNumber } from '~/utils/validators'

export function usePropertyFormValidation(formRef: Ref<FormInstance | undefined>, form?: any) {
  const { t } = useI18n()
  const appSettingsStore = useAppSettingsStore()

  const requiredMsg = () => t('post_property.errors.required')

  const MIN_VISITING_HOURS_GAP_MINUTES = 12 * 60

  function parseTimeToMinutes(time: string): number | null {
    const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!match) return null
    let hours = Number(match[1])
    const minutes = Number(match[2])
    const period = match[3].toUpperCase()
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }

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
          if (!isPositiveNumber(value)) callback(new Error(requiredMsg()))
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
          if (!isPositiveNumber(value)) return callback(new Error(requiredMsg()))
          const n = Number(value)
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
      {
        validator: (_rule, value, callback) => {
          if (!value) return callback(new Error(requiredMsg()))
          const selected = new Date(`${value}T00:00:00`)
          const startOfToday = new Date()
          startOfToday.setHours(0, 0, 0, 0)
          if (selected.getTime() < startOfToday.getTime()) return callback(new Error(t('post_property.errors.available_from_past')))
          callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    openTime: [
      {
        validator: (_rule, value, callback) => {
          if (value && !unref(form)?.closeTime) return callback(new Error(t('post_property.errors.close_time_required')))
          callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    closeTime: [
      {
        validator: (_rule, value, callback) => {
          const open = unref(form)?.openTime
          if (open && !value) return callback(new Error(t('post_property.errors.close_time_required')))
          if (open && value) {
            const openMin = parseTimeToMinutes(open)
            const closeMin = parseTimeToMinutes(value)
            if (openMin !== null && closeMin !== null && closeMin - openMin < MIN_VISITING_HOURS_GAP_MINUTES) {
              return callback(new Error(t('post_property.errors.visiting_hours_min_gap')))
            }
          }
          callback()
        },
        trigger: ['blur', 'change'],
      },
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
    3: ['rent', 'minStay', 'availableFrom', 'openTime', 'closeTime'],
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
