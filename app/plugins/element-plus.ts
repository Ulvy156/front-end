import { ID_INJECTION_KEY } from 'element-plus'

// Element Plus's useId() defaults to a random prefix generated once per
// module load (see element-plus/es/hooks/use-id). Server and client each
// pick a different random value, so every el-select/el-tooltip/el-dropdown/
// el-date-picker/el-form instance renders a mismatched id between SSR HTML
// and client hydration. A fixed prefix keeps both sides in sync.
//
// Guard against double-provide: Vite dev HMR can re-run this plugin against
// an app instance that already has the key provided, and Vue warns loudly
// ("App already provides property with key...") even though overwriting
// with the same fixed value is harmless.
export default defineNuxtPlugin((nuxtApp) => {
  const provides = (nuxtApp.vueApp._context as { provides: Record<PropertyKey, unknown> }).provides
  if (Object.prototype.hasOwnProperty.call(provides, ID_INJECTION_KEY)) return

  nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
    prefix: 1024,
    current: 0,
  })
})
