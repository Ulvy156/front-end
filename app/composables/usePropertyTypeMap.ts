import { computed } from 'vue'
import { usePropertyTypeOptions } from '~/features/browse-properties/composable/usePropertyTypeOptions'
import { propertyTypeKey } from '~/utils/propertyTypeKey'

// id<->key lookup tables for the post-property / edit-property forms,
// derived from the live /property-type list instead of a hardcoded id map —
// see propertyTypeKey.ts for why.
export function usePropertyTypeMap() {
  const { data, isFetching } = usePropertyTypeOptions()

  const byKey = computed(() => {
    const map: Record<string, number> = {}
    for (const item of data.value) map[propertyTypeKey(item.nameEn)] = item.id
    return map
  })

  const byId = computed(() => {
    const map: Record<number, string> = {}
    for (const item of data.value) map[item.id] = propertyTypeKey(item.nameEn)
    return map
  })

  return { byKey, byId, isFetching }
}
