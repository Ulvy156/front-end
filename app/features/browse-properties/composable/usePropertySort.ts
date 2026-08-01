import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { checkLocationPermission, getCurrentLocation } from '~/utils/getCurrentLocation'
import { useNotify } from '~/composables/useNotify'
import { usePropertyFilterStore } from '~/stores/propertyFilter'

export interface SortOption {
  id: number
  label: string
}

export function usePropertySort() {
  const filterStore = usePropertyFilterStore()
  const { warning } = useNotify()
  const { t } = useI18n()

  const sortOptions = computed<SortOption[]>(() => [
    { id: 0, label: t('filter.sort.newest') },
    { id: 1, label: t('filter.sort.priceLowToHigh') },
    { id: 2, label: t('filter.sort.priceHighToLow') },
    { id: 3, label: t('filter.sort.mostPopular') },
    { id: 4, label: t('filter.sort.nearest') },
  ])

  watch(
    () => filterStore.orderType,
    async (newVal) => {
      // Switching away from "Nearest" only changes the sort mode. Keep
      // lat/lng in the store: the backend returns distanceKm on every item
      // whenever lat/lng are present, regardless of orderType, so leaving
      // them set keeps distance visible on cards after the sort changes.
      // They're only cleared by an explicit "remove nearest" action or a
      // full filter reset.
      if (newVal !== 4) {
        return
      }

      try {
        const status = await checkLocationPermission()
        if (status === 'denied') {
          warning(t('filter.locationBlocked'))
          filterStore.orderType = null
          return
        }

        const location = await getCurrentLocation()
        filterStore.lat = location.latitude
        filterStore.lng = location.longitude
      } catch {
        filterStore.orderType = null
        warning(t('filter.locationDenied'))
      }
    },
  )

  return {
    filterStore,
    sortOptions,
  }
}
