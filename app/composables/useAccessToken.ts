export const useAccessToken = () => {
  const config = useRuntimeConfig()
  return useCookie<string | null>('access_token', {
    sameSite: 'lax',
    maxAge: config.public.accessTokenMaxAge as number,
  })
}
