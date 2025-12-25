export const useAppEnv = () => {
  const config = useRuntimeConfig()

  return {
    API_URL: config.public.API_URL,
    APP_NAME: config.public.APP_NAME
  }
}
