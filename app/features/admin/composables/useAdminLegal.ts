import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AdminLegalDocument, LegalSlug, UpdateLegalDocumentPayload } from '../types/legal'

export function useAdminLegal(slug: Ref<LegalSlug>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['admin-legal', slug.value]),
    queryFn: async () => {
      const { data } = await $axios.get<AdminLegalDocument>(`/legal/${slug.value}`)
      return data
    },
  })

  const updateLegal = useMutation({
    mutationFn: async (payload: UpdateLegalDocumentPayload) => {
      const { data } = await $axios.patch<AdminLegalDocument>(`/admin/legal/${slug.value}`, payload)
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-legal', slug.value], updated)
    },
  })

  return { data, isPending, isError, updateLegal }
}
