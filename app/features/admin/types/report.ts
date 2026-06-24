export interface AdminReport {
  id: number
  description: string
  createdAt: string
  reportType: {
    id: number
    nameEn: string
    nameKh: string
    icon: string
  }
  user: {
    id: string
    name: string
    email: string
  }
  property: {
    id: string
    title: string
    userId: string
  }
}

export interface AdminReportsResponse {
  items: AdminReport[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminReportsFilter {
  page: number
  limit: number
  propertyId?: string
  reportTypeId?: number
}
