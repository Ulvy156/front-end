export function usePropertyReport() {
  const { $axios } = useNuxtApp()

  const report = (propertyId: string, payload: { reportTypeId: number; description: string }) =>
    $axios.post(`/property-report/${propertyId}`, payload)

  const fetchReportTypes = async () => {
    const { data } = await $axios.get<ReportType[]>('/report-type')
    return data
  }

  return { report, fetchReportTypes }
}

export interface ReportType {
  id: number
  code: string
  nameEn: string
  nameKh: string
  icon: string
}
