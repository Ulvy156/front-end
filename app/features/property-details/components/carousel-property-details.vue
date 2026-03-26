<template>
  <section class="border-b border-gray">
    <div class="flex gap-x-2 items-start ">
      <el-carousel
        ref="carouselRef"
        height="60dvh"
        indicator-position="outside"
        arrow="always"
        :autoplay="false"
        class="w-[80%]"
        :activeIndex
        @change="onCarouselChange"
      >
        <el-carousel-item
          v-for="item in property?.images"
          :key="item?.imageKey"
          class="carousel-item"
        >
          <BaseImage :rounded="true" class="cursor-pointer" fit="cover" :src="item.imageKey" />
        </el-carousel-item>
      </el-carousel>
      <div class="flex flex-col gap-y-2 w-[20%] overflow-y-auto">
        <BaseImage
          @click="goToSlide(i)"
          v-for="(item, i) in property?.images"
          :rounded="true"
          width="10"
          :height="10"
          fit="contain"
          :src="item.imageKey"
          :class="{'border-2 border-(--nav-active-item)' : activeIndex === i}"
        />
      </div>
    </div>
    <div class="flex items-center gap-x-4">
      <!-- property type -->
      <span
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient :name="property?.propertyType.icon ?? ''" size="12" />
        {{ props.property.propertyType[langKey] }}
      </span>
      <!-- featured -->
      <span
        v-if="property?.isFeatured"
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient name="sparkles" size="12" />
        Featured
      </span>
      <!-- avaiable -->
      <span
        v-if="property?.isAvailable"
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient name="sparkles" size="12" />
        {{ $t("property.available") }}
      </span>
    </div>
    <h3 class="my-4">{{ property?.title }}</h3>
    <div class="flex gap-x-5 items-center text-(--gray)">
      <!-- location -->
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="map-pin" />
        <p>
          {{ props.property.district.province[langKey] }} /
          {{ props.property.district[langKey] }}
        </p>
      </div>
      <!-- size -->
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="expand" />
        <p>{{ property.sizeSqm }} m<sup>2</sup></p>
      </div>
      <!-- view -->
      <div class="flex items-center gap-x-2 lowercase">
        <BaseIconClient name="eye" />
        <p>{{ formatView(property.totalViews) }} {{ $t("property.view") }}</p>
      </div>
      <!-- posted at -->
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="calendar-clock" />
        <p>
          {{ $t("property.posted_at") }}
          {{ formatDateLong(property.createdAt) }}
        </p>
      </div>
    </div>
    <!-- price -->
    <div class="flex gap-x-2 items-end my-6">
      <h2 class="text-(--nav-active-item)">${{ property.monthly_price }}</h2>
      <p style="font-size: 18px; color: var(--gray)">/{{ $t("month") }}</p>
    </div>
  </section>

  <!-- <BaseImagePreviewModal v-model:visible="showPreview" :images="property?.images!" /> -->
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";
import BaseImage from "~/components/ui/BaseImage.vue";
import { formatView } from "#imports";
import { useLangKey } from "#imports";

const props = defineProps<{
  property: PropertyDetail;
}>();


const langKey = useLangKey();
const activeIndex = ref(0);
const carouselRef = ref()

function goToSlide(index: number) {
  activeIndex.value = index
  carouselRef.value?.setActiveItem(index)
}
function onCarouselChange(current: number, prev: number) {
  activeIndex.value = current;
}
</script>

<style scoped>
.carousel-item {
  width: 100%;
  height: 100%;
}
</style>
