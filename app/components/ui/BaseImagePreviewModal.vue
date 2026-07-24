<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="props.visible"
        class="lightbox"
        @click.self="close"
        @keydown.left="prev"
        @keydown.right="next"
        @keydown.escape="close"
        tabindex="0"
        ref="lightboxRef"
      >
        <!-- Top bar -->
        <div class="lightbox-topbar">
          <span class="lightbox-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
          <button class="lightbox-close" @click="close" :aria-label="$t('common.close') || 'Close'">
            <BaseIconClient name="x" :size="24" />
          </button>
        </div>

        <!-- Main image area -->
        <div class="lightbox-stage">
          <button
            class="lightbox-nav lightbox-nav--prev"
            :class="{ 'opacity-0 pointer-events-none': images.length <= 1 }"
            @click="prev"
            aria-label="Previous"
          >
            <BaseIconClient name="chevron-left" :size="28" />
          </button>

          <div class="lightbox-image-wrapper">
            <Transition :name="slideDirection" mode="out-in">
              <BaseImage
                :key="previewList[currentIndex]"
                :src="previewList[currentIndex]!"
                fit="contain"
                loading="eager"
                :width="1600"
                :height="1200"
                sizes="100vw"
                class="lightbox-image"
              />
            </Transition>
          </div>

          <button
            class="lightbox-nav lightbox-nav--next"
            :class="{ 'opacity-0 pointer-events-none': images.length <= 1 }"
            @click="next"
            aria-label="Next"
          >
            <BaseIconClient name="chevron-right" :size="28" />
          </button>
        </div>

        <!-- Thumbnail strip -->
        <div v-if="images.length > 1" class="lightbox-thumbs">
          <div class="lightbox-thumbs-track" ref="thumbTrackRef">
            <button
              v-for="(img, i) in previewList"
              :key="img"
              class="lightbox-thumb"
              :class="{ 'lightbox-thumb--active': i === currentIndex }"
              @click="goTo(i)"
            >
              <BaseImage :src="img" fit="cover" loading="lazy" :width="64" :height="48" class="lightbox-thumb-img" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Image } from '~/features/property-details/interface/properties-details'
import BaseIconClient from './BaseIcon.client.vue'
import BaseImage from './BaseImage.vue'

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    images: Image[]
    startIndex?: number
    visible: boolean
  }>(),
  { startIndex: 0 },
)

const currentIndex = ref(props.startIndex)
const slideDirection = ref<'slide-left' | 'slide-right'>('slide-left')
const lightboxRef = ref<HTMLElement | null>(null)
const thumbTrackRef = ref<HTMLElement | null>(null)

const previewList = computed(() => props.images.map((img) => img.imageKey))

watch(
  () => props.visible,
  (open) => {
    if (open) {
      currentIndex.value = props.startIndex
      document.body.style.overflow = 'hidden'
      nextTick(() => lightboxRef.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
)

watch(currentIndex, () => {
  nextTick(() => scrollThumbIntoView())
})

function scrollThumbIntoView() {
  if (!thumbTrackRef.value) return
  const active = thumbTrackRef.value.querySelector('.lightbox-thumb--active') as HTMLElement | null
  active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

function next() {
  slideDirection.value = 'slide-left'
  currentIndex.value = (currentIndex.value + 1) % previewList.value.length
}

function prev() {
  slideDirection.value = 'slide-right'
  currentIndex.value = (currentIndex.value - 1 + previewList.value.length) % previewList.value.length
}

function goTo(index: number) {
  slideDirection.value = index > currentIndex.value ? 'slide-left' : 'slide-right'
  currentIndex.value = index
}

function close() {
  emit('update:visible', false)
}
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: black;
  outline: none;
  user-select: none;
}

/* ── Top bar ── */
.lightbox-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  flex-shrink: 0;
}

.lightbox-counter {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.lightbox-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Main stage ── */
.lightbox-stage {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  min-height: 0;
}

.lightbox-image-wrapper {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lightbox-image-wrapper :deep(.image) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* ── Nav buttons ── */
.lightbox-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ── Thumbnails ── */
.lightbox-thumbs {
  flex-shrink: 0;
  padding: 12px 20px 20px;
  display: flex;
  justify-content: center;
}

.lightbox-thumbs-track {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  max-width: 100%;
  padding: 4px;
  scrollbar-width: none;
}

.lightbox-thumbs-track::-webkit-scrollbar {
  display: none;
}

.lightbox-thumb {
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
  background: none;
}

.lightbox-thumb:hover {
  opacity: 0.8;
}

.lightbox-thumb--active {
  opacity: 1;
  border-color: white;
}

.lightbox-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Transitions ── */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .lightbox-nav {
    width: 36px;
    height: 36px;
  }

  .lightbox-thumb {
    width: 48px;
    height: 36px;
  }

  .lightbox-topbar {
    padding: 12px 16px;
  }

  .lightbox-thumbs {
    padding: 8px 12px 16px;
  }
}
</style>
