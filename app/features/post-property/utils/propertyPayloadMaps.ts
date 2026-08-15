// Shared form <-> API payload conversion tables for the post-property wizard.
// Extracted out of post-section.vue's publish() so the draft save/load path
// (usePropertyDraftSession.ts) can reuse the exact same mappings instead of a
// second, hand-copied set that could silently drift out of sync.

export const TYPE_MAP: Record<string, number> = {
  room: 1,
  studio: 2,
  apartment: 3,
  house: 4,
  single_room: 5,
}

export const TYPE_MAP_REVERSE: Record<number, string> = {
  1: 'room',
  2: 'studio',
  3: 'apartment',
  4: 'house',
  5: 'single_room',
}

export const MIN_STAY_MAP: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
  '2y': 24,
}

export const MIN_STAY_MAP_REVERSE: Record<number, string> = {
  1: '1m',
  3: '3m',
  6: '6m',
  12: '1y',
  24: '2y',
}

// Form parking keys (BIKE/MOTORBIKE/CAR/TUK_TUK, per amenities.vue's
// parkingOptions) -> API parking types.
export const PARKING_TYPE_MAP: Record<string, string> = {
  BIKE: 'BICYCLE',
  MOTORBIKE: 'MOTO',
  MOTO: 'MOTO',
  CAR: 'CAR',
  TUK_TUK: 'TUK_TUK',
  BICYCLE: 'BICYCLE',
}

// API parking types -> form parking keys (inverse of the above, using the
// canonical form key for each type, matching amenities.vue's parkingOptions).
export const PARKING_TYPE_MAP_REVERSE: Record<string, string> = {
  BICYCLE: 'BIKE',
  MOTO: 'MOTORBIKE',
  CAR: 'CAR',
  TUK_TUK: 'TUK_TUK',
}

export function safeNumber(v: any): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export function buildAmenityKeys(form: any): number[] {
  return Array.isArray(form.amenities)
    ? form.amenities.map((v: unknown) => Number(v)).filter((n: unknown) => Number.isFinite(n))
    : []
}

export function buildRuleKeys(form: any): number[] {
  return Array.isArray(form.ruleKeys)
    ? form.ruleKeys.map((v: any) => Number(v)).filter((n: number) => Number.isFinite(n))
    : []
}

export interface BuiltParking {
  type: string
  slots: number
  isFree: boolean
  price?: number
}

export function buildParkings(form: any): BuiltParking[] {
  return Array.isArray(form.parkings)
    ? form.parkings
        .map((pk: string) => {
          const type = PARKING_TYPE_MAP[pk] || pk
          if (!['MOTO', 'BICYCLE', 'CAR', 'TUK_TUK'].includes(type)) return null

          const rawSlots = form.parkingDetails?.[pk]?.slots
          const rawPrice = form.parkingDetails?.[pk]?.price
          const isFree = form.parkingDetails?.[pk]?.isFree ?? true

          const slotsNum = Number(rawSlots)
          const priceNum = Number(rawPrice)

          const parking: BuiltParking = {
            type,
            slots: Number.isFinite(slotsNum) ? slotsNum : 0,
            isFree,
          }

          if (!isFree) {
            parking.price = Number.isFinite(priceNum) ? priceNum : 0
          }

          return parking
        })
        .filter(Boolean)
    : []
}
