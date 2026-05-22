<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminProperties } from '~/features/admin/composables/useAdminProperties'
import type { AdminProperty } from '~/features/admin/types/property'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const config = useRuntimeConfig()
const langKey = useLangKey()

const { data, isPending, togglePublish, toggleAvailability, setFeatured, deleteProperty } = useAdminProperties()

// ── Client-side filter + pagination ──────────────────────────
const searchQuery  = ref('')
const statusFilter = ref<'all' | 'published' | 'unpublished'>('all')
const currentPage  = ref(1)
const PAGE_SIZE    = 20
const FEATURED_MAX = 3

const featuredCount = computed(() => data.value?.filter(p => p.isFeatured).length ?? 0)

const filteredItems = computed<AdminProperty[]>(() => {
  if (!data.value) return []
  let list = data.value
  if (statusFilter.value === 'published')   list = list.filter(p => p.isPublished)
  if (statusFilter.value === 'unpublished') list = list.filter(p => !p.isPublished)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(p =>
    p.title.toLowerCase().includes(q) || p.user.name.toLowerCase().includes(q),
  )
  return list
})

const paginatedItems = computed(() =>
  filteredItems.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
)

watch([searchQuery, statusFilter], () => { currentPage.value = 1 })

function imageUrl(imageKey: string) {
  return `${config.public.R2_PUB_URL}/${imageKey}`
}

function locationLabel(p: AdminProperty) {
  return `${p.district[langKey.value]}, ${p.district.province[langKey.value]}`
}

// ── Per-row loading state ─────────────────────────────────────
const publishingId   = ref<string | null>(null)
const availabilityId = ref<string | null>(null)
const featuringId    = ref<string | null>(null)
const deletingId     = ref<string | null>(null)

async function handleTogglePublish(prop: AdminProperty) {
  publishingId.value = prop.id
  try {
    await togglePublish.mutateAsync(prop.id)
    success(prop.isPublished ? t('admin.properties.unpublishSuccess') : t('admin.properties.publishSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { publishingId.value = null }
}

async function handleToggleAvailability(prop: AdminProperty) {
  availabilityId.value = prop.id
  try {
    await toggleAvailability.mutateAsync(prop.id)
    success(prop.isAvailable ? t('admin.properties.unavailableSuccess') : t('admin.properties.availableSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { availabilityId.value = null }
}

async function handleSetFeatured(prop: AdminProperty) {
  featuringId.value = prop.id
  try {
    await setFeatured.mutateAsync(prop.id)
    success(prop.isFeatured ? t('admin.properties.unfeatureSuccess') : t('admin.properties.featureSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { featuringId.value = null }
}

async function handleDelete(prop: AdminProperty) {
  try {
    await ElMessageBox.confirm(
      t('admin.properties.deleteConfirm', { title: prop.title }),
      t('admin.properties.deleteTitle'),
      { type: 'warning', confirmButtonText: t('admin.users.deleteConfirmBtn'), cancelButtonText: t('admin.users.form.cancel') },
    )
  } catch { return }

  deletingId.value = prop.id
  try {
    await deleteProperty.mutateAsync(prop.id)
    success(t('admin.properties.deleteSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { deletingId.value = null }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ $t('admin.properties.title') }}</h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ $t('admin.properties.totalCount', { n: filteredItems.length }) }}
        </p>
      </div>
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border"
        :class="featuredCount >= FEATURED_MAX
          ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-gray-50 border-gray-200 text-gray-600'"
      >
        <BaseIcon name="star" :size="14" :class="featuredCount >= FEATURED_MAX ? 'text-amber-500' : 'text-gray-400'" />
        {{ $t('admin.properties.featuredCount', { n: featuredCount, max: FEATURED_MAX }) }}
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <el-input v-model="searchQuery" :placeholder="$t('admin.properties.searchPlaceholder')" clearable class="max-w-72">
        <template #prefix>
          <BaseIcon name="search" :size="14" class="text-gray-400" />
        </template>
      </el-input>
      <el-select v-model="statusFilter" class="w-44">
        <el-option :label="$t('admin.properties.filterAll')"         value="all" />
        <el-option :label="$t('admin.properties.filterPublished')"   value="published" />
        <el-option :label="$t('admin.properties.filterUnpublished')" value="unpublished" />
      </el-select>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="8" leading="square" leading-size="48px" :lines="2" />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <el-table :data="paginatedItems" row-key="id">

        <el-table-column :label="$t('admin.properties.columns.property')" min-width="260">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                <img v-if="row.images.length" :src="imageUrl(row.images[0].imageKey)" :alt="row.title" class="w-full h-full object-cover" />
                <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ row.title }}</p>
                <p class="text-xs text-gray-400 truncate">{{ row.user.name }} · {{ locationLabel(row) }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.properties.columns.status')" width="170">
          <template #default="{ row }">
            <div class="flex flex-col gap-1">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                :class="row.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
                {{ row.isPublished ? $t('admin.properties.published') : $t('admin.properties.unpublished') }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                :class="row.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'">
                {{ row.isAvailable ? $t('admin.properties.available') : $t('admin.properties.unavailable') }}
              </span>
              <span v-if="row.isFeatured" class="text-xs px-2 py-0.5 rounded-full font-medium w-fit bg-amber-50 text-amber-600">
                {{ $t('admin.properties.featured') }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.properties.columns.price')" width="110">
          <template #default="{ row }">
            <span class="text-sm font-semibold text-gray-900">${{ row.monthly_price }}</span>
            <span class="text-xs text-gray-400">/mo</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.properties.columns.engagement')" width="100">
          <template #default="{ row }">
            <div class="flex flex-col gap-1 text-xs text-gray-500">
              <span class="flex items-center gap-1"><BaseIcon name="eye" :size="12" /> {{ row.totalViews.toLocaleString() }}</span>
              <span class="flex items-center gap-1"><BaseIcon name="heart" :size="12" /> {{ row.favouriteCount }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.properties.columns.created')" width="110">
          <template #default="{ row }">
            <span class="text-xs text-gray-500">{{ dayjs(row.createdAt).format('MMM D, YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.actions')" width="160" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-0.5">
              <el-tooltip
                :content="row.isFeatured ? $t('admin.properties.unfeature') : featuredCount >= FEATURED_MAX ? $t('admin.properties.featuredMaxReached') : $t('admin.properties.feature')"
                placement="top"
              >
                <el-button text size="small" :loading="featuringId === row.id"
                  :disabled="!row.isFeatured && featuredCount >= FEATURED_MAX"
                  :class="row.isFeatured ? 'text-amber-500!' : 'text-gray-400!'"
                  @click="handleSetFeatured(row)">
                  <BaseIcon name="star" :size="15" />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="row.isPublished ? $t('admin.properties.unpublish') : $t('admin.properties.publish')" placement="top">
                <el-button text size="small" :loading="publishingId === row.id"
                  :class="row.isPublished ? 'text-emerald-600!' : 'text-gray-400!'"
                  @click="handleTogglePublish(row)">
                  <BaseIcon :name="row.isPublished ? 'eye' : 'eye-off'" :size="15" />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="row.isAvailable ? $t('admin.properties.markUnavailable') : $t('admin.properties.markAvailable')" placement="top">
                <el-button text size="small" :loading="availabilityId === row.id"
                  :class="row.isAvailable ? 'text-blue-500!' : 'text-gray-400!'"
                  @click="handleToggleAvailability(row)">
                  <BaseIcon :name="row.isAvailable ? 'door-open' : 'door-closed'" :size="15" />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('admin.users.deleteAction')" placement="top">
                <el-button text size="small" class="text-red-500!" :loading="deletingId === row.id" @click="handleDelete(row)">
                  <BaseIcon name="trash-2" :size="15" />
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filteredItems.length > PAGE_SIZE" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-400">
          {{ $t('admin.users.showing', {
            from: (currentPage - 1) * PAGE_SIZE + 1,
            to: Math.min(currentPage * PAGE_SIZE, filteredItems.length),
            total: filteredItems.length,
          }) }}
        </p>
        <el-pagination v-model:current-page="currentPage" :page-size="PAGE_SIZE" :total="filteredItems.length" layout="prev, pager, next" />
      </div>
    </div>
  </div>
</template>
