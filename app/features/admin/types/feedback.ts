export type FeedbackType = 'BUG' | 'SUGGESTION' | 'OTHER'

export interface FeedbackItem {
  id: string
  type: FeedbackType
  description: string
  createdAt: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
}
