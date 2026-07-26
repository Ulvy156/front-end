import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Role } from '~/types/role'
import type { UserListResponse, CreateUserPayload, UpdateUserPayload, AdminUser } from '../types/user'

export interface UserFilters {
  search: string
  page: number
  limit: number
}

function useAdminUserList(role: Role.USER | Role.LANDLORD, filters: Ref<UserFilters>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()
  const listKey = role === Role.USER ? 'admin-users' : 'admin-landlords'

  const queryKey = computed(() => [listKey, filters.value.search, filters.value.page])

  const { data, isPending, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, string | number> = {
        role,
        page: filters.value.page,
        limit: filters.value.limit,
      }
      if (filters.value.search) params.search = filters.value.search
      const { data } = await $axios.get<UserListResponse>('/user', { params })
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [listKey] })

  const createUser = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const form = new FormData()
      form.append('name', payload.name)
      form.append('email', payload.email)
      form.append('password', payload.password)
      form.append('role', payload.role)
      const { data } = await $axios.post('/user', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: invalidate,
  })

  const updateUser = useMutation({
    mutationFn: async ({ id, name, role }: UpdateUserPayload) => {
      const { data } = await $axios.patch(`/user/${id}`, { name, role })
      return data
    },
    onSuccess: invalidate,
  })

  const lockUser = useMutation({
    mutationFn: (id: string) => $axios.patch(`/user/lock-user/${id}`),
    onSuccess: invalidate,
  })

  const unlockUser = useMutation({
    mutationFn: (id: string) => $axios.patch(`/user/unlock-user/${id}`),
    onSuccess: invalidate,
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) => $axios.delete(`/user/${id}`),
    onSuccess: invalidate,
  })

  return { data, isPending, isError, createUser, updateUser, lockUser, unlockUser, deleteUser }
}

export function useAdminUsers(filters: Ref<UserFilters>) {
  return useAdminUserList(Role.USER, filters)
}

export function useAdminLandlords(filters: Ref<UserFilters>) {
  const base = useAdminUserList(Role.LANDLORD, filters)
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const grantBadge = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $axios.patch<AdminUser>(`/user/grant-badge/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-landlords'] }),
  })

  const revokeBadge = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $axios.patch<AdminUser>(`/user/revoke-badge/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-landlords'] }),
  })

  return { ...base, grantBadge, revokeBadge }
}
