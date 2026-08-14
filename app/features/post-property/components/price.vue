<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.pricing.title") }}
      </h2>
      <p class="text-sm text-gray-500 mt-4">{{ t("post_property.pricing.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Monthly Rent + Security Deposit -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

      <!-- Monthly Rent -->
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.pricing.monthly_rent") }}
          <span class="text-red-500">*</span>
        </label>
        <el-form-item prop="rent">
          <BaseInput
            :model-value="form.rent"
            type="number"
            icon="dollar-sign"
            placeholder="0"
            @update:model-value="(val: string) => { form.rent = val }"
          />
        </el-form-item>
        <p v-if="rentBoundsHint" class="text-xs text-gray-400 -mt-3 mb-1">{{ rentBoundsHint }}</p>
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
        class="bg-emerald-50 border border-emerald-200 rounded-xl px-4.5 py-4 mb-6"
      >
        <p class="text-[11px] font-bold text-(--nav-active-item) uppercase tracking-wide mb-2.5">
          {{ t("post_property.pricing.move_in_estimate") }}
        </p>
        <div class="flex justify-between text-[13.5px] text-gray-700 mb-1.5">
          <span>{{ t("post_property.pricing.monthly_rent") }}</span>
          <span>${{ Number(form.rent || 0).toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-[13.5px] text-gray-700 mb-2.5">
          <span>{{ t("post_property.pricing.security_deposit") }}</span>
          <span>${{ Number(form.deposit || 0).toLocaleString() }}</span>
        </div>
        <div class="h-px bg-emerald-200 mb-2.5"></div>
        <div class="flex justify-between text-base font-bold text-(--nav-active-item)">
          <span>{{ t("post_property.pricing.total_due") }}</span>
          <span>${{ moveInTotal.toLocaleString() }}</span>
        </div>
      </div>
    </transition>

    <!-- Minimum Stay Length -->
    <div class="mb-6">
      <label class="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
        <BaseIconClient name="clock" :size="16" class="text-gray-500" />
        {{ t("post_property.pricing.min_stay") }}
        <span class="text-red-500">*</span>
      </label>

      <el-form-item prop="minStay">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in stayOptions"
            :key="option.value"
            type="button"
            @click="form.minStay = option.value"
            :class="form.minStay === option.value
              ? 'border-(--nav-active-item) bg-(--nav-active-item) text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
            class="px-4 py-2.5 border rounded-full text-[13.5px] font-semibold transition cursor-pointer"
          >
            {{ t(`post_property.pricing.stay_options.${option.value}.label`) }}
          </button>
        </div>
      </el-form-item>
    </div>

    <!-- Available From -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.pricing.available_from") }}
        <span class="text-red-500">*</span>
      </label>
      <el-form-item prop="availableFrom">
        <BaseDatePicker
          :model-value="form.availableFrom"
          :placeholder="t('post_property.pricing.available_from')"
          @update:model-value="form.availableFrom = $event"
        />
      </el-form-item>
      <p class="text-xs text-gray-400 -mt-3 mb-1">{{ t("post_property.pricing.available_from_hint") }}</p>
    </div>

    <!-- Visiting Hours (collapsible) -->
    <div class="border border-gray-200 rounded-xl px-4.5 py-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-[14.5px] font-semibold text-gray-900">{{ t("post_property.pricing.visiting_hours") }}</div>
          <div class="text-xs text-gray-500 mt-0.5">{{ t("post_property.pricing.visiting_hours_desc") }}</div>
        </div>
        <button
          type="button"
          @click="toggleHours"
          :class="hoursEnabled ? 'bg-emerald-500' : 'bg-gray-300'"
          class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-none outline-none"
        >
          <span
            :class="hoursEnabled ? 'translate-x-5' : 'translate-x-0.5'"
            class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 block"
          ></span>
        </button>
      </div>

      <div v-if="hoursEnabled" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-800 mb-1.5">
            {{ t("post_property.pricing.open_time") }}
          </label>
          <BaseTimePicker
            v-model="form.openTime"
            :placeholder="t('post_property.pricing.open_time')"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-800 mb-1.5">
            {{ t("post_property.pricing.close_time") }}
          </label>
          <BaseTimePicker
            v-model="form.closeTime"
            :placeholder="t('post_property.pricing.close_time')"
          />
        </div>
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
import { inject, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import BaseDatePicker from "~/components/ui/BaseDatePicker.vue"
import BaseTimePicker from "~/components/ui/BaseTimePicker.vue"
import BaseToggle from "~/components/ui/BaseToggle.vue"
import BaseInput from "~/components/ui/BaseInput.vue"
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import { useAppSettingsStore } from "~/stores/appSettings"

const { t } = useI18n()
const appSettingsStore = useAppSettingsStore()

const form = inject<any>("postPropertyForm", {})

const hoursEnabled = ref(!!(form.openTime || form.closeTime))

function toggleHours() {
  hoursEnabled.value = !hoursEnabled.value
  if (!hoursEnabled.value) {
    form.openTime = ''
    form.closeTime = ''
  }
}

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
