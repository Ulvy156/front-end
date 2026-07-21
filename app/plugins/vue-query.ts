import { VueQueryPlugin, QueryClient, dehydrate, hydrate } from '@tanstack/vue-query'

const QUERY_CLIENT_KEY = 'VUE_QUERY_CLIENT'
const PAYLOAD_KEY = 'vueQueryState'

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

    // Snapshot resolved queries into the payload so the client starts with the
    // same cache instead of an empty one — without this, queries gated on
    // authStore.user (e.g. useFavourites) resolve during SSR but re-fire empty
    // on the client, flipping data-dependent markup (e.g. the favourite heart
    // icon) between server-rendered and hydrated HTML.
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload[PAYLOAD_KEY] = dehydrate(queryClient)
    })
  } else {
    // On client: use the full plugin (registers devtools etc.) and expose via nuxtApp.
    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
    nuxtApp.provide('queryClient', queryClient)

    const state = nuxtApp.payload[PAYLOAD_KEY]
    if (state) {
      hydrate(queryClient, state)
    }
  }
})
