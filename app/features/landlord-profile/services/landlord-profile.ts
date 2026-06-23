import type { AxiosInstance } from 'axios'

import type { LandlordProfileResponse } from '../interface/landlord-profile'

export async function fetchPublicLandlordProfile(
  api: AxiosInstance,
  id: string,
  params: { page: number; limit: number },
) {
  const res = await api.get<LandlordProfileResponse>(
    `/landlord/profile/${id}`,
    { params },
  )

  return res.data
}
