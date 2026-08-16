import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, showError, useAsyncData, useCookie, useNuxtApp, useRoute, useRuntimeConfig } from '#imports'

import { useApi } from '~/composables/useApi'
import { useSEO } from '~/composables/useSEO'
import { useLangKey } from '~/composables/useLangKey'
import { useCurrentLang } from '~/composables/getCurrentLang'
import { PARKING_UI } from '~/config/parking.config'
import { incrementView } from '~/services/increment-view'
import { usePropertyFilterStore } from '~/stores/propertyFilter'
import { fetchPropertyDetails } from '../services/property-details'
import type { Image, PropertyDetail } from '../interface/properties-details'

// Social previews (Telegram, Facebook, ...) truncate long descriptions
// poorly, so cut the assembled SEO description to a clean summary length.
const SEO_DESCRIPTION_MAX_LENGTH = 160

// Landlord-written descriptions are often filler ("oh", "n/a", "-") that adds
// nothing over the structured facts — only append them past this length.
const MIN_MEANINGFUL_DESCRIPTION_LENGTH = 20

// No importance ranking exists on amenities (just a flat, backend-ordered
// list), so parking (a dedicated, structured field — see property-parking.vue)
// takes priority, and only the leftover slots go to generic amenities.
const MAX_SEO_FEATURES = 2

// The cover image isn't necessarily images[0] — mirrors the ordering in
// carousel-property-details.vue so the SEO/og:image matches the one shown
// in the gallery.
function pickCoverImage(images: Image[]): Image | undefined {
  return images.find((img) => img.isCover) ?? images[0]
}

/**
 * Get property details by id and filter by location.
 *
 * Deliberately not awaited: a top-level await here would make the page's
 * async setup block Suspense, leaving the previous route's page on screen
 * (URL already changed) until the fetch resolves. Callers must guard on
 * `pending`/`property` instead.
 *
 * @returns {object} property details
 *
 * @example
 * const { property, pending } = usePropertyDetails()
 */
export function usePropertyDetails() {
  const api = useApi()
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const config = useRuntimeConfig()
  const { t } = useI18n()
  const langKey = useLangKey()
  const currentLang = useCurrentLang()
  const seo = useSEO()
  const propertyFilter = usePropertyFilterStore()
  const viewedProperties = useCookie<string[]>('viewed_properties', {
    maxAge: 60 * 60 * 6,
    default: () => [],
  })

  const id = computed(() => route.params.id as string)

  // Key must be reactive to `id` (not a static string) — otherwise every
  // property id shares one cache slot, and Nuxt's payload cache can hand
  // back a previous property's frozen data instead of refetching.
  const { data: property, pending } = useAsyncData<PropertyDetail | null>(
    () => `property-details-${id.value}`,
    async () => {
      try {
        return await fetchPropertyDetails({
          api,
          id: id.value,
          lat: propertyFilter.lat,
          lng: propertyFilter.lng,
        })
      } catch (err) {
        // Listings that don't exist (or aren't published) 404 at the API.
        // Route to the app's existing not-found page (already noindex'd)
        // instead of leaving the skeleton spinning forever. Called here,
        // inside the same promise Nuxt's onServerPrefetch awaits, so the
        // error (and its status code) is already decided before the SSR
        // response gets serialized — a `watch(error, ...)` on the outside
        // isn't guaranteed to fire in time for that (see useSEO.ts).
        //
        // Crossing the `await` above loses Nuxt's async context (same
        // issue plugins/axios.ts works around for its own post-await
        // composable calls), so showError/createError need to be run back
        // inside it explicitly or they're silent no-ops on the server.
        //
        // Return (don't rethrow): showError already hands rendering over to
        // error.vue — an exception escaping this handler instead surfaces
        // as an unhandled SSR render error (Nitro's raw JSON error page)
        // rather than that styled page.
        const statusCode = (err as { response?: { status?: number } })?.response?.status ?? 500
        await nuxtApp.runWithContext(() => {
          showError(createError({
            statusCode,
            statusMessage: statusCode === 404 ? 'Property not found' : 'Something went wrong',
            fatal: true,
          }))
        })
        return null
      }
    },
    {
      watch: [() => propertyFilter.lat, () => propertyFilter.lng],
    },
  )

  // A getter, not a one-off assignment — see useSEO.ts's `source` comment.
  // unhead calls this when it resolves head tags for the response, by
  // which point `property` is already populated.
  seo.setSEO(() => {
    const value = property.value
    if (!value) {
      return { title: '', description: '', image: undefined }
    }

    const coverImage = pickCoverImage(value.images ?? [])
    const locationName = `${value.district[langKey.value]}, ${value.district.province[langKey.value]}`
    const priceLabel = `$${value.monthly_price}/${t('month')}`

    const title = t('property.seo.title', {
      title: value.title,
      location: locationName,
      price: priceLabel,
    })

    // Structured facts first — always accurate, unlike the landlord's own
    // description text, which is optional filler appended only if it earns
    // its space (see below).
    const introSentence = t('property.seo.descriptionIntro', {
      propertyType: value.propertyType[langKey.value],
      location: locationName,
    })

    // Parking is a dedicated, structured field (type/slots/price) rather
    // than a loose amenity checkbox, so it gets first claim on the feature
    // slots — e.g. "car parking" — and generic amenities only fill what's
    // left over.
    const parkingNames = Array.from(new Set(
      (value.parkings ?? []).map((parking) => PARKING_UI[parking.type].label[currentLang.value as 'en' | 'km']),
    )).map((label) => `${label.toLowerCase()} ${t('property.parking').toLowerCase()}`)

    const amenityNames = (value.amenities ?? [])
      .slice(0, Math.max(0, MAX_SEO_FEATURES - parkingNames.length))
      .map((amenity) => amenity[langKey.value])
      .filter(Boolean)

    const featureNames = [...parkingNames, ...amenityNames]

    const featureParts = [
      t('property.seo.bedroomCount', { bedroom: value.bedroom }, value.bedroom),
      t('property.seo.bathroomCount', { bathroom: value.bathroom }, value.bathroom),
      value.furnished ? t('property.furnished').toLowerCase() : t('property.unfurnished').toLowerCase(),
    ]
    if (featureNames.length) {
      featureParts.push(t('property.seo.withAmenities', { amenities: featureNames.join(', ') }))
    }
    const featureSentence = `${featureParts.join(', ')}.`

    const priceSentence = t('property.seo.descriptionPrice', { price: priceLabel })

    const descriptionBase = [introSentence, featureSentence, priceSentence].join(' ')

    // Fill remaining budget with a snippet of the landlord's own
    // description — only when it's substantial enough to add anything
    // ("oh", "n/a", etc. would just waste the remaining characters).
    const remaining = SEO_DESCRIPTION_MAX_LENGTH - descriptionBase.length - 1
    const rawDescription = (value.description ?? '').trim()
    const isMeaningful = rawDescription.length >= MIN_MEANINGFUL_DESCRIPTION_LENGTH
    const snippet = isMeaningful
      ? (rawDescription.length > remaining
          ? `${rawDescription.slice(0, Math.max(0, remaining - 3))}...`
          : rawDescription)
      : ''
    const description = remaining > 20 && snippet ? `${descriptionBase} ${snippet}` : descriptionBase

    return {
      title,
      description,
      image: coverImage
        ? `${config.public.R2_PUB_URL}/${coverImage.imageKey}`
        : `${config.public.BASE_URL}/sabayrent-logo.webp`,
    }
  })

  watch(
    id,
    (value) => {
      incrementView(api, viewedProperties, value)
    },
    { immediate: true },
  )

  return {
    property,
    pending,
  }
}
