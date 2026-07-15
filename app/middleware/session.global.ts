import { hydrateAuth } from '~/utils/roleGuard'

export default defineNuxtRouteMiddleware(async () => {
  await hydrateAuth()
})
