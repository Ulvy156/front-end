export type SettingValue = string | number | boolean | null | SettingValue[] | { [key: string]: SettingValue }
export type SettingValueKind = 'string' | 'number' | 'boolean' | 'json'

export interface AppSetting {
  id: string
  category: string
  key: string
  value: SettingValue
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSettingPayload {
  category: string
  key: string
  value: SettingValue
  description?: string | null
  isPublic?: boolean
}

export interface UpdateSettingPayload {
  value?: SettingValue
  description?: string | null
  isPublic?: boolean
}
