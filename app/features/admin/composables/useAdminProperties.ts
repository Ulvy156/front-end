import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AdminProperty } from '../types/property'

const QUERY_KEY = 'admin-properties'

export function useAdminProperties() {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data } = await $axios.get<AdminProperty[]>('/property')
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })

  const togglePublish = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/toggle-publish/${id}`),
    onSuccess: invalidate,
  })

  const toggleAvailability = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/toggle-availability/${id}`),
    onSuccess: invalidate,
  })

  const setFeatured = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/set-feature/${id}`),
    onSuccess: invalidate,
  })

  const deleteProperty = useMutation({
    mutationFn: (id: string) => $axios.delete(`/property/${id}`),
    onSuccess: invalidate,
  })

  return { data, isPending, isError, togglePublish, toggleAvailability, setFeatured, deleteProperty }
}
