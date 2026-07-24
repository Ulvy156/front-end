export interface PlatformSettings {
  id: number
  maintenanceMode: boolean
  registrationEnabled: boolean
  maxPropertiesPerLandlord: number
  maxImagesPerProperty: number
  minPropertyPrice: string | null
  maxPropertyPrice: string | null
  commissionRate: string
  updatedAt: string
}
