import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FavouriteItem } from '../types/favourite'
import {
  fetchAllFavourites,
  saveFavourite,
  removeFavourite,
} from '../services/favourite.service'

// Variables passed to the remove mutation — the favouriteId must be captured
// before the optimistic cache update removes the entry from the map.
type RemoveVars = { propertyId: string; favouriteId: string }

export function useFavourites() {
  const authStore = useAuthStore()
  const api = useApi()
  const notify = useNotify()
  const { extract } = useErrorMsg()
  const { t } = useI18n()
  const queryClient = useQueryClient()

  const userId = computed(() => authStore.user?.id ?? '')

  // Scoped per user so different accounts on the same browser never share data
  const queryKey = computed(() => ['favourites', userId.value])

  // ── Query ──────────────────────────────────────────────────────────────────
  // Fires automatically when authStore.user is set; does nothing when logged out.

  const { data, isSuccess } = useQuery({
    queryKey,
    queryFn: () => fetchAllFavourites(api, userId.value),
    enabled: computed(() => !!authStore.user),
    staleTime: Infinity, // Only goes stale after our own mutations invalidate it
  })

  // O(1) map: propertyId → favouriteId (the record ID needed for DELETE)
  const favouriteMap = computed<Map<string, string>>(
    () => new Map(data.value?.map(f => [f.property.id, f.id]) ?? []),
  )

  // Shared across every component instance through Nuxt's useState.
  // Without this, two cards toggling simultaneously would each see stale
  // isPending state since useMutation.isPending is per-instance.
  const togglingIds = useState<Record<string, boolean>>('favourite_toggling', () => ({}))

  const isFavourited = (propertyId: string) => favouriteMap.value.has(propertyId)
  const isToggling = (propertyId: string) => !!togglingIds.value[propertyId]

  // ── Save mutation ─────────────────────────────────────────────────────────

  const { mutate: saveItem } = useMutation({
    mutationFn: (propertyId: string) => saveFavourite(api, propertyId),

    onMutate: async (propertyId) => {
      // Cancel any in-flight refetch so it doesn't overwrite the optimistic entry
      await queryClient.cancelQueries({ queryKey: queryKey.value })
      togglingIds.value[propertyId] = true

      const snapshot = queryClient.getQueryData<FavouriteItem[]>(queryKey.value)

      // Optimistic: add a placeholder so isFavourited() returns true immediately.
      // The placeholder is replaced by real data when invalidateQueries refetches.
      queryClient.setQueryData<FavouriteItem[]>(queryKey.value, old => [
        ...(old ?? []),
        {
          id: `__opt_${propertyId}`,
          createdAt: new Date().toISOString(),
          property: { id: propertyId } as FavouriteItem['property'],
        },
      ])

      return { snapshot }
    },

    onSuccess: () => notify.success(t('favourites.saved')),

    onError: (err, propertyId, ctx) => {
      queryClient.setQueryData(queryKey.value, ctx?.snapshot)
      notify.error(extract(err))
    },

    onSettled: (_, __, propertyId) => {
      delete togglingIds.value[propertyId]
      // Refetch to replace the optimistic placeholder with the real record + property data
      queryClient.invalidateQueries({ queryKey: queryKey.value })
    },
  })

  // ── Remove mutation ───────────────────────────────────────────────────────

  const { mutate: removeItem } = useMutation({
    mutationFn: ({ favouriteId }: RemoveVars) => removeFavourite(api, favouriteId),

    onMutate: async ({ propertyId }) => {
      await queryClient.cancelQueries({ queryKey: queryKey.value })
      togglingIds.value[propertyId] = true

      const snapshot = queryClient.getQueryData<FavouriteItem[]>(queryKey.value)

      queryClient.setQueryData<FavouriteItem[]>(queryKey.value, old =>
        old?.filter(f => f.property.id !== propertyId) ?? [],
      )

      return { snapshot }
    },

    onSuccess: () => notify.info(t('favourites.removed')),

    onError: (err, { propertyId }, ctx) => {
      queryClient.setQueryData(queryKey.value, ctx?.snapshot)
      notify.error(extract(err))
    },

    onSettled: (_, __, { propertyId }) => {
      delete togglingIds.value[propertyId]
      queryClient.invalidateQueries({ queryKey: queryKey.value })
    },
  })

  // ── Public toggle ─────────────────────────────────────────────────────────

  const toggle = async (propertyId: string) => {
    if (!authStore.isAuthenticated) {
      await navigateTo('/auth/login')
      return
    }
    if (isToggling(propertyId)) return

    if (isFavourited(propertyId)) {
      const favouriteId = favouriteMap.value.get(propertyId)!
      removeItem({ propertyId, favouriteId })
    } else {
      saveItem(propertyId)
    }
  }

  // Exclude optimistic placeholders from the listing page
  const items = computed<FavouriteItem[]>(
    () => data.value?.filter(f => !f.id.startsWith('__opt_')) ?? [],
  )

  return {
    items,
    isFetched: isSuccess,
    isFavourited,
    isToggling,
    toggle,
  }
}
