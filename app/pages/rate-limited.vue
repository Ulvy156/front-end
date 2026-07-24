<template>
  <div class="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-6 py-12">
    <div class="absolute inset-0 pointer-events-none opacity-35 dot-grid" />
    <div class="absolute -top-30 -left-25 w-90 h-90 rounded-full pointer-events-none blob-tl" />
    <div class="absolute -bottom-35 -right-30 w-105 h-105 rounded-full pointer-events-none blob-br" />

    <div class="relative max-w-xl w-full flex flex-col items-center text-center">
      <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
        <BaseIconClient name="clock" :size="26" color="#10B981" />
      </div>

      <div class="text-[15px] font-bold tracking-[0.12em] text-emerald-500">
        {{ t('rateLimit.badge') }}
      </div>

      <h1 class="text-gray-900 mt-3">{{ t('rateLimit.title') }}</h1>

      <p class="text-[17px] leading-relaxed text-gray-500 mt-4 max-w-md">
        {{ hasCountdown ? t('rateLimit.withCountdown', { time: countdown.mmss.value }) : t('rateLimit.generic') }}
      </p>

      <button
        type="button"
        :disabled="hasCountdown && countdown.isActive.value"
        @click="tryAgain"
        class="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white
               hover:bg-emerald-700 active:scale-[0.99] transition-all duration-150 cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
        {{ t('rateLimit.tryAgain') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useRateLimitStore } from '~/stores/rateLimit'
import { useCountdown } from '~/composables/useCountdown'

definePageMeta({ layout: false })

const { t } = useI18n()
const rateLimitStore = useRateLimitStore()
rateLimitStore.restore()

const countdown = useCountdown()
const hasCountdown = computed(() => rateLimitStore.retryUntil !== null)

onMounted(() => {
  if (rateLimitStore.retryUntil) {
    const seconds = Math.max(0, Math.round((rateLimitStore.retryUntil - Date.now()) / 1000))
    countdown.start(seconds)
  }
})

const tryAgain = () => {
  const target = rateLimitStore.returnTo || '/'
  rateLimitStore.clear()
  navigateTo(target)
}

useSeoMeta({
  title: t('rateLimit.title'),
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
