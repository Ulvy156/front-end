export type LegalSlug = 'privacy-policy' | 'terms-of-service'

export interface LegalDocument {
  id: number
  slug: string
  content: string
  updatedAt: string
}
