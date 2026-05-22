import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const QUERY_CLIENT_KEY = 'VUE_QUERY_CLIENT'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  if (import.meta.server) {
    // On SSR: provide the client directly so useQueryClient() / useQuery() / useMutation()
    // work in component setup — but skip VueQueryPlugin which writes a class instance to
    // app.config.globalProperties and triggers Nuxt's devalue serialisation warning.
    nuxtApp.vueApp.provide(QUERY_CLIENT_KEY, queryClient)
  } else {
    // On client: use the full plugin (registers devtools etc.) and expose via nuxtApp.
    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
    nuxtApp.provide('queryClient', queryClient)
  }
})
