export interface PlatformSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  maxPropertiesPerLandlord: number
  maxImagesPerProperty: number
  minPropertyPrice: number | null
  maxPropertyPrice: number | null
  [key: string]: unknown
}
