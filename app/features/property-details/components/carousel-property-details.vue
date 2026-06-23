<template>
  <section class="border-b border-gray pb-6">
    <!-- Bento grid -->
    <div
      class="grid gap-2 rounded-xl overflow-hidden h-70 md:h-125"
      :class="gridClass"
    >
      <!-- Cover image -->
      <div
        class="relative cursor-pointer overflow-hidden"
        :class="coverClass"
        @click="openGallery(0)"
      >
        <BaseImage
          v-if="property?.images.length"
          :src="property.images[0].imageKey"
          :alt="property.title"
          fit="cover"
          class="hover:scale-105 transition-transform duration-300"
        />
      </div>

      <!-- Side images -->
      <template v-if="sideImages.length">
        <div
          v-for="(img, i) in sideImages"
          :key="img.imageKey"
          class="relative cursor-pointer overflow-hidden"
          @click="openGallery(i + 1)"
        >
          <BaseImage
            :src="img.imageKey"
            :alt="property.title"
            fit="cover"
            class="hover:scale-105 transition-transform duration-300"
          />
          <!-- "Show all photos" overlay on last visible image -->
          <div
            v-if="i === sideImages.length - 1 && remainingCount > 0"
            class="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            @click.stop="openGallery(i + 1)"
          >
            <span class="text-white text-sm font-medium flex items-center gap-2">
              <BaseIconClient name="images" :size="18" />
              +{{ remainingCount }} {{ $t('property.show_all_photos') }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Badges row -->
    <div class="flex items-center gap-x-4 mt-4">
      <span
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient :name="property?.propertyType.icon ?? ''" size="12" />
        {{ props.property.propertyType[langKey] }}
      </span>
      <span
        v-if="property?.isFeatured"
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient name="sparkles" size="12" />
        Featured
      </span>
      <span
        v-if="property?.isAvailable"
        class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
      >
        <BaseIconClient name="sparkles" size="12" />
        {{ $t("property.available") }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="my-4">{{ property?.title }}</h3>

    <!-- Meta info -->
    <div class="grid grid-cols-2 md:flex md:flex-wrap gap-x-5 gap-y-2 items-center text-(--gray)">
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="map-pin" />
        <p>
          {{ props.property.district.province[langKey] }} /
          {{ props.property.district[langKey] }}
        </p>
      </div>
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="expand" />
        <p>{{ property.sizeSqm }} m<sup>2</sup></p>
      </div>
      <div class="flex items-center gap-x-2 lowercase">
        <BaseIconClient name="eye" />
        <p>{{ formatView(property.totalViews) }} {{ $t("property.view") }}</p>
      </div>
      <div class="flex items-center gap-x-2">
        <BaseIconClient name="calendar-clock" />
        <p>
          {{ $t("property.posted_at") }}
          {{ formatDateLong(property.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Price -->
    <div class="flex gap-x-2 items-end my-6">
      <h2 class="text-(--nav-active-item)">${{ property.monthly_price }}</h2>
      <p style="font-size: 18px; color: var(--gray)">/{{ $t("month") }}</p>
    </div>

    <!-- Image preview modal -->
    <BaseImagePreviewModal
      v-model:visible="showGallery"
      :images="property.images"
      :start-index="activeIndex"
    />
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import BaseImage from "~/components/ui/BaseImage.vue"
import BaseImagePreviewModal from "~/components/ui/BaseImagePreviewModal.vue"
import { formatView } from "#imports"
import { useLangKey } from "#imports"
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()

const langKey = useLangKey()
const showGallery = ref(false)
const activeIndex = ref(0)

const MAX_SIDE = 3

const sideImages = computed(() =>
  props.property?.images.slice(1, 1 + MAX_SIDE) ?? []
)

const remainingCount = computed(() => {
  const total = props.property?.images.length ?? 0
  return Math.max(0, total - 1 - MAX_SIDE)
})

const gridClass = computed(() => {
  const count = props.property?.images.length ?? 0
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  return 'grid-cols-[3fr_2fr] grid-rows-2'
})

const coverClass = computed(() => {
  const count = props.property?.images.length ?? 0
  if (count <= 2) return ''
  return 'row-span-2'
})

function openGallery(index: number) {
  activeIndex.value = index
  showGallery.value = true
}
</script>
