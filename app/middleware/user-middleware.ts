export default defineNuxtRouteMiddleware(() => {
    return true;
//   const auth = useAuthStore()

//   // not logged in
//   if (!auth.token) {
//     return navigateTo('/login')
//   }

//   // must be normal user
//   if (auth.user?.role !== 'user') {
//     return navigateTo('/')
//   }
})
