import { useRoute } from 'vue-router'

export const useActiveRoute = () => {
  const route = useRoute()

  const isActive = (path: string) => {
    return route.path === path
  }

  const startsWith = (path: string) => {
    return route.path.startsWith(path)
  }

  return {
    isActive,
    startsWith,
  }
}
