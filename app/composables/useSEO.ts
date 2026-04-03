import { computed, ref } from 'vue'

export const useSEO = () => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const title = ref('')
  const description = ref('')
  const image = ref<string>()

  const fullUrl = computed(() => `${config.public.BASE_URL}${route.fullPath}`)

  useSeoMeta({
    // Google SEO
    title: () => title.value,
    description: () => description.value,

    // Open Graph
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    ogUrl: () => fullUrl.value,
    ogType: 'website',

    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
  })

  const setSEO = ({
    title: nextTitle,
    description: nextDescription,
    image: nextImage,
  }: {
    title: string
    description: string
    image?: string
  }) => {
    title.value = nextTitle
    description.value = nextDescription
    image.value = nextImage
  }

  return { setSEO }
}
