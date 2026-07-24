<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.pricing.title") }}
      </h2>
      <p class="text-sm text-gray-500 mt-4">{{ t("post_property.pricing.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Monthly Rent + Security Deposit -->
    <div class="grid grid-cols-2 gap-4 mb-6">

      <!-- Monthly Rent -->
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.pricing.monthly_rent") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.rent" class="text-red-500 text-xs font-normal ml-1">
          
           {{ formErrors.rent }}
          </span>
        </label>
        <BaseInput
          :model-value="form.rent"
          type="number"
          icon="dollar-sign"
          placeholder="0"
          @update:model-value="(val: string) => { form.rent = val; formErrors.rent = '' }"
        />
        <p v-if="rentBoundsHint" class="text-xs text-gray-400 mt-1">{{ rentBoundsHint }}</p>
      </div>

      <!-- Security Deposit -->
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.pricing.security_deposit") }}
        </label>
        <BaseInput
          :model-value="form.deposit"
          type="number"
          icon="dollar-sign"
          placeholder="0"
          @update:model-value="(val: string) => form.deposit = val"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t("post_property.pricing.deposit_hint") }}</p>
      </div>

    </div>

    <!-- Move-in cost estimate -->
    <transition name="fade">
      <div
        v-if="form.rent > 0 || form.deposit > 0"
        class="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 mb-6"
      >
        <p class="text-xs text-emerald-600 mb-1">{{ t("post_property.pricing.move_in_estimate") }}</p>
        <p class="text-xl font-medium text-emerald-800">
          ${{ moveInTotal.toLocaleString() }}
          <span class="text-sm font-normal text-emerald-600 ml-1">
            (${{ Number(form.rent).toLocaleString() }} {{ t("post_property.pricing.rent_label") }} +
            ${{ Number(form.deposit).toLocaleString() }} {{ t("post_property.pricing.deposit_label") }})
          </span>
        </p>
      </div>
    </transition>

    <!-- Minimum Stay Length -->
    <div class="mb-6">
      <label class="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
        <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ t("post_property.pricing.min_stay") }}
        <span class="text-red-500">*</span>
        <span v-if="formErrors.minStay" class="text-red-500 text-xs font-normal ml-1">
           {{ formErrors.minStay }}
        </span>
      </label>

      <div
        :class="formErrors.minStay ? 'ring-1 ring-red-300 rounded-lg' : ''"
        class="grid grid-cols-5 gap-2"
      >
        <button
          v-for="option in stayOptions"
          :key="option.value"
          type="button"
          @click="form.minStay = option.value; formErrors.minStay = ''; console.log('Min stay selected:', option.value)"
          :class="form.minStay === option.value
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          class="flex flex-col items-start px-3 py-2.5 border rounded-lg transition cursor-pointer text-left"
        >
          <span class="text-sm font-medium">{{ t(`post_property.pricing.stay_options.${option.value}.label`) }}</span>
          <span
            :class="form.minStay === option.value ? 'text-emerald-500' : 'text-gray-400'"
            class="text-xs mt-0.5"
          >
            {{ t(`post_property.pricing.stay_options.${option.value}.desc`) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Available From -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.pricing.available_from") }}
        <span class="text-red-500">*</span>
        <span v-if="formErrors.availableFrom" class="text-red-500 text-xs font-normal ml-1">
           {{ formErrors.availableFrom }}
        </span>
      </label>
      <BaseDatePicker
        :model-value="form.availableFrom"
        :placeholder="t('post_property.pricing.available_from')"
        @update:model-value="form.availableFrom = $event; formErrors.availableFrom = ''"
      />
      <p class="text-xs text-gray-400 mt-1">{{ t("post_property.pricing.available_from_hint") }}</p>
    </div>

    <!-- Open / Close Time -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.pricing.open_time") }}
        </label>
        <BaseTimePicker
          v-model="form.openTime"
          :placeholder="t('post_property.pricing.open_time')"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t("post_property.pricing.open_time_hint") }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.pricing.close_time") }}
        </label>
        <BaseTimePicker
          v-model="form.closeTime"
          :placeholder="t('post_property.pricing.close_time')"
        />
        <p class="text-xs text-gray-400 mt-1">{{ t("post_property.pricing.close_time_hint") }}</p>
      </div>
    </div>

    <!-- Property Available Toggle -->
    <BaseToggle
      v-model="form.isAvailable"
      :label="t('post_property.pricing.property_available')"
      :description="t('post_property.pricing.property_available_desc')"
    />

  </div>
</template>

<script setup lang="ts">
import { inject, computed } from "vue"
import { useI18n } from "vue-i18n"
import BaseDatePicker from "~/components/ui/BaseDatePicker.vue"
import BaseTimePicker from "~/components/ui/BaseTimePicker.vue"
import BaseToggle from "~/components/ui/BaseToggle.vue"
import BaseInput from "~/components/ui/BaseInput.vue"
import { useAppSettingsStore } from "~/stores/appSettings"

const { t } = useI18n()
const appSettingsStore = useAppSettingsStore()

const form       = inject<any>("postPropertyForm", {})
const formErrors = inject<any>("formErrors", {})

const moveInTotal = computed(() => {
  return (Number(form.rent) || 0) + (Number(form.deposit) || 0)
})

const rentBoundsHint = computed(() => {
  const min = appSettingsStore.minPropertyPrice
  const max = appSettingsStore.maxPropertyPrice
  if (min !== null && max !== null) return t('post_property.pricing.rent_range_hint', { min, max })
  if (min !== null) return t('post_property.pricing.rent_min_hint', { min })
  if (max !== null) return t('post_property.pricing.rent_max_hint', { max })
  return ''
})

const stayOptions = [
  { value: "1m" },
  { value: "3m" },
  { value: "6m" },
  { value: "1y" },
  { value: "2y" },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>