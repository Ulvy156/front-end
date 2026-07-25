<template>
   <article
     v-motion
     :initial="{ opacity: 0, y: 20 }"
     :visible-once="{ opacity: 1, y: 0 }"
     :hovered="{ y: -5 }"
     class="card"
     @click="props.item.id && $router.push(`/properties/details/${props.item.id}`)"
   >
    <div class="relative overflow-hidden rounded-md">
      <div class="floating-actions-top">
        <BaseButton
          circle
          text
          class="fab transition-colors"
          :class="[
            props.isFavourited ? 'fab-favourited' : '',
            props.isFavouritePending ? 'animate-pulse cursor-wait' : '',
          ]"
          :disabled="props.isFavouritePending"
          :aria-label="$t('card.favourite')"
          @click.stop="$emit('favourite')"
        >
          <BaseHeartIcon :filled="props.isFavourited" :size="18" />
        </BaseButton>

        <BaseButton
          v-if="!props.hideCompareIcon"
          circle
          text
          class="fab"
          :aria-label="$t('card.compare')"
          @click.stop="$emit('compare')"
        >
          <BaseIcon name="git-compare-arrows" :size="18" />
        </BaseButton>
      </div>

      <div class="fab fab-wide floating-photos">
        <BaseIcon name="image" :size="16" />
        <span>{{ props.item.photoCount }} {{ $t('card.photos') }}</span>
      </div>

      <div class="fab fab-wide floating-views">
        <BaseIcon name="eye" :size="16" />
        <span>{{ formatView(props.item.totalViews) }}</span>
      </div>

      <BaseImage
        :src="props.item.imageSrc"
        :class="props.imageClass"
        :width="400"
        :height="props.imageHeight"
        :sizes="props.imageSizes"
        :loading="props.imageLoading"
      />
    </div>

    <div class="mt-3 flex flex-col gap-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h3 class="text-(--nav-active-item) text-[1.25rem] font-semibold">${{ props.item.monthlyPrice.toLocaleString() }}</h3>
          <p class="ml-1">/{{ $t('month') }}</p>
        </div>
        <span
          class="flex items-center gap-x-2 rounded-full p-1 px-2"
          :class="
            props.item.isAvailable
              ? 'bg-(--nav-active) text-(--nav-active-item)'
              : 'bg-(--destructive)/10 text-(--destructive)'
          "
        >
          <BaseIcon :name="props.item.isAvailable ? 'check' : 'x'" :size="16" />
          {{ isAvailable }}
        </span>
      </div>

      <div>
        <p class="line-clamp-1">{{ props.item.content || props.item.title }}</p>

        <div class="mt-2 flex items-center gap-x-2 text-gray-500">
          <BaseIcon name="map-pinned" :size="15" />
          <span>
            {{ props.item.location.province[langKey] }} /
            {{ props.item.location[langKey] }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-y-3">
        <div class="flex items-center gap-x-3">
          <div class="amenity-chip">
            <BaseTooltip :content="$t('card.bathroom')">
              <BaseIcon name="bath" :size="14" />
            </BaseTooltip>
            <span>{{ props.item.bathroom }}</span>
          </div>

          <div class="amenity-chip">
            <BaseTooltip :content="$t('card.bedroom')">
              <BaseIcon name="bed-double" :size="14" />
            </BaseTooltip>
            <span>{{ props.item.bedroom }}</span>
          </div>

          <div class="amenity-chip">
            <BaseTooltip :content="$t('card.size')">
              <BaseIcon name="expand" :size="13" />
            </BaseTooltip>
            <span>{{ props.item.sizeSqm }} m<sup>2</sup></span>
          </div>

          <div v-if="showDistance" class="amenity-chip">
            <BaseTooltip :content="$t('card.distance')">
              <BaseIcon name="land-plot" :size="14" />
            </BaseTooltip>
            <span>{{ props.item.distanceKm }} KM</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span
            class="flex items-center gap-x-2 rounded-full bg-(--nav-active) p-1 px-2 text-(--nav-active-item)"
          >
            <BaseIcon :name="props.item.propertyType.icon" size="12" />
            {{ props.item.propertyType[langKey] }}
          </span>

          <span class="flex items-center gap-x-1 text-gray-500 text-sm">
            <BaseIcon name="eye" :size="14" />
            {{ formatView(props.item.totalViews) }} {{ $t('card.views') }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatView } from '#imports'

import BaseButton from '~/components/ui/BaseButton.vue'
import BaseHeartIcon from '~/components/ui/BaseHeartIcon.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseTooltip from '~/components/ui/BaseTooltip.vue'
import { useLangKey } from '~/composables/useLangKey'
import type { PropertyCardViewModel } from '~/types/property-card'

const props = withDefaults(
  defineProps<{
    item: PropertyCardViewModel
    hideCompareIcon?: boolean
    imageClass?: string
    /** Intrinsic height hint for the thumbnail; keep in sync with imageClass's aspect ratio. */
    imageHeight?: number
    /** Forwarded to BaseImage/NuxtImg so the CDN serves a width matching the actual rendered card size. */
    imageSizes?: string
    /** Set to 'eager' for the first above-the-fold card so it's not deprioritized as the LCP element. */
    imageLoading?: 'lazy' | 'eager'
    isFavourited?: boolean
    isFavouritePending?: boolean
  }>(),
  {
    hideCompareIcon: false,
    imageClass: '',
    imageHeight: 225,
    imageLoading: 'lazy',
    isFavourited: false,
    isFavouritePending: false,
  },
)

defineEmits<{
  (e: 'compare'): void
  (e: 'favourite'): void
}>()

const { t } = useI18n()
const langKey = useLangKey()

const isAvailable = computed(() =>
  props.item.isAvailable ? t('card.available') : t('card.unavailable'),
)

const showDistance = computed(
  () => props.item.distanceKm !== null && props.item.distanceKm !== undefined,
)
</script>

<style scoped>
.card {
  border-radius: 8px;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background: var(--card);
  transition:
    transform 0.5s ease-out,
    box-shadow 0.5s ease-out,
    color 0.5s ease-out;
}

.card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  color: var(--nav-active-item) !important;
}

.floating-actions-top {
  color: var(--hover-text-color);
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 20;
}

.floating-photos {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 20;
}

.floating-views {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 20;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  border-radius: 34px;
  background: #f9fbfa;
  backdrop-filter: blur(2px);
  color: #628478;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.25s ease;
}

.fab:hover {
  color: var(--hover-text-color);
  background: var(--active-bg);
  transform: translateY(-2px);
}

.fab.fab-favourited {
  background: var(--destructive);
  color: white;
}

.fab.fab-favourited:hover {
  background: var(--destructive);
  opacity: 0.9;
}

.fab-wide {
  width: auto;
  padding: 0 14px;
  gap: 8px;
  border-radius: 999px;
  font-size: 14px;
}

.amenity-chip {
  display: flex;
  align-items: center;
  column-gap: 5px;
  padding: 4px 8px;
  border-radius: 8px;
  background: #f3f4f6;
  font-size: 13px;
  color: #4b5563;
}
</style>
