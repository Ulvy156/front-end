<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminSettings } from '~/features/admin/composables/useAdminSettings'
import { KNOWN_SETTING_KEYS, type SettingValue, type UpdatePlatformSettingsPayload } from '~/features/admin/types/settings'
import SettingFormDrawer from './SettingFormDrawer.vue'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const { data, isPending, updateSettings, createSetting, updateCustomSetting } = useAdminSettings()

const { formRef, form, isSubmitting, handleSubmit } = useForm({
  maintenanceMode: false,
  registrationEnabled: true,
  maxPropertiesPerLandlord: 0,
  maxImagesPerProperty: 0,
  minPropertyPrice: null as number | null,
  maxPropertyPrice: null as number | null,
})

watch(data, (settings) => {
  if (!settings) return
  form.maintenanceMode = settings.maintenanceMode
  form.registrationEnabled = settings.registrationEnabled
  form.maxPropertiesPerLandlord = settings.maxPropertiesPerLandlord
  form.maxImagesPerProperty = settings.maxImagesPerProperty
  form.minPropertyPrice = settings.minPropertyPrice
  form.maxPropertyPrice = settings.maxPropertyPrice
}, { immediate: true })

const submit = handleSubmit(async () => {
  const payload: UpdatePlatformSettingsPayload = {
    maintenanceMode: form.maintenanceMode,
    registrationEnabled: form.registrationEnabled,
    maxPropertiesPerLandlord: form.maxPropertiesPerLandlord,
    maxImagesPerProperty: form.maxImagesPerProperty,
    minPropertyPrice: form.minPropertyPrice,
    maxPropertyPrice: form.maxPropertyPrice,
  }
  try {
    await updateSettings.mutateAsync(payload)
    success(t('admin.settings.saveSuccess'))
  } catch (err) {
    notifyError(extract(err))
  }
})

const customSettings = computed(() => {
  if (!data.value) return []
  return Object.entries(data.value)
    .filter(([key]) => !KNOWN_SETTING_KEYS.includes(key))
    .map(([key, value]) => ({ key, value }))
})

const settingDrawerOpen = ref(false)
const editingSetting = ref<{ key: string, value: SettingValue } | null>(null)

function openCreateSetting() {
  editingSetting.value = null
  settingDrawerOpen.value = true
}

function openEditSetting(row: { key: string, value: SettingValue }) {
  editingSetting.value = row
  settingDrawerOpen.value = true
}
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

      <div class="flex items-center justify-end">
        <BaseButton type="primary" native-type="submit" :loading="isSubmitting">
          {{ t('admin.settings.save') }}
        </BaseButton>
      </div>
    </el-form>

    <!-- Custom Settings -->
    <div v-if="!isPending" class="bg-white rounded-xl border border-gray-200 p-5 mt-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-900">{{ t('admin.settings.custom.title') }}</h2>
        <BaseButton size="small" @click="openCreateSetting">
          {{ t('admin.settings.custom.addButton') }}
        </BaseButton>
      </div>

      <p v-if="!customSettings.length" class="text-sm text-gray-400">{{ t('admin.settings.custom.empty') }}</p>
      <el-table v-else :data="customSettings" row-key="key">
        <el-table-column :label="t('admin.settings.custom.columns.key')" prop="key" min-width="140" />
        <el-table-column :label="t('admin.settings.custom.columns.value')" min-width="200">
          <template #default="{ row }">{{ JSON.stringify(row.value) }}</template>
        </el-table-column>
        <el-table-column :label="t('admin.settings.custom.columns.type')" width="100">
          <template #default="{ row }">{{ row.value === null ? 'null' : Array.isArray(row.value) ? 'array' : typeof row.value }}</template>
        </el-table-column>
        <el-table-column :label="t('admin.settings.custom.columns.actions')" width="70" align="right">
          <template #default="{ row }">
            <el-tooltip :content="t('admin.settings.custom.editAction')" placement="top">
              <BaseButton text size="small" @click="openEditSetting(row)">
                <BaseIcon name="pencil" :size="15" />
              </BaseButton>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <SettingFormDrawer
      v-model="settingDrawerOpen"
      :edit-item="editingSetting"
      :create-mutation="createSetting"
      :update-mutation="updateCustomSetting"
    />
  </div>
</template>
