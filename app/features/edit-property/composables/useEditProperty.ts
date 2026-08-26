import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { LandlordPropertyDetail } from '~/features/landlord/types/property'
import { usePropertyTypeMap } from '~/composables/usePropertyTypeMap'
import { propertyTypeKey } from '~/utils/propertyTypeKey'
import { updateProperty, type UpdatePropertyPayload } from '../services/update-property'
import { updatePropertyImages, type UpdatePropertyImagesPayload } from '../services/property-image'
import { safeNumber } from '~/features/post-property/utils/propertyPayloadMaps'

const MIN_STAY_TO_KEY: Record<number, string> = {
  1: '1m',
  3: '3m',
  6: '6m',
  12: '1y',
  24: '2y',
}

const MIN_STAY_TO_MONTHS: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
  '2y': 24,
}

const PARKING_TYPE_MAP: Record<string, string> = {
  BICYCLE: 'BIKE',
  MOTO: 'MOTORBIKE',
  CAR: 'CAR',
  TUK_TUK: 'TUK_TUK',
}

const PARKING_FORM_TO_API: Record<string, string> = {
  BIKE: 'BICYCLE',
  MOTORBIKE: 'MOTO',
  CAR: 'CAR',
  TUK_TUK: 'TUK_TUK',
}

export function useEditProperty(propertyId: Ref<string>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()
  const { byKey: typeByKey } = usePropertyTypeMap()

  const { data: property, isPending, isError } = useQuery({
    queryKey: computed(() => ['edit-property', propertyId.value]),
    queryFn: async () => {
      const { data } = await $axios.get<LandlordPropertyDetail>(`/landlord/properties/${propertyId.value}`)
      return data
    },
    enabled: computed(() => !!propertyId.value),
  })

  function mapPropertyToForm(p: LandlordPropertyDetail) {
    const typeKey = propertyTypeKey(p.propertyType.nameEn)
    const minStayKey = MIN_STAY_TO_KEY[p.minimumStayLength] || '1m'

    const parkingKeys = p.parkings.map(pk => PARKING_TYPE_MAP[pk.type] || pk.type)
    const parkingDetails: Record<string, { slots: number; isFree: boolean; price?: number }> = {}
    p.parkings.forEach(pk => {
      const formKey = PARKING_TYPE_MAP[pk.type] || pk.type
      parkingDetails[formKey] = {
        slots: pk.slots,
        isFree: pk.isFree,
        ...(pk.price != null && !pk.isFree ? { price: pk.price } : {}),
      }
    })

    return {
      propertyType: typeKey,
      propertyTitle: p.title,
      description: p.description,
      bedrooms: p.bedroom,
      bathrooms: p.bathroom,
      size: String(p.sizeSqm),
      sizeWidthM: p.sizeWidthM != null ? String(p.sizeWidthM) : '',
      sizeLengthM: p.sizeLengthM != null ? String(p.sizeLengthM) : '',
      fullyFurnished: p.furnished,
      province: p.district.province.nameEn,
      district: p.district.nameEn,
      districtId: 0,
      streetAddress: p.address,
      latitude: p.lat,
      longitude: p.lng,
      hideAddress: false,
      rent: String(p.monthly_price),
      deposit: String(p.deposit),
      minStay: minStayKey,
      availableFrom: p.availableFrom ? p.availableFrom.split('T')[0] : '',
      isAvailable: p.isAvailable,
      // NOTE: assumes p.amenities[].id is populated by GET /landlord/properties/:id.
      // Verify against a live response before trusting this — if it's ever missing
      // (as has happened for `rules[]`, hence the name-match hydration in
      // edit-section.vue below), this silently produces an empty amenities list and
      // the "≥3 amenities" required rule will spuriously block every save.
      amenities: p.amenities.map((a: any) => a.id).filter(Boolean),
      parkings: parkingKeys,
      parkingDetails,
      ruleKeys: [] as number[],
      additionalNotes: '',
      photos: [] as string[],
      photoFiles: [] as File[],
      photoFileIds: [] as string[],
      removeImageIds: [] as string[],
      coverImageId: null as string | null,
      coverFileId: null as string | null,
      floor: p.floor,
      totalFloors: p.totalFloors,
      openTime: p.openTime || '',
      closeTime: p.closeTime || '',
    }
  }

  function buildUpdatePayload(form: any): UpdatePropertyPayload {
    const parkings = Array.isArray(form.parkings)
      ? form.parkings
          .map((pk: string) => {
            const apiType = PARKING_FORM_TO_API[pk] || pk
            if (!['MOTO', 'BICYCLE', 'CAR', 'TUK_TUK'].includes(apiType)) return null
            const details = form.parkingDetails?.[pk]
            return {
              type: apiType,
              slots: Number(details?.slots) || 0,
              isFree: details?.isFree ?? true,
              ...(!details?.isFree && details?.price ? { price: Number(details.price) } : {}),
            }
          })
          .filter(Boolean)
      : []

    return {
      title: form.propertyTitle,
      description: form.description,
      monthly_price: Number(form.rent) || 0,
      deposit: Number(form.deposit) || 0,
      bedroom: Number(form.bedrooms) || 0,
      bathroom: Number(form.bathrooms) || 0,
      floor: Number(form.floor) || 1,
      totalFloors: Number(form.totalFloors) || 1,
      sizeSqm: Number(form.size) || 0,
      sizeWidthM: safeNumber(form.sizeWidthM),
      sizeLengthM: safeNumber(form.sizeLengthM),
      furnished: !!form.fullyFurnished,
      districtId: Number(form.districtId) || undefined,
      address: form.streetAddress,
      lat: form.latitude ? Number(form.latitude) : null,
      lng: form.longitude ? Number(form.longitude) : null,
      propertyTypeId: typeByKey.value[form.propertyType] || undefined,
      minimumStayLength: MIN_STAY_TO_MONTHS[form.minStay] || undefined,
      availableFrom: form.availableFrom ? new Date(form.availableFrom).toISOString() : undefined,
      amenityKeys: Array.isArray(form.amenities) ? form.amenities.map(Number).filter(Number.isFinite) : [],
      ruleKeys: Array.isArray(form.ruleKeys) ? form.ruleKeys.map(Number).filter(Number.isFinite) : [],
      parkings,
      openTime: form.openTime || undefined,
      closeTime: form.closeTime || undefined,
    }
  }

  async function submitUpdate(form: any) {
    const payload = buildUpdatePayload(form)
    const result = await updateProperty($axios, propertyId.value, payload)
    queryClient.invalidateQueries({ queryKey: ['landlord-property-detail', propertyId.value] })
    queryClient.invalidateQueries({ queryKey: ['edit-property', propertyId.value] })
    queryClient.invalidateQueries({ queryKey: ['landlord-properties'] })
    return result
  }

  // Returns null when the photos step has no staged changes, so callers can
  // skip the request entirely (Save should only fire it when needed).
  function buildImageChanges(form: any): UpdatePropertyImagesPayload | null {
    const files: File[] = Array.isArray(form.photoFiles) ? form.photoFiles : []
    const removeImageIds: string[] = Array.isArray(form.removeImageIds) ? form.removeImageIds : []

    let coverImageId: string | undefined
    let coverNewFileIndex: number | undefined
    if (form.coverImageId) {
      coverImageId = form.coverImageId
    } else if (form.coverFileId) {
      const index = (form.photoFileIds ?? []).indexOf(form.coverFileId)
      if (index !== -1) coverNewFileIndex = index
    }

    const hasChanges = files.length > 0 || removeImageIds.length > 0
      || coverImageId !== undefined || coverNewFileIndex !== undefined
    if (!hasChanges) return null

    return { files, removeImageIds, coverImageId, coverNewFileIndex }
  }

  async function submitImages(form: any) {
    const payload = buildImageChanges(form)
    if (!payload) return null
    const result = await updatePropertyImages($axios, propertyId.value, payload)
    queryClient.invalidateQueries({ queryKey: ['landlord-property-detail', propertyId.value] })
    queryClient.invalidateQueries({ queryKey: ['edit-property', propertyId.value] })
    queryClient.invalidateQueries({ queryKey: ['landlord-properties'] })
    // Only clear staged changes once the server has actually persisted them —
    // if updatePropertyImages throws above, these lines never run, so a
    // failed save leaves the staged files/removals/cover pick untouched and
    // the user can retry Save without redoing that work.
    form.photoFiles = []
    form.photoFileIds = []
    form.removeImageIds = []
    form.coverImageId = null
    form.coverFileId = null
    return result
  }

  return {
    property,
    isPending,
    isError,
    mapPropertyToForm,
    submitUpdate,
    submitImages,
  }
}
