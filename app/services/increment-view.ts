import { useApi } from "#imports";
import { useCookie } from "#app";

export async function incrementView(id: string) {
  if (!import.meta.client) return;
  if (!id) return;

  const api = useApi();

  const viewed = useCookie<string[]>("viewed_properties", {
    maxAge: 60 * 60 * 6, // 6 hours
    default: () => [],
  });

  if (viewed.value.includes(id)) return;

  await api.patch(`/property/increment-view/${id}`);

  viewed.value = [...viewed.value, id];
}
