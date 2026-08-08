import { useBreakpoints, breakpointsTailwind, useMounted } from '@vueuse/core'

/**
 * Tailwind-scale breakpoint refs for JS-driven unmounting of responsive
 * variants gated today purely by `hidden lg:block` / `lg:hidden` / `hidden md:flex`.
 *
 * `isMounted` is false during SSR and the client's first (hydration) render,
 * so `!isMounted || isXxxUp` always evaluates true until the component has
 * actually mounted — matching the old CSS-only markup exactly and avoiding
 * any hydration mismatch. Only after `isMounted` flips true does the real
 * `isLgUp`/`isMdUp` value take over and let Vue unmount the non-matching branch.
 *
 * Always combine with isMounted — never use isLgUp/isMdUp alone in a v-if.
 */
export function useAppBreakpoints() {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  return {
    isMounted: useMounted(),
    isMdUp: breakpoints.greaterOrEqual('md'),
    isLgUp: breakpoints.greaterOrEqual('lg'),
  }
}
