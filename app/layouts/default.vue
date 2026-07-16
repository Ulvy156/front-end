<template>
  <AppNavbar/>

  <main :class="overlay">
    <slot></slot>
  </main>

  <footerApp/>

  <ClientOnly>
    <FeedbackDialog v-if="authStore.isAuthenticated" />
  </ClientOnly>
</template>


<script setup lang="ts">
import AppNavbar from '~/components/navbar/AppNavbar.vue'
import FeedbackDialog from '~/features/feedback/components/feedback-dialog.vue'

// Footer is always below the fold: defer hydration until it scrolls into view
const footerApp = defineLazyHydrationComponent('visible', () => import('~/components/footer/footer-app.vue'))
const route = useRoute()
const authStore = useAuthStore()

const overlay = computed(() => {
  if(route.meta.headerOverlay === true) {
    return 'w-full';
  }
  return 'w-[92%] m-auto ';
})

const { locale, setLocale } = useI18n()
useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
}))

onMounted(() => {
  const saved = localStorage.getItem('lang')
  if (saved === 'en' || saved === 'km') {
    setLocale(saved)
  }
})
</script>