// The backend sets this as an HttpOnly cookie directly (login, refresh,
// OAuth callback, etc.) — the browser attaches it to requests automatically,
// so the frontend only ever reads it, never writes it. `readonly: true`
// isn't just documentation: it stops Nuxt's own useCookie from emitting a
// second, non-HttpOnly `Set-Cookie` for the same name, which would otherwise
// win in the browser and silently undo the HttpOnly protection.
export const useAccessToken = () => {
  const config = useRuntimeConfig()
  return useCookie<string | null>('access_token', {
    sameSite: 'lax',
    maxAge: config.public.accessTokenMaxAge as number,
    readonly: true,
  })
}

// In-memory-only carry-over for the *current* SSR request: when a page load
// needs a mid-request token refresh (see refreshAndHydrate in roleGuard.ts),
// the rotated access_token cookie only reaches the browser on its *next*
// request — but this request's own remaining API calls (favourites,
// property data, etc.) still need to authenticate *now*. This never touches
// document.cookie or emits a Set-Cookie, so it can't leak or fight with the
// real cookie above.
export const useFreshAccessToken = () => useState<string | null>('fresh-access-token', () => null)
