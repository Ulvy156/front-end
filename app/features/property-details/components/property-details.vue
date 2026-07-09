<template>
  <section>
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-[13px] text-gray-400 mb-5">
      <NuxtLink to="/properties" class="text-(--nav-active-item) hover:underline">
        {{ property!.district.province[langKey] }}
      </NuxtLink>
      <span class="opacity-60">›</span>
      <NuxtLink to="/properties" class="text-(--nav-active-item) hover:underline">
        {{ property!.district[langKey] }}
      </NuxtLink>
      <span class="opacity-60">›</span>
      <span class="text-gray-800">{{ property!.title }}</span>
    </div>

    <!-- Title + Badges + Price row -->
    <div class="flex justify-between items-start gap-6 flex-wrap mb-6">
      <div class="flex-1 min-w-[260px]">
        <!-- Badges -->
        <div class="flex items-center gap-2 mb-3">
          <span v-if="property!.isFeatured"
            class="inline-flex items-center gap-1.5 bg-(--nav-active) text-(--nav-active-item) text-xs font-semibold px-2.5 py-1 rounded-lg">
            <BaseIconClient name="sparkles" :size="12" />
            {{ $t('property.featured') }}
          </span>
          <span v-if="property!.isAvailable"
            class="inline-flex items-center gap-1.5 bg-(--nav-active) text-(--nav-active-item) text-xs font-semibold px-2.5 py-1 rounded-lg">
            {{ $t('property.available') }}
          </span>
          <span class="bg-(--nav-active) text-(--nav-active-item) text-xs font-semibold px-2.5 py-1 rounded-lg">
            <BaseIconClient :name="property!.propertyType.icon" :size="12" class="inline" />
            {{ property!.propertyType[langKey] }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-[32px] font-bold leading-tight tracking-tight text-gray-800 mb-2">
          {{ property!.title }}
        </h1>

        <!-- Location -->
        <div class="flex items-center gap-1.5 text-sm text-gray-500">
          <BaseIconClient name="map-pin" :size="15" />
          <span>
            {{ property!.district.province[langKey] }} /
            {{ property!.district[langKey] }}
          </span>
        </div>

        <!-- Views + Posted date -->
        <div class="flex items-center gap-2 text-[13px] text-gray-400 mt-1.5">
          <BaseIconClient name="eye" :size="14" />
          <span>{{ formatView(property!.totalViews) }} {{ $t('property.view') }}</span>
          <span class="opacity-60">·</span>
          <BaseIconClient name="calendar" :size="14" />
          <span>{{ $t('property.posted_at') }} {{ formatDateLong(property!.createdAt) }}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-start gap-3">
        <div class="text-right">
          <div class="text-[30px] font-bold text-gray-800 leading-none">
            ${{ property!.monthly_price }}<span class="text-[15px] font-medium text-gray-400">/{{ $t('month') }}</span>
          </div>
          <div class="text-[13px] text-gray-400 mt-1.5">${{ property!.deposit }} {{ $t('property.price.deposit') }}</div>
        </div>
      </div>
    </div>

    <!-- Two-column layout: gallery + content | sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_30%] gap-x-10 items-start">
      <!-- Left column -->
      <div class="flex flex-col gap-y-9">
        <carouselPropertyDetails :property="property!" />
        <propertyRooms :property="property!" />
        <propertyDescription :property="property!" />
        <propertyParking :property="property!" />
        <propertyHouseRule :property="property!" />
        <propertyAmenities :property="property!" />
        <propertyLocation :property="property!" />
        <relatedProperties />
      </div>

      <!-- Right sidebar -->
      <div class="lg:sticky lg:top-6 h-fit self-start flex flex-col gap-y-3.5">
        <contactLandlord :property="property!" />
        <safetyNotice />
      </div>
    </div>

    <!-- Mobile fixed bottom bar -->
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between lg:hidden">
      <div class="leading-tight">
        <span class="text-[22px] font-bold text-gray-800">${{ property!.monthly_price }}</span>
        <span class="text-[13px] text-gray-400">/{{ $t('month') }}</span>
      </div>
      <div class="flex items-center gap-2.5">
        <a
          v-if="phoneNumber.length"
          :href="`tel:${phoneNumber[0].phoneNumber}`"
          class="bg-(--nav-active-item) text-white border-none rounded-lg px-6 py-3 text-sm font-semibold"
        >
          {{ $t('property.call') }}
        </a>
        <button
          v-else
          class="bg-(--nav-active-item) text-white border-none rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer"
        >
          {{ $t('property.contact') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import contactLandlord from "./contact-landlord.vue";
import safetyNotice from "./safety-notice.vue";
import carouselPropertyDetails from "./carousel-property-details.vue";
import propertyDescription from "./property-description.vue";
import propertyRooms from "./property-rooms.vue";
import propertyLocation from "./property-location.vue";
import propertyAmenities from "./property-amenities.vue";
import propertyHouseRule from "./property-house-rule.vue";
import propertyParking from "./property-parking.vue";
import relatedProperties from './related-properties.vue';
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyDetails } from "../composable/usePropertyDetails";

const { property } = await usePropertyDetails()
const langKey = useLangKey()

const phoneNumber = computed(
  () => property.value?.user?.phones?.filter((item) => item.type === "PHONE") ?? [],
)
</script>

<style scoped>
section {
  padding-bottom: 80px;
}

@media (min-width: 1024px) {
  section {
    padding-bottom: 0;
  }
}
</style>
