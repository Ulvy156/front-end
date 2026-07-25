<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-9999 flex items-center justify-center bg-white px-6"
  >
    <div class="max-w-md w-full flex flex-col items-center text-center">
      <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
        <BaseIconClient name="wrench" :size="26" color="#10B981" />
      </div>

      <div class="text-[15px] font-bold tracking-[0.12em] text-emerald-500">
        {{ t('maintenance.badge') }}
      </div>

      <h1 class="text-gray-900 mt-3 text-2xl font-bold">{{ t('maintenance.title') }}</h1>

      <p class="text-[17px] leading-relaxed text-gray-500 mt-4">
        {{ appSettingsStore.maintenanceMessage ?? t('maintenance.description') }}
      </p>

      <p class="text-sm text-gray-400 mt-6 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {{ t('maintenance.checking') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useAppSettingsStore } from '~/stores/appSettings'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const appSettingsStore = useAppSettingsStore()

// Admins are exempt everywhere. /auth/login stays reachable so an admin can
// always sign back in even if their session lapsed during maintenance, and
// /maintenance (the SSR-safe redirect target in session.global.ts) already
// shows this same message, so skip the overlay there to avoid doubling it up.
const exemptPaths = ['/auth/login', '/maintenance']
const visible = computed(() =>
  appSettingsStore.maintenanceMode
  && !authStore.isAdmin
  && !exemptPaths.includes(route.path),
)

watch(visible, (isVisible) => {
  document.documentElement.classList.toggle('overflow-hidden', isVisible)
}, { immediate: true })
</script>
