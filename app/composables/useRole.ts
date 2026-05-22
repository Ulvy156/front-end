import { Role } from '~/types/role'

/**
 * Strict role helpers for template conditionals.
 *
 * Use these when you need to render different UI per role
 * (e.g. show a landlord dashboard vs a tenant dashboard).
 *
 * For access-level checks (show/hide a single element), prefer v-can.
 *
 * isUser / isLandlord / isAdmin are strict — they do NOT include ADMIN
 * as a superset. If you need "landlord OR admin", use v-can="'landlord'".
 */
export function useRole() {
  const authStore = useAuthStore()
  const role = computed(() => authStore.user?.role as Role | undefined)

  return {
    role,
    isAuth:     computed(() => !!role.value),
    isUser:     computed(() => role.value === Role.USER),
    isLandlord: computed(() => role.value === Role.LANDLORD),
    isAdmin:    computed(() => role.value === Role.ADMIN),
  }
}
