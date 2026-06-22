import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export function useAdminCrud<T extends { id: number }>(endpoint: string) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()
  const queryKey = `admin-${endpoint}`

  const { data, isPending } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await $axios.get<T[]>(`/admin/${endpoint}`)
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] })

  const create = useMutation({
    mutationFn: (payload: Omit<T, 'id'>) => $axios.post(`/admin/${endpoint}`, payload),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<T> & { id: number }) =>
      $axios.patch(`/admin/${endpoint}/${id}`, payload),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: number) => $axios.delete(`/admin/${endpoint}/${id}`),
    onSuccess: invalidate,
  })

  return { data, isPending, create, update, remove }
}
