import { ref, watch } from 'vue'

import { useDebounceFn } from '@vueuse/core'

import { useApi } from '~/composables/useApi'
import { usePropertyFilterStore } from '~/stores/propertyFilter'
import {
  fetchLocationSuggestions,
  type LocationSuggestion,
} from '../services/browse-properties'

export function useLocationAutocomplete() {
  const api = useApi()
  const filterStore = usePropertyFilterStore()

  // Local display text, decoupled from the store: typing must not touch
  // filterStore.locationName (that would retrigger the property fetch on
  // every keystroke). The store is only written on an actual select/clear.
  const keyword = ref(filterStore.locationName)

  watch(
    () => filterStore.locationName,
    (value) => {
      keyword.value = value
    },
  )

  const fetchLocations = useDebounceFn(
    async (query: string, cb: (results: LocationSuggestion[]) => void) => {
      if (!query || query.length < 2) {
        cb([])
        return
      }

      cb(await fetchLocationSuggestions(api, query))
    },
    1000,
  )

  const searchLocations = (
    query: string,
    cb: (results: LocationSuggestion[]) => void,
  ) => {
    fetchLocations(query, cb)
  }

  const clearLocation = () => {
    filterStore.location = null
    filterStore.locationType = null
    filterStore.locationName = ''
  }

  const selectLocation = (item: LocationSuggestion) => {
    filterStore.location = item.id
    filterStore.locationType = item.type
    filterStore.locationName = item.label
  }

  return {
    keyword,
    clearLocation,
    searchLocations,
    selectLocation,
  }
}
