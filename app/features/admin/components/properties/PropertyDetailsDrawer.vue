<script setup lang="ts">
import dayjs from 'dayjs'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { initials } from '~/utils/initials'
import { useAdminPropertyDetail } from '../../composables/useAdminPropertyDetail'

const props = defineProps<{
  modelValue: boolean
  propertyId: string | null
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const propertyIdRef = computed(() => props.propertyId)
const { data, isPending } = useAdminPropertyDetail(propertyIdRef)

const { t } = useI18n()
const langKey = useLangKey()
const { copy } = useCopy()

function locationLabel(district: NonNullable<typeof data.value>['district']) {
  return `${district[langKey.value]}, ${district.province[langKey.value]}`
}
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="t('admin.properties.detailsDrawer.title')"
    size="560px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <!-- Loading -->
    <template v-if="isPending">
      <BaseSkeleton :rows="1" leading="square" leading-size="120px" :lines="1" />
      <div class="mt-6">
        <BaseSkeleton :rows="4" />
      </div>
    </template>

    <template v-else-if="data">
      <!-- Images -->
      <div class="flex gap-2 mb-5 overflow-x-auto pb-1">
        <div v-if="!data.images.length" class="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <BaseIcon name="building" :size="28" class="text-gray-300" />
        </div>
        <div
          v-for="img in data.images"
          :key="img.id"
          class="rounded-lg overflow-hidden bg-gray-100 shrink-0"
          :class="img.isCover ? 'w-full h-40' : 'w-20 h-20'"
        >
          <BaseImage :src="img.imageKey" :alt="data.title" />
        </div>
      </div>

      <!-- Title + badges -->
      <div class="mb-5 pb-5 border-b border-gray-100">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-base font-semibold text-gray-900">{{ data.title }}</h3>
          <p class="text-sm font-semibold text-gray-900 shrink-0">
            ${{ data.monthly_price }}<span class="text-xs font-normal text-gray-400">/mo</span>
          </p>
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ data.propertyType[langKey] }} · {{ locationLabel(data.district) }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ data.address }}</p>

        <div class="flex flex-wrap gap-1 mt-3">
          <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="data.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ data.isPublished ? t('admin.properties.published') : t('admin.properties.unpublished') }}
          </span>
          <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="data.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'">
            {{ data.isAvailable ? t('admin.properties.available') : t('admin.properties.unavailable') }}
          </span>
          <span v-if="data.isFeatured" class="text-xs px-1.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600">
            {{ t('admin.properties.featured') }}
          </span>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-gray-100 text-center">
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.bedroom }}</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.bedroom') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.bathroom }}</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.bathroom') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.sizeSqm }} m²</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.size') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.floor }}/{{ data.totalFloors }}</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.floor') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.totalViews.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.views') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ data.favouriteCount }}</p>
          <p class="text-xs text-gray-400">{{ t('admin.properties.detailsDrawer.favourites') }}</p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="data.description" class="mb-5 pb-5 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-2">{{ t('admin.properties.detailsDrawer.description') }}</p>
        <p class="text-sm text-gray-700">{{ data.description }}</p>
      </div>

      <!-- Amenities -->
      <div v-if="data.amenities.length" class="mb-5 pb-5 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-2">{{ t('admin.properties.detailsDrawer.amenities') }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="a in data.amenities" :key="a.nameEn" class="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600">
            <BaseIcon :name="a.icon" :size="12" /> {{ a[langKey] }}
          </span>
        </div>
      </div>

      <!-- House rules -->
      <div v-if="data.rules.length" class="mb-5 pb-5 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-2">{{ t('admin.properties.detailsDrawer.houseRules') }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="r in data.rules"
            :key="r.nameEn"
            class="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            :class="r.is_allow ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'"
          >
            <BaseIcon :name="r.icon" :size="12" /> {{ r[langKey] }}
          </span>
        </div>
      </div>

      <!-- Property ID -->
      <div class="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-gray-50">
        <span class="text-xs text-gray-400 shrink-0">{{ t('admin.properties.detailsDrawer.propertyId') }}</span>
        <span class="text-xs font-mono text-gray-600 truncate flex-1">{{ data.id }}</span>
        <BaseIcon name="copy" :size="14" class="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0" @click="copy(data.id)" />
      </div>

      <!-- Owner -->
      <div class="mb-5 pb-5 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-3">{{ t('admin.properties.detailsDrawer.owner') }}</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0 overflow-hidden">
            <BaseImage v-if="data.user.imgUrl" :src="data.user.imgUrl" :alt="data.user.name" />
            <span v-else>{{ initials(data.user.name) }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 truncate">{{ data.user.name }}</p>
            <p class="text-sm text-gray-400 truncate">{{ data.user.email }}</p>
            <p v-if="data.user.phones[0]" class="text-xs text-gray-400 truncate">{{ data.user.phones[0].phoneNumber }}</p>
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <span v-if="data.user.isVerified" class="text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
              {{ t('admin.properties.detailsDrawer.verified') }}
            </span>
            <span v-if="data.user.isLocked" class="text-xs px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-600">
              {{ t('admin.properties.detailsDrawer.locked') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Reports -->
      <div v-if="data.propertyReport.length" class="mb-5 pb-5 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-3">
          {{ t('admin.properties.detailsDrawer.reports', { n: data.propertyReport.length }) }}
        </p>
        <ul class="space-y-2">
          <li v-for="r in data.propertyReport" :key="r.id" class="p-2.5 rounded-lg bg-red-50/60 text-xs">
            <p class="text-gray-700">{{ r.description }}</p>
            <p class="text-gray-400 mt-1">{{ r.user.name }} · {{ dayjs(r.createdAt).format('MMM D, YYYY') }}</p>
          </li>
        </ul>
      </div>

      <!-- View history -->
      <div v-if="data.propertyViews.length">
        <p class="text-xs font-medium text-gray-400 uppercase mb-3">{{ t('admin.properties.detailsDrawer.viewHistory') }}</p>
        <ul class="space-y-1.5">
          <li v-for="v in data.propertyViews" :key="v.date" class="flex items-center justify-between text-xs">
            <span class="text-gray-400">{{ dayjs(v.date).format('MMM D, YYYY') }}</span>
            <span class="text-gray-700 font-medium">{{ v.views.toLocaleString() }}</span>
          </li>
        </ul>
      </div>
    </template>
  </BaseDrawer>
</template>
