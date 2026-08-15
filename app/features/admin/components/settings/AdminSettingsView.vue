<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import { useAdminSettings } from '~/features/admin/composables/useAdminSettings'
import type { AppSetting, SettingValueKind } from '~/features/admin/types/settings'
import SettingFormDrawer from './SettingFormDrawer.vue'

const PAGE_SIZE = 10

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const { data, isPending, createSetting, updateSetting, deleteSetting } = useAdminSettings()

function valueType(value: AppSetting['value']): SettingValueKind {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'json'
}

const typeLabel = computed<Record<SettingValueKind, string>>(() => ({
  string: t('admin.settings.form.valueTypeString'),
  number: t('admin.settings.form.valueTypeNumber'),
  boolean: t('admin.settings.form.valueTypeBoolean'),
  json: t('admin.settings.form.valueTypeJson'),
}))

const typeBadgeClass: Record<SettingValueKind, string> = {
  string: 'bg-gray-100 text-gray-600',
  number: 'bg-blue-50 text-blue-600',
  boolean: 'bg-purple-50 text-purple-600',
  json: 'bg-amber-50 text-amber-600',
}

// ── Filters ──────────────────────────────────────────────────
const categories = computed(() => [...new Set((data.value ?? []).map(s => s.category))].sort())
const categoryOptions = computed(() => categories.value.map(c => ({ label: c, value: c })))
const categoryFilterOptions = computed(() => [
  { label: t('admin.settings.categoryFilterAll'), value: '' },
  ...categoryOptions.value,
])

const typeFilterOptions = computed(() => [
  { label: t('admin.settings.typeFilterAll'), value: '' },
  { label: t('admin.settings.form.valueTypeString'), value: 'string' },
  { label: t('admin.settings.form.valueTypeNumber'), value: 'number' },
  { label: t('admin.settings.form.valueTypeBoolean'), value: 'boolean' },
  { label: t('admin.settings.form.valueTypeJson'), value: 'json' },
])

const visibilityFilterOptions = computed(() => [
  { label: t('admin.settings.visibilityFilterAll'), value: '' },
  { label: t('admin.settings.publicYes'), value: 'public' },
  { label: t('admin.settings.publicNo'), value: 'private' },
])

const searchInput = ref('')
const selectedCategory = ref<string>('')
const typeFilter = ref<string>('')
const visibilityFilter = ref<string>('')

const filteredSettings = computed(() => {
  const search = searchInput.value.trim().toLowerCase()
  return (data.value ?? [])
    .filter((s) => {
      if (selectedCategory.value && s.category !== selectedCategory.value) return false
      if (typeFilter.value && valueType(s.value) !== typeFilter.value) return false
      if (visibilityFilter.value === 'public' && !s.isPublic) return false
      if (visibilityFilter.value === 'private' && s.isPublic) return false
      if (search && !s.key.toLowerCase().includes(search) && !(s.description ?? '').toLowerCase().includes(search)) return false
      return true
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.key.localeCompare(b.key))
})

// ── Pagination ───────────────────────────────────────────────
const page = ref(1)
watch([searchInput, selectedCategory, typeFilter, visibilityFilter], () => { page.value = 1 })

// Clamp back to the last valid page after a delete empties out the current one
watch(() => filteredSettings.value.length, (len) => {
  const maxPage = Math.max(1, Math.ceil(len / PAGE_SIZE))
  if (page.value > maxPage) page.value = maxPage
})

const paginatedSettings = computed(() =>
  filteredSettings.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
)

const maintenanceActive = computed(() =>
  (data.value ?? []).some(s => s.category === 'system' && s.key === 'maintenanceMode' && s.value === true),
)

// ── Create / edit / duplicate drawer ────────────────────────
const settingDrawerOpen = ref(false)
const editingSetting = ref<AppSetting | null>(null)
const duplicateFromSetting = ref<AppSetting | null>(null)

function openCreateSetting() {
  editingSetting.value = null
  duplicateFromSetting.value = null
  settingDrawerOpen.value = true
}

function openEditSetting(row: AppSetting) {
  editingSetting.value = row
  duplicateFromSetting.value = null
  settingDrawerOpen.value = true
}

function openDuplicateSetting(row: AppSetting) {
  editingSetting.value = null
  duplicateFromSetting.value = row
  settingDrawerOpen.value = true
}

function onCreated() {
  selectedCategory.value = ''
  page.value = 1
}

// ── Delete ───────────────────────────────────────────────────
const deletingId = ref<string | null>(null)

async function handleDelete(row: AppSetting) {
  try {
    await ElMessageBox.confirm(
      t('admin.settings.deleteConfirm', { key: row.key }),
      t('admin.settings.deleteTitle'),
      { type: 'warning', confirmButtonText: t('admin.settings.deleteConfirmBtn'), cancelButtonText: t('admin.settings.form.cancel') },
    )
  } catch { return }

  deletingId.value = row.id
  try {
    await deleteSetting.mutateAsync({ category: row.category, key: row.key })
    success(t('admin.settings.deleteSuccess'))
  } catch (err) {
    notifyError(extract(err))
  } finally {
    deletingId.value = null
  }
}

function formattedValue(row: AppSetting) {
  if (typeof row.value === 'number') return row.value.toLocaleString()
  if (typeof row.value === 'string') return row.value
  return ''
}

function jsonPreview(row: AppSetting) {
  const raw = JSON.stringify(row.value)
  return raw.length > 300 ? `${raw.slice(0, 300)}…` : raw
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ t('admin.settings.pageTitle') }}</h2>
        <p class="text-sm text-gray-400 mt-1">{{ t('admin.settings.pageDescription') }}</p>
      </div>
      <BaseButton type="primary" @click="openCreateSetting">
        <BaseIcon name="plus" :size="14" class="mr-1.5" />
        {{ t('admin.settings.addButton') }}
      </BaseButton>
    </div>

    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="6" :lines="1" />
    </div>

    <template v-else>
      <!-- Maintenance banner -->
      <div
        v-if="maintenanceActive"
        class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-4"
      >
        <BaseIcon name="alert-triangle" :size="16" class="shrink-0" />
        {{ t('admin.settings.maintenanceBannerActive') }}
      </div>

      <!-- Filter toolbar -->
      <div class="grid grid-cols-2 items-center gap-3 mb-4 bg-white rounded-xl border border-gray-200 p-3">
        <BaseInput
          v-model="searchInput"
          :placeholder="t('admin.settings.searchPlaceholder')"
          clearable
          icon="search"
          class="flex-1 min-w-56"
        />
        <BaseSelect v-model="selectedCategory" :options="categoryFilterOptions" :placeholder="t('admin.settings.categoryLabel')" class="w-44" />
        <BaseSelect v-model="typeFilter" :options="typeFilterOptions" :placeholder="t('admin.settings.form.valueType')" class="w-36" />
        <BaseSelect v-model="visibilityFilter" :options="visibilityFilterOptions" :placeholder="t('admin.settings.columns.public')" class="w-36" />
      </div>

      <p class="text-xs text-gray-400 mb-2">
        {{ t('admin.settings.totalCount', { n: filteredSettings.length }) }}
      </p>

      <!-- Empty state -->
      <div v-if="!filteredSettings.length" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <BaseIcon name="search-x" :size="32" class="text-gray-300 mx-auto mb-3" />
        <p class="text-sm font-medium text-gray-700">{{ t('admin.settings.emptyTitle') }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ t('admin.settings.emptyDescription') }}</p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <el-table :data="paginatedSettings" row-key="id">
          <el-table-column :label="t('admin.settings.columns.key')" min-width="220">
            <template #default="{ row }">
              <div class="py-2">
                <p class="text-sm font-medium text-gray-900 font-mono break-all">{{ row.key }}</p>
                <p class="text-xs text-gray-400">{{ row.category }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('admin.settings.columns.value')" min-width="160">
            <template #default="{ row }">
              <span
                v-if="typeof row.value === 'boolean'"
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="row.value ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ row.value ? 'true' : 'false' }}
              </span>
              <span v-else-if="typeof row.value === 'number'" class="text-sm font-mono text-gray-900">
                {{ formattedValue(row) }}
              </span>
              <span v-else-if="typeof row.value === 'string'" class="text-sm text-gray-700 wrap-break-word">
                {{ formattedValue(row) || '—' }}
              </span>
              <el-tooltip v-else :content="jsonPreview(row)" placement="top">
                <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600 cursor-default">
                  <BaseIcon name="braces" :size="11" />
                  {{ t('admin.settings.form.valueTypeJson') }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column :label="t('admin.settings.columns.type')" width="100">
            <template #default="{ row }">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="typeBadgeClass[valueType(row.value)]">
                {{ typeLabel[valueType(row.value)] }}
              </span>
            </template>
          </el-table-column>

          <el-table-column :label="t('admin.settings.columns.description')" min-width="260">
            <template #default="{ row }">
              <p class="text-xs text-gray-500 leading-relaxed py-1 wrap-break-word whitespace-normal">{{ row.description ?? '—' }}</p>
            </template>
          </el-table-column>

          <el-table-column :label="t('admin.settings.columns.public')" width="110">
            <template #default="{ row }">
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="row.isPublic ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ row.isPublic ? t('admin.settings.publicYes') : t('admin.settings.publicNo') }}
              </span>
            </template>
          </el-table-column>

          <el-table-column :label="t('admin.settings.columns.actions')" width="80" align="center">
            <template #default="{ row }">
              <el-dropdown trigger="click" :disabled="deletingId === row.id">
                <BaseButton text size="small" class="text-gray-400!" :loading="deletingId === row.id">
                  <BaseIcon name="ellipsis-vertical" :size="16" />
                </BaseButton>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="openEditSetting(row)">
                      <BaseIcon name="pencil" :size="14" class="mr-2" />
                      {{ t('admin.settings.editAction') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="openDuplicateSetting(row)">
                      <BaseIcon name="copy" :size="14" class="mr-2" />
                      {{ t('admin.settings.duplicateAction') }}
                    </el-dropdown-item>
                    <el-dropdown-item divided class="text-red-500!" @click="handleDelete(row)">
                      <BaseIcon name="trash-2" :size="14" class="mr-2" />
                      {{ t('admin.settings.deleteAction') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="filteredSettings.length > PAGE_SIZE" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p class="text-xs text-gray-400">
            {{ t('admin.users.showing', {
              from: (page - 1) * PAGE_SIZE + 1,
              to: Math.min(page * PAGE_SIZE, filteredSettings.length),
              total: filteredSettings.length,
            }) }}
          </p>
          <BasePagination :total="filteredSettings.length" :page-size="PAGE_SIZE" :current-page="page" @update:current-page="page = $event" />
        </div>
      </div>
    </template>

    <SettingFormDrawer
      v-model="settingDrawerOpen"
      :edit-item="editingSetting"
      :duplicate-from="duplicateFromSetting"
      :default-category="selectedCategory || undefined"
      :category-options="categoryOptions"
      :create-mutation="createSetting"
      :update-mutation="updateSetting"
      @created="onCreated"
    />
  </div>
</template>
