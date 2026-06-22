import { useMutation } from '@tanstack/vue-query'

interface SubmitFeedbackPayload {
  type: 'BUG' | 'SUGGESTION' | 'OTHER'
  description: string
}

export function useFeedback() {
  const { $axios } = useNuxtApp()

  const submit = useMutation({
    mutationFn: (payload: SubmitFeedbackPayload) => $axios.post('/feedback', payload),
  })

  return { submit }
}
