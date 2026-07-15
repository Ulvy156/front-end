// The refresh token itself is an httpOnly cookie set by the backend and is
// invisible to JS. This marker cookie is set alongside a successful login so
// route middleware and the axios interceptor can tell "session expired" apart
// from "never logged in" without calling /auth/refresh-token to find out.
export const useHasSession = () => {
  const config = useRuntimeConfig()
  return useCookie<boolean | null>('has_session', {
    sameSite: 'lax',
    maxAge: config.public.refreshTokenMaxAge as number,
  })
}
