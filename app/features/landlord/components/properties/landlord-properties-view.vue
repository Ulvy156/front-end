<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { usePropertyTypeOptions } from '~/features/browse-properties/composable/usePropertyTypeOptions'
import { useLandlordProperties } from '~/features/landlord/composables/useLandlordProperties'
import type { LandlordProperty, LandlordPropertiesFilter, LandlordPropertiesSortBy, LandlordPropertiesSortOrder } from '~/features/landlord/types/property'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const langKey = useLangKey()

function localizedName(item: { nameEn: string; nameKh?: string }) {
  return langKey.value === 'nameEn' ? item.nameEn : (item.nameKh || item.nameEn)
}

// Guards the batch of ref resets in resetAllFilters() from each firing their
// own watcher (which would each patch `filters` separately and fan out into
// several redundant fetches) — resetAllFilters sets `filters` once instead.
const isResetting = ref(false)

const searchInput = ref('')
const statusFilter = ref<'all' | 'published' | 'unpublished'>('all')
const availabilityFilter = ref<'all' | 'available' | 'unavailable'>('all')
const featuredFilter = ref<'all' | 'featured' | 'unfeatured'>('all')
const propertyTypeFilter = ref<number | 'all'>('all')
const provinceFilter = ref<number | 'all'>('all')
const districtFilter = ref<number | 'all'>('all')
const priceMinInput = ref('')
const priceMaxInput = ref('')
const showMoreFilters = ref(false)

const statusOptions = computed(() => [
  { label: t('landlord.properties.filterAll'), value: 'all' },
  { label: t('landlord.properties.filterPublished'), value: 'published' },
  { label: t('landlord.properties.filterUnpublished'), value: 'unpublished' },
])
const availabilityOptions = computed(() => [
  { label: t('landlord.properties.filterAllAvailability'), value: 'all' },
  { label: t('landlord.properties.filterAvailable'), value: 'available' },
  { label: t('landlord.properties.filterUnavailable'), value: 'unavailable' },
])
const featuredOptions = computed(() => [
  { label: t('landlord.properties.filterAllFeatured'), value: 'all' },
  { label: t('landlord.properties.featuredOnly'), value: 'featured' },
  { label: t('landlord.properties.notFeatured'), value: 'unfeatured' },
])

const { data: propertyTypesData } = usePropertyTypeOptions()
const propertyTypeOptions = computed(() => [
  { label: t('landlord.properties.allPropertyTypes'), value: 'all' },
  ...propertyTypesData.value.map(pt => ({ label: localizedName(pt), value: pt.id })),
])

const { fetchProvinces, fetchDistrictsByProvinceId } = useCambodiaLocations()
const provinces = ref<{ id: number; nameEn: string; nameKh?: string }[]>([])
const districts = ref<{ id: number; nameEn: string; nameKh?: string }[]>([])
const districtsLoading = ref(false)
onMounted(async () => {
  provinces.value = await fetchProvinces()
})
const provinceOptions = computed(() => [
  { label: t('landlord.properties.allProvinces'), value: 'all' },
  ...provinces.value.map(p => ({ label: localizedName(p), value: p.id })),
])
const districtOptions = computed(() => [
  { label: t('landlord.properties.allDistricts'), value: 'all' },
  ...districts.value.map(d => ({ label: localizedName(d), value: d.id })),
])

const SORT_OPTIONS = [
  { value: 'createdAt_desc', sortBy: 'createdAt' as LandlordPropertiesSortBy, sortOrder: 'desc' as LandlordPropertiesSortOrder, labelKey: 'sortNewest' },
  { value: 'createdAt_asc', sortBy: 'createdAt' as LandlordPropertiesSortBy, sortOrder: 'asc' as LandlordPropertiesSortOrder, labelKey: 'sortOldest' },
  { value: 'monthly_price_desc', sortBy: 'monthly_price' as LandlordPropertiesSortBy, sortOrder: 'desc' as LandlordPropertiesSortOrder, labelKey: 'sortPriceHigh' },
  { value: 'monthly_price_asc', sortBy: 'monthly_price' as LandlordPropertiesSortBy, sortOrder: 'asc' as LandlordPropertiesSortOrder, labelKey: 'sortPriceLow' },
  { value: 'totalViews_desc', sortBy: 'totalViews' as LandlordPropertiesSortBy, sortOrder: 'desc' as LandlordPropertiesSortOrder, labelKey: 'sortMostViewed' },
] as const
const sortOption = ref<(typeof SORT_OPTIONS)[number]['value']>('createdAt_desc')
const sortOptions = computed(() => SORT_OPTIONS.map(o => ({ label: t(`landlord.properties.${o.labelKey}`), value: o.value })))

const advancedFilterCount = computed(() => {
  let n = 0
  if (featuredFilter.value !== 'all') n++
  if (propertyTypeFilter.value !== 'all') n++
  if (provinceFilter.value !== 'all' || districtFilter.value !== 'all') n++
  if (priceMinInput.value !== '' || priceMaxInput.value !== '') n++
  return n
})
const hasAnyFilter = computed(() =>
  advancedFilterCount.value > 0
  || searchInput.value.trim() !== ''
  || statusFilter.value !== 'all'
  || availabilityFilter.value !== 'all'
  || sortOption.value !== 'createdAt_desc',
)

interface FilterChip { key: string; label: string }
const activeChips = computed(() => {
  const chips: FilterChip[] = []
  if (featuredFilter.value !== 'all') {
    chips.push({ key: 'featured', label: featuredFilter.value === 'featured' ? t('landlord.properties.featuredOnly') : t('landlord.properties.notFeatured') })
  }
  if (propertyTypeFilter.value !== 'all') {
    const pt = propertyTypesData.value.find(p => p.id === propertyTypeFilter.value)
    if (pt) chips.push({ key: 'propertyType', label: localizedName(pt) })
  }
  if (provinceFilter.value !== 'all') {
    const prov = provinces.value.find(p => p.id === provinceFilter.value)
    const dist = districtFilter.value !== 'all' ? districts.value.find(d => d.id === districtFilter.value) : undefined
    const label = dist && prov ? `${localizedName(dist)}, ${localizedName(prov)}` : prov ? localizedName(prov) : ''
    if (label) chips.push({ key: 'location', label })
  }
  if (priceMinInput.value !== '' || priceMaxInput.value !== '') {
    const min = priceMinInput.value || '0'
    chips.push({
      key: 'price',
      label: priceMaxInput.value ? `$${min} - $${priceMaxInput.value}` : `$${min}+`,
    })
  }
  return chips
})

const PAGE_SIZE = 20

const filters = ref<LandlordPropertiesFilter>({
  page: 1,
  limit: PAGE_SIZE,
})

const searchDebounce = ref<ReturnType<typeof setTimeout>>()
watch(searchInput, (val) => {
  if (isResetting.value) return
  clearTimeout(searchDebounce.value)
  searchDebounce.value = setTimeout(() => {
    filters.value = { ...filters.value, search: val.trim() || undefined, page: 1 }
  }, 1000)
})

watch(statusFilter, (val) => {
  if (isResetting.value) return
  filters.value = {
    ...filters.value,
    isPublished: val === 'published' ? true : val === 'unpublished' ? false : undefined,
    page: 1,
  }
})

watch(availabilityFilter, (val) => {
  if (isResetting.value) return
  filters.value = {
    ...filters.value,
    isAvailable: val === 'available' ? true : val === 'unavailable' ? false : undefined,
    page: 1,
  }
})

watch(featuredFilter, (val) => {
  if (isResetting.value) return
  filters.value = {
    ...filters.value,
    isFeatured: val === 'featured' ? true : val === 'unfeatured' ? false : undefined,
    page: 1,
  }
})

watch(propertyTypeFilter, (val) => {
  if (isResetting.value) return
  filters.value = { ...filters.value, propertyTypeId: val === 'all' ? undefined : val, page: 1 }
})

watch(provinceFilter, async (val) => {
  districtFilter.value = 'all'
  if (val === 'all') {
    districts.value = []
  } else {
    districtsLoading.value = true
    districts.value = await fetchDistrictsByProvinceId(val)
    districtsLoading.value = false
  }
  if (isResetting.value) return
  filters.value = { ...filters.value, provinceId: val === 'all' ? undefined : val, districtId: undefined, page: 1 }
})

watch(districtFilter, (val) => {
  if (isResetting.value) return
  filters.value = { ...filters.value, districtId: val === 'all' ? undefined : val, page: 1 }
})

const priceDebounce = ref<ReturnType<typeof setTimeout>>()
function commitPriceFilter() {
  filters.value = {
    ...filters.value,
    minPrice: priceMinInput.value !== '' ? Number(priceMinInput.value) : undefined,
    maxPrice: priceMaxInput.value !== '' ? Number(priceMaxInput.value) : undefined,
    page: 1,
  }
}
watch([priceMinInput, priceMaxInput], () => {
  if (isResetting.value) return
  clearTimeout(priceDebounce.value)
  priceDebounce.value = setTimeout(commitPriceFilter, 1000)
})

watch(sortOption, (val) => {
  if (isResetting.value) return
  const opt = SORT_OPTIONS.find(o => o.value === val)
  if (!opt) return
  filters.value = { ...filters.value, sortBy: opt.sortBy, sortOrder: opt.sortOrder, page: 1 }
})

function clearChip(key: string) {
  if (key === 'featured') featuredFilter.value = 'all'
  else if (key === 'propertyType') propertyTypeFilter.value = 'all'
  else if (key === 'location') { provinceFilter.value = 'all'; districtFilter.value = 'all' }
  else if (key === 'price') {
    clearTimeout(priceDebounce.value)
    priceMinInput.value = ''
    priceMaxInput.value = ''
    commitPriceFilter()
  }
}

function resetAllFilters() {
  isResetting.value = true
  clearTimeout(searchDebounce.value)
  clearTimeout(priceDebounce.value)
  searchInput.value = ''
  statusFilter.value = 'all'
  availabilityFilter.value = 'all'
  featuredFilter.value = 'all'
  propertyTypeFilter.value = 'all'
  provinceFilter.value = 'all'
  districtFilter.value = 'all'
  priceMinInput.value = ''
  priceMaxInput.value = ''
  sortOption.value = 'createdAt_desc'
  filters.value = { page: 1, limit: PAGE_SIZE }
  nextTick(() => { isResetting.value = false })
}

const router = useRouter()
const { data, isPending, togglePublish, toggleAvailability, duplicateProperty } = useLandlordProperties(filters)

const items = computed(() => data.value?.items ?? [])
const meta = computed(() => data.value?.meta)

function locationLabel(p: LandlordProperty) {
  return `${p.district[langKey.value]}, ${p.district.province[langKey.value]}`
}

function handlePageChange(page: number) {
  filters.value = { ...filters.value, page }
}

const busyId = ref<string | null>(null)

async function handleTogglePublish(prop: LandlordProperty) {
  busyId.value = prop.id
  try {
    await togglePublish.mutateAsync(prop.id)
    success(prop.isPublished ? t('landlord.properties.unpublishSuccess') : t('landlord.properties.publishSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { busyId.value = null }
}

async function handleToggleAvailability(prop: LandlordProperty) {
  busyId.value = prop.id
  try {
    await toggleAvailability.mutateAsync(prop.id)
    success(prop.isAvailable ? t('landlord.properties.markedRented') : t('landlord.properties.markedAvailable'))
  } catch (err) { notifyError(extract(err)) }
  finally { busyId.value = null }
}

async function handleDuplicate(prop: LandlordProperty) {
  try {
    await ElMessageBox.confirm(
      t('landlord.properties.duplicateConfirm', { title: prop.title }),
      t('landlord.properties.duplicateTitle'),
      { type: 'info', confirmButtonText: t('landlord.properties.duplicateBtn'), cancelButtonText: t('landlord.properties.cancelBtn') },
    )
  } catch { return }

  busyId.value = prop.id
  try {
    const newProp = await duplicateProperty.mutateAsync(prop.id)
    success(t('landlord.properties.duplicateSuccess'))
    router.push(`/properties/details/${newProp.id}`)
  } catch (err) { notifyError(extract(err)) }
  finally { busyId.value = null }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <h2 class="text-2xl! md:text-[28px]! font-extrabold! leading-tight! tracking-tight text-gray-900">
          {{ t('landlord.properties.totalCount', { n: meta?.total ?? 0 }) }}
        </h2>
        <p class="text-sm text-gray-400 mt-1">{{ t('landlord.properties.subtitle') }}</p>
      </div>
      <BaseButton type="primary" size="large" round @click="router.push('/landlord/post-property')">
        <ClientOnly>
          <BaseIcon name="circle-plus" :size="14" class="mr-1.5" />
        </ClientOnly>
        {{ t('landlord.properties.addListing') }}
      </BaseButton>
    </div>

    <!-- Search -->
    <div class="search-bar mb-3.5">
      <BaseInput size="large" v-model="searchInput" :placeholder="t('landlord.properties.searchPlaceholder')" clearable icon="search" class="w-full" />
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 mb-3">
      <BaseSelect size="large" v-model="statusFilter" :options="statusOptions" class="rounded-filter w-full sm:flex-1 sm:min-w-40" />
      <BaseSelect size="large" v-model="availabilityFilter" :options="availabilityOptions" class="rounded-filter w-full sm:flex-1 sm:min-w-40" />
      <BaseSelect size="large" v-model="sortOption" :options="sortOptions" class="rounded-filter w-full sm:flex-1 sm:min-w-40" />

      <button
        type="button"
        class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        :class="showMoreFilters || advancedFilterCount > 0
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
        @click="showMoreFilters = !showMoreFilters"
      >
        <ClientOnly>
          <BaseIcon name="sliders-horizontal" :size="14" />
        </ClientOnly>
        {{ t('landlord.properties.moreFilters') }}
        <span v-if="advancedFilterCount > 0" class="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[10px] font-semibold">
          {{ advancedFilterCount }}
        </span>
      </button>

      <BaseButton v-if="hasAnyFilter" text size="default" class="text-gray-400! hover:text-gray-600!" @click="resetAllFilters">
        <ClientOnly>
          <BaseIcon name="x" :size="14" class="mr-1" />
        </ClientOnly>
        {{ t('landlord.properties.clearFilters') }}
      </BaseButton>
    </div>

    <!-- More filters -->
    <div v-if="showMoreFilters" class="flex flex-col gap-2.5 mb-3">
      <BaseSelect size="large" v-model="propertyTypeFilter" :options="propertyTypeOptions" :placeholder="t('landlord.properties.allPropertyTypes')" class="rounded-filter w-full" />
      <BaseSelect size="large" v-model="provinceFilter" :options="provinceOptions" :placeholder="t('landlord.properties.allProvinces')" class="rounded-filter w-full" />
      <BaseSelect
        size="large"
        v-model="districtFilter"
        :options="districtOptions"
        :disabled="provinceFilter === 'all' || districtsLoading"
        :placeholder="t('landlord.properties.allDistricts')"
        class="rounded-filter w-full"
      />
      <div class="flex items-center gap-2.5 w-full">
        <BaseInput size="large" v-model="priceMinInput" numeric decimal icon="dollar-sign" :placeholder="t('landlord.properties.priceMinPlaceholder')" class="rounded-filter flex-1" />
        <span class="text-gray-400 text-sm">–</span>
        <BaseInput size="large" v-model="priceMaxInput" numeric decimal icon="dollar-sign" :placeholder="t('landlord.properties.priceMaxPlaceholder')" class="rounded-filter flex-1" />
      </div>
      <BaseSelect size="large" v-model="featuredFilter" :options="featuredOptions" class="rounded-filter w-full" />
    </div>

    <!-- Active filter chips -->
    <div v-if="activeChips.length" class="flex flex-wrap items-center gap-2 mb-4">
      <BaseBadge v-for="chip in activeChips" :key="chip.key" type="primary" :content="chip.label" class="cursor-pointer" @click="clearChip(chip.key)">
        <ClientOnly>
          <BaseIcon name="x" :size="12" />
        </ClientOnly>
      </BaseBadge>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="8" leading="square" leading-size="56px" :lines="2" />
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
        <div>
          <!-- Column headers (desktop only) -->
          <div class="hidden md:grid md:grid-cols-[2.2fr_1fr_0.8fr_1fr_0.9fr_40px] md:gap-4 px-6 py-3.5 border-b border-gray-100">
            <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ t('landlord.properties.columns.property') }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ t('landlord.properties.columns.status') }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ t('landlord.properties.columns.price') }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ t('landlord.properties.columns.engagement') }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ t('landlord.properties.columns.created') }}</span>
            <span></span>
          </div>

          <!-- Rows -->
          <div
            v-for="row in items"
            :key="row.id"
            class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2.5 p-4 md:grid-cols-[2.2fr_1fr_0.8fr_1fr_0.9fr_40px] md:gap-4 md:items-center md:gap-y-0 md:px-6 md:py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <!-- Property -->
            <div class="col-start-1 row-start-1 md:col-start-auto md:row-start-auto flex items-center gap-3.5 min-w-0">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                <BaseImage v-if="row.images[0]" :src="row.images[0].imageKey" :alt="row.title" />
                <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
              </div>
              <div class="min-w-0">
                <NuxtLink :to="`/landlord/properties/${row.id}`" class="text-sm font-bold text-gray-900 truncate hover:text-emerald-600 block">
                  {{ row.title }}
                </NuxtLink>
                <p class="text-xs text-gray-400 truncate">{{ locationLabel(row) }}</p>
                <p class="text-xs font-semibold text-emerald-600 truncate">{{ row.propertyType[langKey] }}</p>
              </div>
            </div>

            <!-- Status -->
            <div class="col-span-2 md:col-span-1 flex flex-row flex-wrap md:flex-col gap-1 items-start">
              <span
                class="text-xs px-2.5 py-1 rounded-full font-bold w-fit"
                :class="row.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ row.isPublished ? t('landlord.properties.published') : t('landlord.properties.unpublished') }}
              </span>
              <span
                class="text-xs px-2.5 py-1 rounded-full font-bold w-fit"
                :class="row.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ row.isAvailable ? t('landlord.properties.available') : t('landlord.properties.unavailable') }}
              </span>
              <span v-if="row.isFeatured" class="text-xs px-2.5 py-1 rounded-full font-bold w-fit bg-amber-50 text-amber-600">
                {{ t('landlord.properties.featured') }}
              </span>
              <span v-if="row.isLocked" class="text-xs px-2.5 py-1 rounded-full font-bold w-fit bg-red-50 text-red-600">
                {{ t('landlord.properties.lockedByAdmin') }}
              </span>
            </div>

            <!-- Price -->
            <div class="col-span-2 md:col-span-1">
              <span class="text-sm font-extrabold text-gray-900">${{ row.monthly_price }}</span>
              <span class="text-xs text-gray-400 font-semibold">/mo</span>
            </div>

            <!-- Engagement -->
            <div class="col-span-2 md:col-span-1 flex flex-row flex-wrap md:flex-col gap-x-4 gap-y-1 text-xs text-gray-500 font-semibold">
              <span class="flex items-center gap-1"><BaseIcon name="eye" :size="12" /> {{ t('landlord.properties.viewsCount', { n: row.totalViews.toLocaleString() }) }}</span>
              <span class="flex items-center gap-1"><BaseIcon name="heart" :size="12" /> {{ t('landlord.properties.savedCount', { n: row.favouriteCount }) }}</span>
              <span v-if="row.reportCount > 0" class="flex items-center gap-1 text-red-500">
                <BaseIcon name="flag" :size="12" /> {{ row.reportCount }}
              </span>
            </div>

            <!-- Created -->
            <div class="col-span-2 md:col-span-1 text-xs text-gray-500 font-semibold">{{ dayjs(row.createdAt).format('MMM D, YYYY') }}</div>

            <!-- Actions -->
            <div class="col-start-2 row-start-1 justify-self-end md:col-start-auto md:row-start-auto md:justify-self-auto flex justify-end">
              <el-dropdown trigger="click" :disabled="busyId === row.id">
                <BaseButton text size="small" class="text-gray-400!" :loading="busyId === row.id">
                  <BaseIcon name="ellipsis-vertical" :size="16" />
                </BaseButton>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="router.push(`/landlord/properties/${row.id}`)">
                      <BaseIcon name="eye" :size="14" class="mr-2" />
                      {{ t('landlord.properties.viewDetails') }}
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="row.isLocked" @click="router.push(`/landlord/properties/${row.id}/edit`)">
                      <BaseIcon name="pencil" :size="14" class="mr-2" />
                      {{ t('landlord.editProperty.title') }}
                    </el-dropdown-item>
                    <el-dropdown-item divided :disabled="row.isLocked" @click="handleTogglePublish(row)">
                      <BaseIcon :name="row.isPublished ? 'eye-off' : 'eye'" :size="14" class="mr-2" />
                      {{ row.isPublished ? t('landlord.properties.unpublish') : t('landlord.properties.publish') }}
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="!row.isPublished" @click="handleToggleAvailability(row)">
                      <BaseIcon :name="row.isAvailable ? 'house-off' : 'house'" :size="14" class="mr-2" />
                      {{ row.isAvailable ? t('landlord.properties.markRented') : t('landlord.properties.markAvailable') }}
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="handleDuplicate(row)">
                      <BaseIcon name="copy" :size="14" class="mr-2" />
                      {{ t('landlord.properties.duplicate') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <div v-if="meta && meta.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-100">
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

<style scoped>
/* Scoped to this view only — mirrors the pill/rounded look from the design
   mockup without touching BaseInput/BaseSelect's shared global styling. */
.search-bar :deep(.el-input__wrapper) {
  border-radius: 9999px;
}
:deep(.rounded-filter .el-input__wrapper),
:deep(.rounded-filter .el-select__wrapper) {
  border-radius: 12px;
}
</style>
