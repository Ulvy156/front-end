import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UserProfile } from '../types/profile'

const PROFILE_KEY = ['profile']

export function useProfile() {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  const { data: profile, isPending, isError } = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const { data } = await $axios.get<UserProfile>('/user/me')
      return data
    },
  })

  const updateName = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await $axios.patch<UserProfile>('/user/me', { name })
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data)
      authStore.setUser({ ...authStore.user!, name: data.name })
    },
  })

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('profile', file)
      const { data } = await $axios.patch<UserProfile>('/user/me/profile-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data)
      authStore.setUser({ ...authStore.user!, imgUrl: data.imgUrl })
    },
  })

  const deleteAvatar = useMutation({
    mutationFn: async () => {
      await $axios.delete('/user/me/profile-image')
    },
    onSuccess: () => {
      queryClient.setQueryData(PROFILE_KEY, (old: UserProfile | undefined) =>
        old ? { ...old, imgUrl: null } : old,
      )
      authStore.setUser({ ...authStore.user!, imgUrl: null })
    },
  })

  const changePassword = useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      await $axios.patch('/auth/change-password', payload)
    },
  })

  return { profile, isPending, isError, updateName, uploadAvatar, deleteAvatar, changePassword }
}
