<template>
  <div
    v-if="authStore.isAdmin && appSettingsStore.maintenanceMode"
    class="flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800"
  >
    <BaseIconClient name="alert-triangle" :size="15" class="shrink-0" />
    {{ t('maintenance.adminNotice') }}
  </div>

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
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useAppSettingsStore } from '~/stores/appSettings'

// Footer is always below the fold: defer hydration until it scrolls into view
const footerApp = defineLazyHydrationComponent('visible', () => import('~/components/footer/footer-app.vue'))

// Pulls in el-dialog/el-form/el-input plus useForm/useNotify CSS. It's only
// ever needed after the floating action button is clicked, so defer it off
// the critical rendering path instead of shipping it on every page load.
const FeedbackDialog = defineLazyHydrationComponent('idle', () => import('~/features/feedback/components/feedback-dialog.vue'))
const route = useRoute()
const authStore = useAuthStore()
const appSettingsStore = useAppSettingsStore()

const overlay = computed(() => {
  if(route.meta.headerOverlay === true) {
    return 'w-full';
  }
  return 'w-[92%] m-auto ';
})

const { t, locale, setLocale } = useI18n()
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