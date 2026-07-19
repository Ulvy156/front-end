import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'
import { debounce } from 'lodash-unified'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import { usePropertyFilterStore } from '~/stores/propertyFilter'
import { fetchBrowseProperties } from '../services/browse-properties'
import type { Meta, PropertyCardItem } from '../interface/property-card-item'

interface BrowsePropertiesResponse {
  items: PropertyCardItem[]
  meta: Meta
}

const emptyMeta: Meta = {
  page: 1,
  limit: 6,
  total: 0,
  totalPages: 0,
}

export function useBrowseProperties() {
  const api = useApi()
  const filterStore = usePropertyFilterStore()
  const isFetching = ref(true)

  // Restore persisted filters before the watcher below subscribes, so the
  // restore itself doesn't queue a second, competing fetch on mount.
  filterStore.init()

  let requestId = 0

  const fetchProperties = () => {
    const currentRequestId = ++requestId

    return fetchBrowseProperties(api, {
      ...filterStore.queryParams,
    })
      .finally(() => {
        // Ignore a stale request finishing after a newer one was queued —
        // otherwise it can flip isFetching to false before the latest data lands.
        if (currentRequestId === requestId) {
          isFetching.value = false
        }
      })
  }

  const { data, refresh } = useAsyncData<BrowsePropertiesResponse>(
    'browse-properties',
    fetchProperties,
    { immediate: false },
  )

  // Data from a previous visit this session is already sitting in Nuxt's
  // payload cache — show it immediately instead of blanking to a skeleton.
  if (data.value) {
    isFetching.value = false
  }

  const items = computed<PropertyCardItem[]>(() => data.value?.items ?? [])
  const meta = computed<Meta>(() => data.value?.meta ?? emptyMeta)

  const refreshProperties = async () => {
    isFetching.value = true
    await refresh()
  }

  const debouncedRefresh = debounce(() => {
    refreshProperties()
  }, 1000)

  watch(
    () => filterStore.queryParams,
    () => {
      isFetching.value = true
      debouncedRefresh()
    },
    { deep: true },
  )

  watch(
    items,
    () => {
      filterStore.result = items.value.length
    },
    { immediate: true },
  )

  onMounted(async () => {
    // Cached data is already on screen — revalidate quietly in the background
    // rather than flashing the skeleton back on for a page we've just shown.
    if (data.value) {
      await refresh()
    } else {
      await refreshProperties()
    }
  })

  onScopeDispose(() => {
    debouncedRefresh.cancel()
  })

  return {
    filterStore,
    isFetching,
    items,
    meta,
  }
}
