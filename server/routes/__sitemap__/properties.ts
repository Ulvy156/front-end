import type { SitemapUrlInput } from '#sitemap/types'

interface SitemapPropertyItem {
  id: string
}

interface BrowsePropertiesResponse {
  items: SitemapPropertyItem[]
  meta: { totalPages: number }
}

const PAGE_SIZE = 1000
// Safety cap so a backend bug (e.g. totalPages never converging) can't loop
// forever — 200 pages at PAGE_SIZE is 200k properties, far beyond any
// realistic catalog size.
const MAX_PAGES = 200

// browse-properties defaults to isPublished:true + isAvailable:true, so this
// only ever lists properties that are actually live for search engines.
// Paginates through every page instead of a single fixed-size request so the
// sitemap stays complete as the catalog grows past one page's worth of results.
export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()

  const ids: string[] = []
  let page = 1
  let totalPages = 1

  do {
    const { items, meta } = await $fetch<BrowsePropertiesResponse>(
      '/property/browse-properties',
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { page, limit: PAGE_SIZE },
      },
    )

    ids.push(...items.map(property => property.id))
    totalPages = meta.totalPages
    page += 1
  } while (page <= totalPages && page <= MAX_PAGES)

  return ids.map((id): SitemapUrlInput => ({
    loc: `/properties/details/${id}`,
    changefreq: 'daily',
    priority: 0.8,
  }))
})
