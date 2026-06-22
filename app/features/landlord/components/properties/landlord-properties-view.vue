<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useLandlordProperties } from '~/features/landlord/composables/useLandlordProperties'
import type { LandlordProperty, LandlordPropertiesFilter } from '~/features/landlord/types/property'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const langKey = useLangKey()

const searchInput = ref('')
const statusFilter = ref<'all' | 'published' | 'unpublished'>('all')
const availabilityFilter = ref<'all' | 'available' | 'unavailable'>('all')
const PAGE_SIZE = 20

const filters = ref<LandlordPropertiesFilter>({
  page: 1,
  limit: PAGE_SIZE,
})

const searchDebounce = ref<ReturnType<typeof setTimeout>>()
watch(searchInput, (val) => {
  clearTimeout(searchDebounce.value)
  searchDebounce.value = setTimeout(() => {
    filters.value = { ...filters.value, search: val.trim() || undefined, page: 1 }
  }, 300)
})

watch(statusFilter, (val) => {
  filters.value = {
    ...filters.value,
    isPublished: val === 'published' ? true : val === 'unpublished' ? false : undefined,
    page: 1,
  }
})

watch(availabilityFilter, (val) => {
  filters.value = {
    ...filters.value,
    isAvailable: val === 'available' ? true : val === 'unavailable' ? false : undefined,
    page: 1,
  }
})

const { data, isPending, duplicateProperty } = useLandlordProperties(filters)

const items = computed(() => data.value?.items ?? [])
const meta = computed(() => data.value?.meta)

function locationLabel(p: LandlordProperty) {
  return `${p.district[langKey.value]}, ${p.district.province[langKey.value]}`
}

function handlePageChange(page: number) {
  filters.value = { ...filters.value, page }
}

const duplicatingId = ref<string | null>(null)

async function handleDuplicate(prop: LandlordProperty) {
  try {
    await ElMessageBox.confirm(
      t('landlord.properties.duplicateConfirm', { title: prop.title }),
      t('landlord.properties.duplicateTitle'),
      { type: 'info', confirmButtonText: t('landlord.properties.duplicateBtn'), cancelButtonText: t('landlord.properties.cancelBtn') },
    )
  } catch { return }

  duplicatingId.value = prop.id
  try {
    await duplicateProperty.mutateAsync(prop.id)
    success(t('landlord.properties.duplicateSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { duplicatingId.value = null }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-gray-400">
        {{ t('landlord.properties.totalCount', { n: meta?.total ?? 0 }) }}
      </p>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <el-input v-model="searchInput" :placeholder="t('landlord.properties.searchPlaceholder')" clearable class="max-w-72">
        <template #prefix>
          <BaseIcon name="search" :size="14" class="text-gray-400" />
        </template>
      </el-input>
      <el-select v-model="statusFilter" class="w-44">
        <el-option :label="t('landlord.properties.filterAll')" value="all" />
        <el-option :label="t('landlord.properties.filterPublished')" value="published" />
        <el-option :label="t('landlord.properties.filterUnpublished')" value="unpublished" />
      </el-select>
      <el-select v-model="availabilityFilter" class="w-44">
        <el-option :label="t('landlord.properties.filterAllAvailability')" value="all" />
        <el-option :label="t('landlord.properties.filterAvailable')" value="available" />
        <el-option :label="t('landlord.properties.filterUnavailable')" value="unavailable" />
      </el-select>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="8" leading="square" leading-size="48px" :lines="2" />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Empty -->
      <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <ClientOnly>
          <BaseIcon name="building" :size="40" class="text-gray-300" />
        </ClientOnly>
        <p class="text-sm text-gray-400">{{ t('landlord.properties.noProperties') }}</p>
      </div>

      <template v-else>
        <el-table :data="items" row-key="id">
          <el-table-column :label="t('landlord.properties.columns.property')" min-width="280">
            <template #default="{ row }">
              <div class="flex items-center gap-3 py-1">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                  <BaseImage v-if="row.images.length" :src="row.images[0].imageKey" :alt="row.title" />
                  <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ row.title }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ locationLabel(row) }}</p>
                  <p class="text-xs text-gray-400">{{ row.propertyType[langKey] }}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('landlord.properties.columns.status')" width="170">
            <template #default="{ row }">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                  :class="row.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                >
                  {{ row.isPublished ? t('landlord.properties.published') : t('landlord.properties.unpublished') }}
                </span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                  :class="row.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
                >
                  {{ row.isAvailable ? t('landlord.properties.available') : t('landlord.properties.unavailable') }}
                </span>
                <span v-if="row.isFeatured" class="text-xs px-2 py-0.5 rounded-full font-medium w-fit bg-amber-50 text-amber-600">
                  {{ t('landlord.properties.featured') }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('landlord.properties.columns.price')" width="110">
            <template #default="{ row }">
              <span class="text-sm font-semibold text-gray-900">${{ row.monthly_price }}</span>
              <span class="text-xs text-gray-400">/mo</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('landlord.properties.columns.engagement')" width="120">
            <template #default="{ row }">
              <div class="flex flex-col gap-1 text-xs text-gray-500">
                <span class="flex items-center gap-1"><BaseIcon name="eye" :size="12" /> {{ row.totalViews.toLocaleString() }}</span>
                <span class="flex items-center gap-1"><BaseIcon name="heart" :size="12" /> {{ row.favouriteCount }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('landlord.properties.columns.created')" width="120">
            <template #default="{ row }">
              <span class="text-xs text-gray-500">{{ dayjs(row.createdAt).format('MMM D, YYYY') }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('landlord.properties.columns.actions')" width="80" align="right">
            <template #default="{ row }">
              <el-tooltip :content="t('landlord.properties.duplicate')" placement="top">
                <el-button text size="small" class="text-gray-400!" :loading="duplicatingId === row.id" @click="handleDuplicate(row)">
                  <BaseIcon name="copy" :size="15" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p class="text-xs text-gray-400">
            {{ t('landlord.properties.showing', {
              from: (meta.page - 1) * meta.limit + 1,
              to: Math.min(meta.page * meta.limit, meta.total),
              total: meta.total,
            }) }}
          </p>
          <el-pagination
            :current-page="meta.page"
            :page-size="meta.limit"
            :total="meta.total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>
