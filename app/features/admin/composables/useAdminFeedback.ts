import { useQuery } from '@tanstack/vue-query'
import type { FeedbackItem } from '../types/feedback'

export function useAdminFeedback() {
  const { $axios } = useNuxtApp()

  const { data, isPending } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data } = await $axios.get<FeedbackItem[]>('/admin/feedback')
      return data
    },
  })

  return { data, isPending }
}
