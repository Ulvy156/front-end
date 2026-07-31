<script setup lang="ts">
// NuxtImg (component) and the fallback <div> (plain element) as v-if/v-else
// root siblings make Vue's automatic $attrs fallthrough ambiguous, so the
// SSR and client renderers resolved it differently — the fallback div's
// class attr (e.g. layout classes passed by parent cards) matched on the
// server but not on client hydration. Bind $attrs explicitly on both roots
// instead of relying on implicit fallthrough.
defineOptions({ inheritAttrs: false })

const config = useRuntimeConfig();
const attrs = useAttrs()

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: number | string
    height?: number
    rounded?: boolean
    fit?: 'cover' | 'contain'
    /** Set to 'eager' for above-the-fold / LCP images so they aren't deprioritized. */
    loading?: 'lazy' | 'eager'
    sizes?: string
  }>(),
  {
    fit: 'cover',
    loading: 'lazy',
  }
)


const hasError = ref(false)
const imgSrc = computed(() => `${config.public.R2_PUB_URL}/${props.src}`)
</script>

<template>
  <NuxtImg
    v-if="src && !hasError"
    v-bind="attrs"
    :style="{ objectFit: props.fit }"
    :src="imgSrc"
    :alt="alt || 'image'"
    :width="width"
    :height="height"
    :sizes="sizes"
    format="webp"
    :loading="loading"
    :fetchpriority="loading === 'eager' ? 'high' : undefined"
    :preload="loading === 'eager' ? true : undefined"
    @error="hasError = true"
    class="image"
    :class="{ 'rounded-lg': rounded }"
  />

  <!-- fallback -->
  <div
    v-else
    v-bind="attrs"
    class="flex items-center justify-center bg-gray-200 text-sm text-gray-500"
    :style="{
      width: width ? width + 'px' : '100%',
      height: height ? height + 'px' : '200px'
    }"
  >
    No Image
  </div>
</template>

<style scoped>
/* :where() keeps this at zero specificity so sizing classes passed via the
   `class` prop (e.g. h-14 w-14) always win instead of losing to this default
   because of the scoped-style attribute selector bump. */
:where(.image) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
