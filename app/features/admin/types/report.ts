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

export interface AdminReportDetail {
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
    imgUrl: string | null
  }
  property: {
    id: string
    title: string
    address: string
    monthly_price: number
    isPublished: boolean
    isAvailable: boolean
    userId: string
    user: {
      id: string
      name: string
      email: string
    }
    images: { imageKey: string }[]
    district: {
      nameEn: string
      nameKh: string
      province: { nameEn: string; nameKh: string }
    }
    propertyType: {
      nameEn: string
      nameKh: string
      icon: string
    }
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
