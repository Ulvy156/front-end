<script setup lang="ts">
import dayjs from 'dayjs'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useLandlordPropertyDetail } from '~/features/landlord/composables/useLandlordPropertyDetail'
import { PARKING_UI } from '~/config/parking.config'
import { initials } from '~/utils/initials'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const langKey = useLangKey()
const currentLang = useCurrentLang()

const propertyId = computed(() => route.params.id as string)
const { property, isPending, isError } = useLandlordPropertyDetail(propertyId)

const coverImage = computed(() => property.value?.images.find(i => i.isCover) ?? property.value?.images[0])
const otherImages = computed(() => property.value?.images.filter(i => i !== coverImage.value) ?? [])

const activeIndex = ref(0)
const carouselRef = ref()

function goToSlide(index: number) {
  activeIndex.value = index
  carouselRef.value?.setActiveItem(index)
}

const allowedRules = computed(() => property.value?.rules.filter(r => r.is_allow) ?? [])
const notAllowedRules = computed(() => property.value?.rules.filter(r => !r.is_allow) ?? [])
</script>

<template>
  <div>
    <!-- Back button -->
    <button
      class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer"
      @click="router.push('/landlord/properties')"
    >
      <BaseIcon name="arrow-left" :size="16" />
      {{ t('landlord.propertyDetail.backToProperties') }}
    </button>

    <!-- Skeleton -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton :rows="1" leading="square" leading-size="300px" :lines="3" />
      <BaseSkeleton :rows="4" :lines="2" />
    </div>

    <!-- Error -->
    <div v-else-if="isError || !property" class="flex flex-col items-center justify-center py-20 gap-3">
      <ClientOnly>
        <BaseIcon name="alert-circle" :size="40" class="text-gray-300" />
      </ClientOnly>
      <p class="text-sm text-gray-400">{{ t('landlord.propertyDetail.notFound') }}</p>
      <BaseButton @click="router.push('/landlord/properties')">
        {{ t('landlord.propertyDetail.backToProperties') }}
      </BaseButton>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">

      <!-- ── Status badges + title header ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-semibold text-gray-900">{{ property.title }}</h2>
              <BaseButton
                size="small"
                type="success"
                @click="router.push(`/landlord/properties/${property.id}/edit`)"
              >
                <BaseIcon name="pencil" :size="14" />
                {{ t('landlord.editProperty.title') }}
              </BaseButton>
            </div>
            <p class="text-sm text-gray-400 mt-1">
              <BaseIcon name="map-pin" :size="14" class="inline" />
              {{ property.district[langKey] }}, {{ property.district.province[langKey] }}
            </p>
          </div>
          <div class="flex gap-2">
            <span
              class="text-xs px-2.5 py-1 rounded-full font-medium"
              :class="property.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ property.isPublished ? t('landlord.properties.published') : t('landlord.properties.unpublished') }}
            </span>
            <span
              class="text-xs px-2.5 py-1 rounded-full font-medium"
              :class="property.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
            >
              {{ property.isAvailable ? t('landlord.properties.available') : t('landlord.properties.unavailable') }}
            </span>
            <span v-if="property.isFeatured" class="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-600">
              {{ t('landlord.properties.featured') }}
            </span>
          </div>
        </div>

        <!-- Stats row -->
        <div class="flex gap-6 mt-4 text-sm text-gray-500">
          <span class="flex items-center gap-1"><BaseIcon name="eye" :size="14" /> {{ property.totalViews.toLocaleString() }} {{ t('landlord.propertyDetail.views') }}</span>
          <span class="flex items-center gap-1"><BaseIcon name="heart" :size="14" /> {{ property.favouriteCount }} {{ t('landlord.propertyDetail.favourites') }}</span>
          <span v-if="property.reportCount > 0" class="flex items-center gap-1 text-red-500">
            <BaseIcon name="flag" :size="14" /> {{ property.reportCount }} {{ t('landlord.propertyDetail.reports') }}
          </span>
          <span class="flex items-center gap-1">
            <BaseIcon name="calendar" :size="14" /> {{ t('landlord.propertyDetail.posted') }} {{ dayjs(property.createdAt).format('MMM D, YYYY') }}
          </span>
        </div>
      </div>

      <!-- ── Images ── -->
      <div v-if="property.images.length" class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.images') }}</h3>
        <div class="flex gap-2 items-start">
          <el-carousel
            ref="carouselRef"
            height="400px"
            indicator-position="outside"
            arrow="always"
            :autoplay="false"
            class="flex-1 rounded-lg overflow-hidden"
            @change="(c: number) => activeIndex = c"
          >
            <el-carousel-item v-for="img in property.images" :key="img.imageKey">
              <BaseImage :src="img.imageKey" :alt="property.title" :rounded="true" fit="cover" class="w-full h-full" />
            </el-carousel-item>
          </el-carousel>
          <div v-if="property.images.length > 1" class="flex flex-col gap-2 w-20 max-h-100 overflow-y-auto">
            <BaseImage
              v-for="(img, i) in property.images"
              :key="img.imageKey"
              :src="img.imageKey"
              :rounded="true"
              fit="cover"
              class="w-20 h-16 cursor-pointer shrink-0"
              :class="{ 'border-2 border-emerald-500 rounded-lg': activeIndex === i }"
              @click="goToSlide(i)"
            />
          </div>
        </div>
      </div>

      <!-- ── Price & Lease ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.priceLease') }}</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.monthlyRent') }}</p>
            <p class="text-lg font-semibold text-gray-900">${{ property.monthly_price }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.deposit') }}</p>
            <p class="text-lg font-semibold text-gray-900">${{ property.deposit }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.minStay') }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatDuration(property.minimumStayLength) }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.availableFrom') }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatDateLong(property.availableFrom) }}</p>
          </div>
        </div>
      </div>

      <!-- ── Rooms & Size ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.roomsDetails') }}</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <BaseIcon name="bed" :size="20" class="text-emerald-600" />
            <div>
              <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.bedrooms') }}</p>
              <p class="font-semibold text-gray-900">{{ property.bedroom }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <BaseIcon name="bath" :size="20" class="text-emerald-600" />
            <div>
              <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.bathrooms') }}</p>
              <p class="font-semibold text-gray-900">{{ property.bathroom }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <BaseIcon name="expand" :size="20" class="text-emerald-600" />
            <div>
              <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.size') }}</p>
              <p class="font-semibold text-gray-900">{{ property.sizeSqm }} m²</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <BaseIcon name="building" :size="20" class="text-emerald-600" />
            <div>
              <p class="text-xs text-gray-400">{{ t('landlord.propertyDetail.floor') }}</p>
              <p class="font-semibold text-gray-900">{{ property.floor }} / {{ property.totalFloors }}</p>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="property.furnished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ property.furnished ? t('landlord.propertyDetail.furnished') : t('landlord.propertyDetail.unfurnished') }}
          </span>
        </div>
      </div>

      <!-- ── Description ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.description') }}</h3>
        <div class="prose prose-sm max-w-none text-gray-600" v-html="property.description" />
      </div>

      <!-- ── Location ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.location') }}</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p><span class="text-gray-400">{{ t('landlord.propertyDetail.address') }}:</span> {{ property.address }}</p>
          <p>
            <span class="text-gray-400">{{ t('landlord.propertyDetail.district') }}:</span>
            {{ property.district[langKey] }}, {{ property.district.province[langKey] }}
          </p>
          <p v-if="property.nearby_location">
            <span class="text-gray-400">{{ t('landlord.propertyDetail.nearby') }}:</span> {{ property.nearby_location }}
          </p>
        </div>
      </div>

      <!-- ── Amenities ── -->
      <div v-if="property.amenities.length" class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.amenities') }}</h3>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="amenity in property.amenities"
            :key="amenity.icon"
            class="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm"
          >
            <BaseIcon :name="amenity.icon" :size="16" />
            {{ amenity[langKey] }}
          </div>
        </div>
      </div>

      <!-- ── House Rules ── -->
      <div v-if="property.rules.length" class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.houseRules') }}</h3>
        <div class="flex gap-8">
          <div v-if="allowedRules.length" class="flex-1 space-y-2">
            <div
              v-for="rule in allowedRules"
              :key="rule.icon"
              class="flex items-center justify-between gap-3 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm"
            >
              <span class="flex items-center gap-2">
                <BaseIcon :name="rule.icon" :size="16" />
                {{ rule[langKey] }}
              </span>
              <BaseIcon name="check-check" :size="16" />
            </div>
          </div>
          <div v-if="notAllowedRules.length" class="flex-1 space-y-2">
            <div
              v-for="rule in notAllowedRules"
              :key="rule.icon"
              class="flex items-center justify-between gap-3 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm"
            >
              <span class="flex items-center gap-2">
                <BaseIcon :name="rule.icon" :size="16" />
                {{ rule[langKey] }}
              </span>
              <BaseIcon name="x" :size="16" />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Parking ── -->
      <div v-if="property.parkings.length" class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.parking') }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="p in property.parkings" :key="p.id" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <BaseIcon :name="PARKING_UI[p.type].icon" :size="16" />
              <span class="font-medium text-sm text-gray-900">{{ PARKING_UI[p.type].label[currentLang] }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span
                class="px-2 py-0.5 rounded-full font-medium"
                :class="p.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'"
              >
                {{ p.isFree ? t('landlord.propertyDetail.free') : t('landlord.propertyDetail.paid') }}
              </span>
              <span v-if="!p.isFree && p.price" class="text-gray-500">${{ p.price }}/mo</span>
              <span class="text-gray-400">{{ p.slots }} {{ t('landlord.propertyDetail.spaces') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Reports ── -->
      <div v-if="property.propertyReport.length" class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BaseIcon name="flag" :size="18" class="text-red-500" />
          {{ t('landlord.propertyDetail.reports') }} ({{ property.reportCount }})
        </h3>
        <div class="space-y-3">
          <div
            v-for="report in property.propertyReport"
            :key="report.id"
            class="flex items-start gap-3 bg-red-50 rounded-lg p-4"
          >
            <div v-if="report.user" class="shrink-0">
              <BaseImage v-if="report.user.imgUrl" :src="report.user.imgUrl" class="w-8 h-8 rounded-full" />
              <div v-else class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">
                {{ initials(report.user.name) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p v-if="report.user" class="text-sm font-medium text-gray-900">{{ report.user.name }}</p>
                <span class="text-xs text-gray-400">{{ dayjs(report.createdAt).format('MMM D, YYYY') }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ report.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Metadata ── -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">{{ t('landlord.propertyDetail.metadata') }}</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">{{ t('landlord.propertyDetail.propertyType') }}</span>
            <p class="text-gray-900">{{ property.propertyType[langKey] }}</p>
          </div>
          <div>
            <span class="text-gray-400">{{ t('landlord.propertyDetail.propertyId') }}</span>
            <p class="text-gray-900 font-mono text-xs">{{ property.id }}</p>
          </div>
          <div>
            <span class="text-gray-400">{{ t('landlord.propertyDetail.createdAt') }}</span>
            <p class="text-gray-900">{{ dayjs(property.createdAt).format('MMM D, YYYY [at] HH:mm') }}</p>
          </div>
          <div>
            <span class="text-gray-400">{{ t('landlord.propertyDetail.updatedAt') }}</span>
            <p class="text-gray-900">{{ dayjs(property.updatedAt).format('MMM D, YYYY [at] HH:mm') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
