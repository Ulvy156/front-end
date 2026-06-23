export function usePropertyReport() {
  const { $axios } = useNuxtApp()

  const report = (propertyId: string, description: string) =>
    $axios.post(`/property-report/${propertyId}`, { description })

  return { report }
}
