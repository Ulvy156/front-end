import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { LandlordPropertyDetail } from '~/features/landlord/types/property'
import { updateProperty, type UpdatePropertyPayload } from '../services/update-property'

const TYPE_ID_MAP: Record<string, number> = {
  room: 1,
  studio: 2,
  apartment: 3,
  house: 4,
  single_room: 5,
}

const TYPE_NAME_TO_KEY: Record<string, string> = {
  room: 'room',
  studio: 'studio',
  apartment: 'apartment',
  house: 'house',
  'single room': 'single_room',
}

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

  const { data: property, isPending, isError } = useQuery({
    queryKey: computed(() => ['edit-property', propertyId.value]),
    queryFn: async () => {
      const { data } = await $axios.get<LandlordPropertyDetail>(`/landlord/properties/${propertyId.value}`)
      return data
    },
    enabled: computed(() => !!propertyId.value),
  })

  function mapPropertyToForm(p: LandlordPropertyDetail) {
    const typeKey = TYPE_NAME_TO_KEY[p.propertyType.nameEn.toLowerCase()] || 'room'
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
      fullyFurnished: p.furnished,
      province: p.district.province.nameEn,
      district: p.district.nameEn,
      districtId: 0,
      streetAddress: p.address,
      mapsLink: p.locationUrl || '',
      latitude: p.lat,
      longitude: p.lng,
      hideAddress: false,
      rent: String(p.monthly_price),
      deposit: String(p.deposit),
      minStay: minStayKey,
      availableFrom: p.availableFrom ? p.availableFrom.split('T')[0] : '',
      isAvailable: p.isAvailable,
      amenities: p.amenities.map((a: any) => a.id).filter(Boolean),
      parkings: parkingKeys,
      parkingDetails,
      ruleKeys: [] as number[],
      additionalNotes: '',
      photos: [] as string[],
      photoFiles: [] as File[],
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
      furnished: !!form.fullyFurnished,
      districtId: Number(form.districtId) || undefined,
      address: form.streetAddress,
      locationUrl: form.mapsLink,
      lat: form.latitude ? Number(form.latitude) : null,
      lng: form.longitude ? Number(form.longitude) : null,
      propertyTypeId: TYPE_ID_MAP[form.propertyType] || undefined,
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

  return {
    property,
    isPending,
    isError,
    mapPropertyToForm,
    submitUpdate,
  }
}
