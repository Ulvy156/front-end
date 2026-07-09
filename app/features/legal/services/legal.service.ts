import type { AxiosInstance } from 'axios'
import type { LegalDocument, LegalSlug } from '../interface/legal-document'

export const fetchLegalDocument = async (
  api: AxiosInstance,
  slug: LegalSlug,
): Promise<LegalDocument> => {
  const { data } = await api.get<LegalDocument>(`/legal/${slug}`)
  return data
}
