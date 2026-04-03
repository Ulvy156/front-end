import { watch } from 'vue'

import { checkLocationPermission, getCurrentLocation } from '~/utils/getCurrentLocation'
import { useNotify } from '~/composables/useNotify'
import { usePropertyFilterStore } from '~/stores/propertyFilter'

export interface SortOption {
  id: number
  label: string
}

export const sortOptions: SortOption[] = [
  {
    id: 0,
    label: 'Newest First',
  },
  {
    id: 1,
    label: 'Price: Low to High',
  },
  {
    id: 2,
    label: 'Price: High to Low',
  },
  {
    id: 3,
    label: 'Most Popular',
  },
  {
    id: 4,
    label: 'Nearest Location',
  },
]

export function usePropertySort() {
  const filterStore = usePropertyFilterStore()
  const { warning } = useNotify()

  watch(
    () => filterStore.orderType,
    async (newVal) => {
      if (newVal !== 4) {
        filterStore.lat = null
        filterStore.lng = null
        return
      }

      try {
        const status = await checkLocationPermission()
        if (status === 'denied') {
          warning(
            'Location access is blocked. Please enable it in your browser settings.',
          )
          filterStore.orderType = null
          return
        }

        const location = await getCurrentLocation()
        filterStore.lat = location.latitude
        filterStore.lng = location.longitude
      } catch {
        filterStore.orderType = null
        warning(
          'We can’t show nearest properties because location access was denied.',
        )
      }
    },
  )

  return {
    filterStore,
    sortOptions,
  }
}
