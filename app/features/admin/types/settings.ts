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

export interface UpdatePlatformSettingsPayload {
  maintenanceMode?: boolean
  registrationEnabled?: boolean
  maxPropertiesPerLandlord?: number
  maxImagesPerProperty?: number
  minPropertyPrice?: number | null
  maxPropertyPrice?: number | null
  commissionRate?: number
}
