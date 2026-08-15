import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listDrafts, deleteDraft, publishDraft } from '../services/property-draft'

const QUERY_KEY = 'property-drafts'

export function useLandlordDrafts() {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => listDrafts($axios),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
  const invalidateLandlordProperties = () => {
    queryClient.invalidateQueries({ queryKey: ['landlord-properties'] })
    queryClient.invalidateQueries({ queryKey: ['landlord-dashboard'] })
  }

  const deleteDraftMutation = useMutation({
    mutationFn: (id: string) => deleteDraft($axios, id),
    onSuccess: () => invalidate(),
  })

  const publishDraftMutation = useMutation({
    mutationFn: (id: string) => publishDraft($axios, id),
    onSuccess: () => {
      invalidate()
      invalidateLandlordProperties()
    },
  })

  return { data, isPending, isError, deleteDraftMutation, publishDraftMutation }
}
