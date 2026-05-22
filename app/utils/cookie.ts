export interface CookieOptions {
  /** Lifetime in seconds. 0 deletes the cookie immediately. */
  maxAge?: number
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'Lax',
}

/** Read a cookie value by name. Returns undefined if not found or on SSR. */
export function getCookie(name: string): string | undefined {
  if (import.meta.server) return undefined
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

/** Write a cookie. Creates it if it doesn't exist, overwrites if it does. */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (import.meta.server) return
  const opts = { ...DEFAULT_OPTIONS, ...options }

  let entry = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  if (opts.maxAge !== undefined) entry += `; max-age=${opts.maxAge}`
  if (opts.expires)              entry += `; expires=${opts.expires.toUTCString()}`
  if (opts.path)                 entry += `; path=${opts.path}`
  if (opts.domain)               entry += `; domain=${opts.domain}`
  if (opts.secure)               entry += `; secure`
  if (opts.sameSite)             entry += `; samesite=${opts.sameSite}`

  document.cookie = entry
}

/** Remove a cookie. Preserves path/domain so the browser actually clears it. */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {},
): void {
  setCookie(name, '', { ...options, maxAge: 0 })
}

/** Check whether a cookie exists. */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== undefined
}
