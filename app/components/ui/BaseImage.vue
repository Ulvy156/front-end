<script setup lang="ts">
import { useAppEnv } from '~/composables/useAppEnv';

const props = defineProps<{
  src?: string
  alt?: string
  width?: number
  height?: number
  rounded?: boolean
}>()
const { API_URL } = useAppEnv();

const hasError = ref(false)
const imgSrc = computed(() => `${API_URL}/${props.src}`)
</script>

<template>
  <NuxtImg
    v-if="src && !hasError"
    :src="imgSrc"
    :alt="alt || 'image'"
    :width="width"
    :height="height"
    format="webp"
    loading="lazy"
    @error="hasError = true"
    class="object-cover"
    :class="{ 'rounded-lg': rounded }"
  />

  <!-- fallback -->
  <div
    v-else
    class="flex items-center justify-center bg-gray-200 dark:bg-zinc-700 text-sm text-gray-500"
    :style="{
      width: width ? width + 'px' : '100%',
      height: height ? height + 'px' : '200px'
    }"
  >
    No Image
  </div>
</template>
