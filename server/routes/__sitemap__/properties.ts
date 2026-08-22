import type { SitemapUrlInput } from '#sitemap/types'

interface SitemapPropertyItem {
  id: string
}

interface BrowsePropertiesResponse {
  items: SitemapPropertyItem[]
}

// browse-properties defaults to isPublished:true + isAvailable:true, so this
// only ever lists properties that are actually live for search engines.
export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()

  const { items } = await $fetch<BrowsePropertiesResponse>(
    '/property/browse-properties',
    {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { limit: 5000 },
    },
  )

  return items.map((property): SitemapUrlInput => ({
    loc: `/properties/details/${property.id}`,
    changefreq: 'daily',
    priority: 0.8,
  }))
})
