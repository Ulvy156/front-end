export const useSEO = () => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const setSEO = ({
    title,
    description,
    image,
  }: {
    title: string
    description: string
    image?: string
  }) => {
    const fullUrl = `${config.public.BASE_URL}${route.fullPath}`

    useSeoMeta({
      // Google SEO
      title,
      description,

      // Open Graph
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
      ogUrl: fullUrl,
      ogType: 'website',

      // Twitter
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image,
    })
  }

  return { setSEO }
}
