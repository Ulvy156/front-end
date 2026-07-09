<script setup lang="ts">
import dayjs from 'dayjs'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminSettings } from '~/features/admin/composables/useAdminSettings'
import type { UpdatePlatformSettingsPayload } from '~/features/admin/types/settings'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const { data, isPending, updateSettings } = useAdminSettings()

const { formRef, form, isSubmitting, handleSubmit } = useForm({
  maintenanceMode: false,
  registrationEnabled: true,
  maxPropertiesPerLandlord: 0,
  maxImagesPerProperty: 0,
  minPropertyPrice: null as number | null,
  maxPropertyPrice: null as number | null,
  commissionRate: 0,
})

watch(data, (settings) => {
  if (!settings) return
  form.maintenanceMode = settings.maintenanceMode
  form.registrationEnabled = settings.registrationEnabled
  form.maxPropertiesPerLandlord = settings.maxPropertiesPerLandlord
  form.maxImagesPerProperty = settings.maxImagesPerProperty
  form.minPropertyPrice = settings.minPropertyPrice === null ? null : Number(settings.minPropertyPrice)
  form.maxPropertyPrice = settings.maxPropertyPrice === null ? null : Number(settings.maxPropertyPrice)
  form.commissionRate = Number(settings.commissionRate)
}, { immediate: true })

const submit = handleSubmit(async () => {
  const payload: UpdatePlatformSettingsPayload = {
    maintenanceMode: form.maintenanceMode,
    registrationEnabled: form.registrationEnabled,
    maxPropertiesPerLandlord: form.maxPropertiesPerLandlord,
    maxImagesPerProperty: form.maxImagesPerProperty,
    minPropertyPrice: form.minPropertyPrice,
    maxPropertyPrice: form.maxPropertyPrice,
    commissionRate: form.commissionRate,
  }
  try {
    await updateSettings.mutateAsync(payload)
    success(t('admin.settings.saveSuccess'))
  } catch (err) {
    notifyError(extract(err))
  }
})
</script>

<template>
  <div class="max-w-2xl">
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="6" :lines="1" />
    </div>

    <el-form v-else ref="formRef" :model="form" class="space-y-6" @submit.prevent="submit">
      <!-- Maintenance banner -->
      <div
        v-if="form.maintenanceMode"
        class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        <BaseIcon name="alert-triangle" :size="16" class="shrink-0" />
        {{ t('admin.settings.maintenanceBannerActive') }}
      </div>

      <!-- Access Control -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ t('admin.settings.access.title') }}</h2>

        <div class="flex items-center justify-between py-2">
          <div class="pr-4">
            <p class="text-sm font-medium text-gray-900">{{ t('admin.settings.access.maintenanceMode') }}</p>
            <p class="text-xs text-gray-400">{{ t('admin.settings.access.maintenanceModeHint') }}</p>
          </div>
          <el-switch v-model="form.maintenanceMode" />
        </div>

        <div class="flex items-center justify-between py-2 border-t border-gray-100">
          <div class="pr-4">
            <p class="text-sm font-medium text-gray-900">{{ t('admin.settings.access.registrationEnabled') }}</p>
            <p class="text-xs text-gray-400">{{ t('admin.settings.access.registrationEnabledHint') }}</p>
          </div>
          <el-switch v-model="form.registrationEnabled" />
        </div>
      </div>

      <!-- Listing Limits -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ t('admin.settings.limits.title') }}</h2>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              {{ t('admin.settings.limits.maxPropertiesPerLandlord') }}
            </label>
            <el-input-number v-model="form.maxPropertiesPerLandlord" :min="1" class="w-full" controls-position="right" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              {{ t('admin.settings.limits.maxImagesPerProperty') }}
            </label>
            <el-input-number v-model="form.maxImagesPerProperty" :min="1" class="w-full" controls-position="right" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              {{ t('admin.settings.limits.minPropertyPrice') }}
            </label>
            <el-input-number
              v-model="form.minPropertyPrice"
              :min="0"
              :controls="false"
              class="w-full"
              :placeholder="t('admin.settings.limits.noBound')"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              {{ t('admin.settings.limits.maxPropertyPrice') }}
            </label>
            <el-input-number
              v-model="form.maxPropertyPrice"
              :min="0"
              :controls="false"
              class="w-full"
              :placeholder="t('admin.settings.limits.noBound')"
            />
          </div>
        </div>
      </div>

      <!-- Billing -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ t('admin.settings.billing.title') }}</h2>

        <label class="block text-xs font-medium text-gray-500 mb-1.5">
          {{ t('admin.settings.billing.commissionRate') }}
        </label>
        <el-input-number v-model="form.commissionRate" :min="0" :max="100" :step="0.5" :precision="2" controls-position="right" />
        <p class="text-xs text-gray-400 mt-1.5">{{ t('admin.settings.billing.commissionRateHint') }}</p>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="data?.updatedAt" class="text-xs text-gray-400">
          {{ t('admin.settings.lastUpdated', { date: dayjs(data.updatedAt).format('MMM D, YYYY h:mm A') }) }}
        </p>
        <el-button type="primary" native-type="submit" :loading="isSubmitting" class="ml-auto">
          {{ t('admin.settings.save') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
