import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,       // 1 min (frontend cache)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  });
});
