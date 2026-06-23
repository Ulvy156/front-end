interface SubmitFeedbackPayload {
  type: 'BUG' | 'SUGGESTION' | 'OTHER'
  description: string
}

export function useFeedback() {
  const { $axios } = useNuxtApp()

  const submit = (payload: SubmitFeedbackPayload) => $axios.post('/feedback', payload)

  return { submit }
}
