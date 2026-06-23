import { reactive } from 'vue'

export function createPropertyForm() {
  return reactive({
    propertyType: '',
    propertyTitle: '',
    description: '',
    bedrooms: 0,
    bathrooms: 0,
    size: '',
    fullyFurnished: false,
    province: '',
    district: '',
    districtId: 0,
    streetAddress: '',
    mapsLink: '',
    latitude: null as number | null,
    longitude: null as number | null,
    hideAddress: false,
    rent: '',
    deposit: '',
    minStay: '',
    availableFrom: '',
    isAvailable: true,
    amenities: [] as number[],
    parkings: [] as string[],
    parkingDetails: {} as Record<string, any>,
    houseRules: {
      petsAllowed: false,
      smokingAllowed: false,
      guestsAllowed: false,
      partiesAllowed: false,
    },
    additionalNotes: '',
    photos: [] as string[],
    photoFiles: [] as File[],
    floor: 1,
    totalFloors: 1,
  })
}

export function createPropertyFormErrors() {
  return reactive({
    propertyType: '',
    propertyTitle: '',
    description: '',
    size: '',
    province: '',
    district: '',
    streetAddress: '',
    mapsLink: '',
    rent: '',
    minStay: '',
    availableFrom: '',
    photos: '',
    amenities: '',
  })
}
