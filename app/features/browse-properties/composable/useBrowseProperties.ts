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

  const fetchProperties = () =>
    fetchBrowseProperties(api, {
      ...filterStore.queryParams,
    })
      .finally(() => {
        isFetching.value = false
      })

  const { data, refresh } = useAsyncData<BrowsePropertiesResponse>(
    'browse-properties',
    fetchProperties,
  )

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
    filterStore.init()
    await refreshProperties()
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
