export function useFullUrl() {
  const route = useRoute()

  function getFullUrl() {
    return window.location.origin + route.fullPath
  }

  return {
    getFullUrl
  }
}
