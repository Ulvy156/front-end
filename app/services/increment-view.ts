import type { AxiosInstance } from 'axios'
import type { Ref } from 'vue'

export async function incrementView(
  api: AxiosInstance,
  viewed: Ref<string[]>,
  id: string,
) {
  if (!import.meta.client || !id) return
  if (viewed.value.includes(id)) return

  await api.patch(`/property/increment-view/${id}`)

  viewed.value = [...viewed.value, id]
}
