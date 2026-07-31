export type { PlatformSettings } from '~/types/settings'

export interface UpdatePlatformSettingsPayload {
  maintenanceMode?: boolean
  registrationEnabled?: boolean
  maxPropertiesPerLandlord?: number
  maxImagesPerProperty?: number
  minPropertyPrice?: number | null
  maxPropertyPrice?: number | null
}

export const KNOWN_SETTING_KEYS: readonly string[] = [
  'maintenanceMode',
  'registrationEnabled',
  'maxPropertiesPerLandlord',
  'maxImagesPerProperty',
  'minPropertyPrice',
  'maxPropertyPrice',
]

export type SettingValue = string | number | boolean | null | SettingValue[] | { [key: string]: SettingValue }

export interface CreateSettingPayload {
  key: string
  group: string
  value: SettingValue
}

export type UpdateCustomSettingPayload = Record<string, SettingValue>
