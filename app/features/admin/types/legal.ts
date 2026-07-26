export type LegalSlug = 'privacy-policy' | 'terms-of-service'

export interface AdminLegalDocument {
  id: number
  slug: string
  contentEn: string
  contentKh: string
  updatedAt: string
}

export interface UpdateLegalDocumentPayload {
  contentEn: string
  contentKh: string
}
