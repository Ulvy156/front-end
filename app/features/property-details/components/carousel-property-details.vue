<template>
  <section class="mb-8">
    <!-- Gallery grid -->
    <div class="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-2.5 h-[250px] sm:h-[420px] overflow-hidden">
      <!-- Cover image -->
      <div class="relative cursor-pointer overflow-hidden rounded-[14px] h-full min-h-0" @click="openGallery(0)">
        <BaseImage
          v-if="property?.images.length"
          :src="property.images[0].imageKey"
          :alt="property.title"
          fit="cover"
          loading="eager"
          :width="640"
          :height="420"
          sizes="480:92vw sm:38vw"
          densities="1"
          class="hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      <!-- Side images 2x2 grid -->
      <div v-if="sideImages.length" class="hidden sm:grid grid-cols-2 grid-rows-2 gap-2.5 h-full min-h-0">
        <div
          v-for="(img, i) in sideImages"
          :key="img.imageKey"
          class="relative cursor-pointer overflow-hidden rounded-[14px] h-full min-h-0"
          @click="openGallery(i + 1)"
        >
          <BaseImage
            :src="img.imageKey"
            :alt="property.title"
            fit="cover"
            :width="200"
            :height="205"
            sizes="sm:12vw"
            densities="1"
            class="hover:scale-[1.03] transition-transform duration-300"
          />
          <!-- "Show all photos" overlay on last visible image -->
          <div
            v-if="i === sideImages.length - 1 && property.images.length > 1"
            class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-end justify-end p-2.5"
            @click.stop="openGallery(i + 1)"
          >
            <span class="bg-black/75 backdrop-blur-sm text-white text-[13px] font-semibold px-4 py-2.5 rounded-[10px] flex items-center gap-2">
              <BaseIconClient name="images" :size="15" />
              {{ $t('property.show_all_photos') }} ({{ property.images.length }})
            </span>
          </div>
        </div>
      </div>
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
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()

const showGallery = ref(false)
const activeIndex = ref(0)

const MAX_SIDE = 4

const sideImages = computed(() =>
  props.property?.images.slice(1, 1 + MAX_SIDE) ?? []
)

function openGallery(index: number) {
  activeIndex.value = index
  showGallery.value = true
}
</script>
