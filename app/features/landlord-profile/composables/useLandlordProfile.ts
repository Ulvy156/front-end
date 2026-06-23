import { computed, ref, watch } from 'vue'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import { fetchPublicLandlordProfile } from '../services/landlord-profile'
import type {
  LandlordProfileResponse,
  LandlordPropertiesMeta,
  LandlordPropertyItem,
  PublicLandlord,
} from '../interface/landlord-profile'

const PAGE_SIZE = 12

const emptyMeta: LandlordPropertiesMeta = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

export function useLandlordProfile(id: string) {
  const api = useApi()
  const page = ref(1)

  const { data, pending, error, refresh } = useAsyncData<LandlordProfileResponse>(
    `landlord-profile-${id}`,
    () => fetchPublicLandlordProfile(api, id, { page: page.value, limit: PAGE_SIZE }),
  )

  const landlord = computed<PublicLandlord | null>(() => data.value?.landlord ?? null)
  const properties = computed<LandlordPropertyItem[]>(() => data.value?.properties.items ?? [])
  const meta = computed<LandlordPropertiesMeta>(() => data.value?.properties.meta ?? emptyMeta)

  watch(page, () => refresh())

  return {
    landlord,
    properties,
    meta,
    page,
    pageSize: PAGE_SIZE,
    pending,
    error,
    refresh,
  }
}
