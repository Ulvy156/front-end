import type { PropertyCardItem } from '~/features/browse-properties/interface/property-card-item'

export interface FavouriteRecord {
  id: string
  userId: string
  propertyId: string
  createdAt: string
}

// Shape returned by GET /user-favourite/all/user-id/:userId
// property mirrors PropertyCardItem — distanceKm not included by this endpoint
export interface FavouriteItem {
  id: string       // favourite record ID used for DELETE
  createdAt: string
  property: Omit<PropertyCardItem, 'distanceKm'> & { distanceKm: null }
}
