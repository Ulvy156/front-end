<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminProperties } from '~/features/admin/composables/useAdminProperties'
import { useAdminLandlords, type UserFilters } from '~/features/admin/composables/useAdminUsers'
import type { AdminProperty, AdminPropertiesFilter } from '~/features/admin/types/property'
import PropertyDetailsDrawer from './PropertyDetailsDrawer.vue'

const props = defineProps<{
  presetFilter?: 'pending' | 'featured'
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const langKey = useLangKey()
const route = useRoute()
const router = useRouter()

// ── Server-side filter + pagination ─────────────────────────
const searchInput = ref('')
const statusFilter = ref<'all' | 'published' | 'unpublished'>(
  props.presetFilter === 'pending' ? 'unpublished' : 'all',
)
const PAGE_SIZE = 20
const FEATURED_MAX = 3

const filters = ref<AdminPropertiesFilter>({
  page: 1,
  limit: PAGE_SIZE,
  propertyId: (route.query.propertyId as string) || undefined,
  isPublished: props.presetFilter === 'pending' ? false : undefined,
  isFeatured: props.presetFilter === 'featured' ? true : undefined,
})

// ── Deep-link to a single property (e.g. from a report) ────────
const isPinnedToProperty = computed(() => !!filters.value.propertyId)
const isPresetView = computed(() => !!props.presetFilter && !isPinnedToProperty.value)

function clearPresetFilter() {
  router.push('/admin/properties')
}

watch(() => route.query.propertyId, (val) => {
  filters.value = { ...filters.value, propertyId: (val as string) || undefined, page: 1 }
})

function clearPropertyFilter() {
  const query = { ...route.query }
  delete query.propertyId
  router.replace({ query })
}

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

// ── Landlord filter (remote search by name/email → landlordId) ─
const selectedLandlordId = ref<string>()
const landlordSearchFilters = ref<UserFilters>({ search: '', page: 1, limit: 10 })
const { data: landlordOptions, isPending: landlordSearchPending } = useAdminLandlords(landlordSearchFilters)

const landlordSearchDebounce = ref<ReturnType<typeof setTimeout>>()
function onLandlordSearch(query: string) {
  clearTimeout(landlordSearchDebounce.value)
  landlordSearchDebounce.value = setTimeout(() => {
    landlordSearchFilters.value = { ...landlordSearchFilters.value, search: query, page: 1 }
  }, 300)
}

watch(selectedLandlordId, (val) => {
  filters.value = { ...filters.value, landlordId: val || undefined, page: 1 }
})

const { data, isPending, togglePublish, toggleAvailability, setFeatured, deleteProperty } = useAdminProperties(filters)

const items = computed(() => data.value?.items ?? [])
const meta = computed(() => data.value?.meta)
const featuredCount = computed(() => items.value.filter(p => p.isFeatured).length)

function locationLabel(p: AdminProperty) {
  return `${p.district[langKey.value]}, ${p.district.province[langKey.value]}`
}

function handlePageChange(page: number) {
  filters.value = { ...filters.value, page }
}

// ── Per-row loading state ─────────────────────────────────────
const publishingId   = ref<string | null>(null)
const availabilityId = ref<string | null>(null)
const featuringId    = ref<string | null>(null)
const deletingId     = ref<string | null>(null)

// ── Details drawer ─────────────────────────────────────────────
const detailsDrawerOpen = ref(false)
const selectedPropertyId = ref<string | null>(null)

function viewDetails(prop: AdminProperty) {
  selectedPropertyId.value = prop.id
  detailsDrawerOpen.value = true
}

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
      <p class="text-sm text-gray-400">
        {{ $t('admin.properties.totalCount', { n: meta?.total ?? 0 }) }}
      </p>
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

    <!-- Pinned to a single property (deep-linked, e.g. from a report) -->
    <div
      v-if="isPinnedToProperty"
      class="flex items-center justify-between mb-4 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-100"
    >
      <p class="flex items-center gap-2 text-sm text-blue-700">
        <BaseIcon name="filter" :size="14" />
        {{ $t('admin.properties.viewingSingle') }}
      </p>
      <el-button text size="small" @click="clearPropertyFilter">
        {{ $t('admin.properties.viewAllProperties') }}
      </el-button>
    </div>

    <!-- Pinned to a preset filter (Pending Approval / Featured nav items) -->
    <div
      v-else-if="isPresetView"
      class="flex items-center justify-between mb-4 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-100"
    >
      <p class="flex items-center gap-2 text-sm text-blue-700">
        <BaseIcon name="filter" :size="14" />
        {{ props.presetFilter === 'pending' ? $t('admin.properties.viewingPending') : $t('admin.properties.viewingFeatured') }}
      </p>
      <el-button text size="small" @click="clearPresetFilter">
        {{ $t('admin.properties.viewAllProperties') }}
      </el-button>
    </div>

    <!-- Filters -->
    <div v-else class="flex gap-3 mb-4">
      <el-input v-model="searchInput" :placeholder="$t('admin.properties.searchPlaceholder')" clearable class="max-w-72">
        <template #prefix>
          <BaseIcon name="search" :size="14" class="text-gray-400" />
        </template>
      </el-input>
      <el-select v-model="statusFilter" class="w-44">
        <el-option :label="$t('admin.properties.filterAll')"         value="all" />
        <el-option :label="$t('admin.properties.filterPublished')"   value="published" />
        <el-option :label="$t('admin.properties.filterUnpublished')" value="unpublished" />
      </el-select>
      <el-select
        v-model="selectedLandlordId"
        filterable
        remote
        clearable
        reserve-keyword
        :remote-method="onLandlordSearch"
        :loading="landlordSearchPending"
        :placeholder="$t('admin.properties.landlordPlaceholder')"
        class="w-56"
      >
        <el-option
          v-for="l in landlordOptions?.items ?? []"
          :key="l.id"
          :label="`${l.name} (${l.email})`"
          :value="l.id"
        />
      </el-select>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="8" leading="square" leading-size="48px" :lines="2" />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <el-table :data="items" row-key="id" class="cursor-pointer" @row-click="(row) => viewDetails(row as AdminProperty)">

        <el-table-column :label="$t('admin.properties.columns.property')" min-width="260">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                <BaseImage v-if="row.images.length" :src="row.images[0].imageKey" :alt="row.title" />
                <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ row.title }}</p>
                <p class="text-xs text-gray-400 truncate">{{ row.user.name }} · {{ locationLabel(row) }}</p>
                <p class="text-xs text-gray-400">{{ row.propertyType[langKey] }}</p>
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

        <el-table-column :label="$t('admin.properties.columns.engagement')" width="120">
          <template #default="{ row }">
            <div class="flex flex-col gap-1 text-xs text-gray-500">
              <span class="flex items-center gap-1"><BaseIcon name="eye" :size="12" /> {{ row.totalViews.toLocaleString() }}</span>
              <span class="flex items-center gap-1"><BaseIcon name="heart" :size="12" /> {{ row.favouriteCount }}</span>
              <span v-if="row.reportCount" class="flex items-center gap-1 text-red-500"><BaseIcon name="flag" :size="12" /> {{ row.reportCount }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.properties.columns.created')" width="110">
          <template #default="{ row }">
            <span class="text-xs text-gray-500">{{ dayjs(row.createdAt).format('MMM D, YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.actions')" width="190" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-0.5" @click.stop>
              <el-tooltip :content="$t('admin.properties.viewDetails')" placement="top">
                <el-button text size="small" class="text-gray-400!" @click="viewDetails(row)">
                  <BaseIcon name="info" :size="15" />
                </el-button>
              </el-tooltip>
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

      <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-400">
          {{ $t('admin.users.showing', {
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
    </div>

    <PropertyDetailsDrawer v-model="detailsDrawerOpen" :property-id="selectedPropertyId" />
  </div>
</template>
