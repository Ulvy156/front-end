/**
 * Single source of truth for user roles.
 * Import Role everywhere instead of using raw strings.
 */
export enum Role {
  USER = 'USER',
  LANDLORD = 'LANDLORD',
  ADMIN = 'ADMIN',
}

/**
 * Permission tokens accepted by v-can.
 *
 * 'auth'     → any authenticated user (all three roles)
 * 'user'     → USER features  (USER + ADMIN)
 * 'landlord' → LANDLORD features (LANDLORD + ADMIN)
 * 'admin'    → ADMIN only
 *
 * ADMIN bypasses every permission check except 'admin' — ADMIN sees all UI.
 */
export type CanPermission = 'auth' | 'user' | 'landlord' | 'admin'
