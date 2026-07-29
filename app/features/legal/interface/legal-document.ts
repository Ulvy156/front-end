export type LegalSlug = 'privacy-policy' | 'terms-of-service'

export interface LegalDocument {
  id: number
  slug: string
  contentEn: string
  contentKh: string
  updatedAt: string
}
