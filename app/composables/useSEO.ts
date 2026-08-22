import { computed, ref } from 'vue'

const SITE_NAME = 'RokPteah'

interface SEOData {
  title: string
  description: string
  image?: string
}

type SEOInput = SEOData | (() => SEOData)

export const useSEO = () => {
  const route = useRoute()
  const config = useRuntimeConfig()

  // Stores a getter rather than the resolved value. `resolved` (a computed)
  // re-invokes it lazily whenever something reads it — including when
  // unhead serializes the SSR <head>, at which point any async data the
  // getter closes over is already settled. Assigning plain values via a
  // `watch()`/`watchEffect()` on that async data doesn't give the same
  // guarantee: nothing forces that watcher to flush before the SSR head is
  // serialized, so callers doing that can end up shipping empty meta tags
  // in the initial HTML.
  const source = ref<() => SEOData>(() => ({ title: '', description: '', image: undefined }))
  const resolved = computed(() => source.value())

  const fullUrl = computed(() => `${config.public.BASE_URL}${route.fullPath}`)

  useSeoMeta({
    // Google SEO
    title: () => resolved.value.title,
    description: () => resolved.value.description,

    // Open Graph
    ogTitle: () => resolved.value.title,
    ogDescription: () => resolved.value.description,
    ogImage: () => resolved.value.image,
    ogUrl: () => fullUrl.value,
    ogType: 'website',
    ogSiteName: SITE_NAME,

    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolved.value.title,
    twitterDescription: () => resolved.value.description,
    twitterImage: () => resolved.value.image,
  })

  // Single canonical-link source for every page using this composable —
  // keeps it in lockstep with og:url instead of pages defining their own.
  useHead({
    link: [
      { rel: 'canonical', href: () => fullUrl.value },
    ],
  })

  // Accepts either a plain object (simple, static pages) or a getter
  // function (pages whose title/description/image depend on data that
  // loads asynchronously, e.g. property details) — see the `source` comment
  // above for why the getter form is the one that's SSR-safe.
  const setSEO = (input: SEOInput) => {
    source.value = typeof input === 'function' ? input : () => input
  }

  return { setSEO }
}
