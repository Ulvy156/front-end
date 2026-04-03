import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import { fetchHomePageData, type HomePageData } from '../services/home'

export function useHomePageData() {
  const api = useApi()

  return useAsyncData<HomePageData>('home-page', () => fetchHomePageData(api))
}
