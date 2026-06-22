export interface ConfigItemBase {
  id: number
  nameEn: string
  nameKh: string
  icon: string
}

export interface PropertyTypeItem extends ConfigItemBase {
  code: string
  slug: string
}

export interface AmenityItem extends ConfigItemBase {
  code: string
}

export interface HouseRuleItem extends ConfigItemBase {
  key: string
}

export interface ConfigFieldDef {
  prop: string
  label: string
  placeholder?: string
  required?: boolean
}
