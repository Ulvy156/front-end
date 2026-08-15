export function localizedName(
  item: { nameEn: string; nameKh?: string },
  langKey: 'nameEn' | 'nameKh',
): string {
  return item[langKey] || item.nameEn
}
