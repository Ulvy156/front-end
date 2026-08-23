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
    class="image flex items-center justify-center bg-gray-200 text-sm text-gray-500"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined
    }"
  >
    No Image
  </div>
</template>

<style scoped>
/* This scoped block is its own unlayered stylesheet, and unlayered CSS beats
   every Tailwind utility (all in @layer utilities) regardless of specificity
   — :where() alone can't fix that. Putting the default in @layer base (the
   same layer main.css uses for its element resets) lets Tailwind's utilities
   layer, which comes later in the app-wide layer order, win instead. Applies
   to both the NuxtImg and the "No Image" fallback, so a caller that doesn't
   pass width/height props still gets sized by its own classes instead of the
   fallback's old hardcoded 100%/200px inline style. */
@layer base {
  :where(.image) {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
