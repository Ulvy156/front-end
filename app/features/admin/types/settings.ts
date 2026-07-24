export type { PlatformSettings } from '~/types/settings'

export interface UpdatePlatformSettingsPayload {
  maintenanceMode?: boolean
  registrationEnabled?: boolean
  maxPropertiesPerLandlord?: number
  maxImagesPerProperty?: number
  minPropertyPrice?: number | null
  maxPropertyPrice?: number | null
  commissionRate?: number
}
