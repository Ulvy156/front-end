import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { usePropertyTypeMap } from '~/composables/usePropertyTypeMap'
import { createDraft, updateDraft, type PropertyDraft } from '~/features/property-draft/services/property-draft'
import {
  MIN_STAY_MAP,
  MIN_STAY_MAP_REVERSE,
  PARKING_TYPE_MAP_REVERSE,
  buildAmenityKeys,
  buildRuleKeys,
  buildParkings,
  safeNumber,
} from '../utils/propertyPayloadMaps'

// Wizard-specific glue between the shared `postPropertyForm` reactive object
// and the /property-draft CRUD endpoints — mapping the form's field names
// (propertyTitle, rent, size, ...) to/from the draft's API field names
// (title, monthly_price, sizeSqm, ...), and building a best-effort partial
// payload (only fields the landlord has actually filled in) for save.
export function usePropertyDraftSession() {
  const api = useApi()
  const { byKey: typeByKey, byId: typeById } = usePropertyTypeMap()
  const draftId = ref<string | null>(null)
  const savingDraft = ref(false)

  function loadDraftIntoForm(form: any, draft: PropertyDraft) {
    const d = draft.data
    draftId.value = draft.id

    if (d.propertyTypeId !== undefined) form.propertyType = typeById.value[d.propertyTypeId] || ''
    if (d.title !== undefined) form.propertyTitle = d.title
    if (d.description !== undefined) form.description = d.description
    if (d.bedroom !== undefined) form.bedrooms = d.bedroom
    if (d.bathroom !== undefined) form.bathrooms = d.bathroom
    if (d.sizeSqm !== undefined) form.size = String(d.sizeSqm)
    if (d.furnished !== undefined) form.fullyFurnished = d.furnished
    if (d.districtId !== undefined) form.districtId = d.districtId
    if (d.address !== undefined) form.streetAddress = d.address
    if (d.lat !== undefined) form.latitude = d.lat
    if (d.lng !== undefined) form.longitude = d.lng
    if (d.monthly_price !== undefined) form.rent = String(d.monthly_price)
    if (d.deposit !== undefined) form.deposit = String(d.deposit)
    if (d.minimumStayLength !== undefined) form.minStay = MIN_STAY_MAP_REVERSE[d.minimumStayLength] || ''
    if (d.availableFrom) form.availableFrom = d.availableFrom.split('T')[0]
    if (d.floor !== undefined) form.floor = d.floor
    if (d.totalFloors !== undefined) form.totalFloors = d.totalFloors
    if (d.openTime !== undefined) form.openTime = d.openTime
    if (d.closeTime !== undefined) form.closeTime = d.closeTime
    if (d.amenityKeys) form.amenities = [...d.amenityKeys]
    if (d.ruleKeys) form.ruleKeys = [...d.ruleKeys]

    if (d.parkings?.length) {
      const parkingDetails: Record<string, any> = {}
      const parkingKeys: string[] = []
      d.parkings.forEach((pk) => {
        const formKey = PARKING_TYPE_MAP_REVERSE[pk.type] || pk.type
        parkingKeys.push(formKey)
        parkingDetails[formKey] = {
          slots: pk.slots,
          isFree: pk.isFree,
          ...(pk.price != null && !pk.isFree ? { price: pk.price } : {}),
        }
      })
      form.parkings = parkingKeys
      form.parkingDetails = parkingDetails
    }

    // draft.images are already-uploaded — seed photos/photoKeys and pad
    // photoFiles with nulls so all three arrays stay index-aligned (see
    // photos.vue for why this lockstep shape matters).
    form.photos = draft.images.map((i) => i.url)
    form.photoKeys = draft.images.map((i) => i.key)
    form.photoFiles = draft.images.map(() => null)
    form.removeImageKeys = []
  }

  function buildDraftData(form: any): Record<string, any> {
    const data: Record<string, any> = {}

    if (form.propertyTitle) data.title = form.propertyTitle
    if (form.description) data.description = form.description
    if (form.streetAddress) data.address = form.streetAddress

    const rent = safeNumber(form.rent)
    if (rent !== undefined) data.monthly_price = rent
    const deposit = safeNumber(form.deposit)
    if (deposit !== undefined) data.deposit = deposit

    const districtId = Number(form.districtId)
    if (districtId) data.districtId = districtId

    if (typeByKey.value[form.propertyType]) data.propertyTypeId = typeByKey.value[form.propertyType]

    const size = safeNumber(form.size)
    if (size !== undefined) data.sizeSqm = size
    if (form.floor) data.floor = Number(form.floor)
    if (form.totalFloors) data.totalFloors = Number(form.totalFloors)

    const bedroom = safeNumber(form.bedrooms)
    if (bedroom !== undefined) data.bedroom = bedroom
    const bathroom = safeNumber(form.bathrooms)
    if (bathroom !== undefined) data.bathroom = bathroom

    if (form.fullyFurnished) data.furnished = true
    if (form.availableFrom) data.availableFrom = new Date(form.availableFrom).toISOString()
    if (MIN_STAY_MAP[form.minStay]) data.minimumStayLength = MIN_STAY_MAP[form.minStay]
    if (form.openTime) data.openTime = form.openTime
    if (form.closeTime) data.closeTime = form.closeTime
    if (form.propertyType) data.folderType = form.propertyType

    const amenityKeys = buildAmenityKeys(form)
    if (amenityKeys.length) data.amenityKeys = amenityKeys
    const ruleKeys = buildRuleKeys(form)
    if (ruleKeys.length) data.ruleKeys = ruleKeys
    const parkings = buildParkings(form)
    if (parkings.length) data.parkings = parkings

    return data
  }

  async function saveDraft(form: any) {
    savingDraft.value = true
    try {
      const data = buildDraftData(form)
      const newFiles = (form.photoFiles || []).filter((f: unknown): f is File => f instanceof File)
      const removeImageKeys = form.removeImageKeys || []

      const draft = draftId.value
        ? await updateDraft(api, draftId.value, data, newFiles, removeImageKeys)
        : await createDraft(api, data, newFiles)

      draftId.value = draft.id
      // Reconcile: replace locally-previewed new uploads with server-confirmed
      // url/key pairs, and clear the removal queue now that it's been sent.
      form.photos = draft.images.map((i) => i.url)
      form.photoKeys = draft.images.map((i) => i.key)
      form.photoFiles = draft.images.map(() => null)
      form.removeImageKeys = []

      return draft
    } finally {
      savingDraft.value = false
    }
  }

  return { draftId, savingDraft, loadDraftIntoForm, saveDraft }
}
