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
    ruleKeys: [] as number[],
    additionalNotes: '',
    photos: [] as string[],
    photoFiles: [] as (File | null)[],
    // Parallel to `photos`/`photoFiles`: null = a newly-picked local file
    // (not yet uploaded), string = the R2 key of an already-saved draft image.
    photoKeys: [] as (string | null)[],
    // R2 keys of existing draft images queued for removal on the next
    // "Save as Draft" (property-draft PATCH's removeImageKeys).
    removeImageKeys: [] as string[],
    floor: 1,
    totalFloors: 1,
    openTime: '',
    closeTime: '',
  })
}
