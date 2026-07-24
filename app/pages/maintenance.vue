<template>
  <div class="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-6 py-12">
    <div class="absolute inset-0 pointer-events-none opacity-35 dot-grid" />
    <div class="absolute -top-30 -left-25 w-90 h-90 rounded-full pointer-events-none blob-tl" />
    <div class="absolute -bottom-35 -right-30 w-105 h-105 rounded-full pointer-events-none blob-br" />

    <div class="relative max-w-xl w-full flex flex-col items-center text-center">
      <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
        <BaseIconClient name="wrench" :size="26" color="#10B981" />
      </div>

      <div class="text-[15px] font-bold tracking-[0.12em] text-emerald-500">
        {{ t('maintenance.badge') }}
      </div>

      <h1 class="text-gray-900 mt-3">{{ t('maintenance.title') }}</h1>

      <p class="text-[17px] leading-relaxed text-gray-500 mt-4 max-w-md">
        {{ appSettingsStore.maintenanceMessage ?? t('maintenance.description') }}
      </p>

      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition-all mt-8"
      >
        {{ t('maintenance.signIn') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useAppSettingsStore } from '~/stores/appSettings'

definePageMeta({ layout: false })

const { t } = useI18n()
const appSettingsStore = useAppSettingsStore()

useSeoMeta({
  title: t('maintenance.title'),
  robots: 'noindex',
})
</script>

<style scoped>
.dot-grid {
  background-image: radial-gradient(#E5E7EB 1px, transparent 1px);
  background-size: 28px 28px;
}
.blob-tl {
  background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.16), rgba(16, 185, 129, 0) 70%);
}
.blob-br {
  background: radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.14), rgba(16, 185, 129, 0) 70%);
}
</style>
