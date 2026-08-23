// Derives the string key used across post-property/edit-property forms
// (room, single_room, ...) from a property type's nameEn, so newly added
// backend property types (e.g. Villa) work everywhere without a matching
// hardcoded id map on the frontend.
export function propertyTypeKey(nameEn: string): string {
  return nameEn.trim().toLowerCase().replace(/\s+/g, '_')
}
