<template>
  <div class="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-6 py-12">
    <!-- dot-grid backdrop -->
    <div class="absolute inset-0 pointer-events-none opacity-35 dot-grid" />

    <!-- soft gradient blobs -->
    <div class="absolute -top-30 -left-25 w-90 h-90 rounded-full pointer-events-none blob-tl" />
    <div class="absolute -bottom-35 -right-30 w-105 h-105 rounded-full pointer-events-none blob-br" />
    <div class="absolute top-[20%] right-[6%] w-35 h-35 rounded-full pointer-events-none blob-mid" />

    <!-- floating decorative icons -->
    <div class="absolute top-[14%] left-[8%] float-med pointer-events-none" aria-hidden="true">
      <BaseIconClient name="house" :size="38" color="#10B981" />
    </div>
    <div class="absolute top-[66%] left-[12%] bounce-pin pointer-events-none" aria-hidden="true">
      <BaseIconClient name="map-pin" :size="30" color="#10B981" />
    </div>
    <div class="absolute top-[10%] right-[16%] bounce-pin-slow pointer-events-none" aria-hidden="true">
      <BaseIconClient name="map-pin" :size="24" color="#D1D5DB" />
    </div>
    <div class="absolute bottom-[16%] right-[10%] float-slow pointer-events-none" aria-hidden="true">
      <BaseIconClient name="house" :size="30" color="#9CA3AF" />
    </div>
    <div class="absolute top-[30%] left-[22%] drift pointer-events-none" aria-hidden="true">
      <BaseIconClient name="cloud" :size="44" color="#F3F4F6" />
    </div>
    <div class="absolute bottom-[28%] right-[24%] drift-slow pointer-events-none" aria-hidden="true">
      <BaseIconClient name="cloud" :size="36" color="#F3F4F6" />
    </div>

    <div class="relative max-w-xl w-full flex flex-col items-center text-center fade-up">
      <!-- illustration -->
      <div class="w-full max-w-70 mb-2 float-slow">
        <svg viewBox="0 0 320 260" class="w-full h-auto" role="img" :aria-label="title">
          <ellipse cx="160" cy="238" rx="86" ry="10" fill="#F3F4F6" />

          <!-- faded pin marking the missing listing -->
          <g transform="translate(117,30) scale(6.5)">
            <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8Z"
                  fill="#ECFDF5" stroke="#6EE7B7" stroke-width="0.46" stroke-dasharray="0.8 0.8" />
          </g>
          <g transform="translate(179,56) scale(1.3)">
            <path d="M3 11.5 12 4l9 7.5" fill="none" stroke="#6B7280" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.5 10v9a1 1 0 0 0 1 1H9v-5h6v5h2.5a1 1 0 0 0 1-1v-9" fill="none" stroke="#6B7280" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          </g>

          <!-- person searching -->
          <circle cx="70" cy="95" r="16" fill="#D1FAE5" stroke="#10B981" stroke-width="2" />
          <rect x="52" y="112" width="36" height="70" rx="18" fill="#10B981" />
          <rect x="56" y="178" width="12" height="50" rx="6" fill="#4B5563" />
          <rect x="76" y="178" width="12" height="50" rx="6" fill="#4B5563" />
          <path d="M86 130 Q115 110 132 92" fill="none" stroke="#10B981" stroke-width="10" stroke-linecap="round" />
          <circle cx="140" cy="80" r="14" fill="none" stroke="#6B7280" stroke-width="4" />
          <line x1="150" y1="90" x2="162" y2="102" stroke="#6B7280" stroke-width="5" stroke-linecap="round" />

          <!-- attention badge -->
          <circle cx="225" cy="45" r="15" fill="#FFFFFF" stroke="#10B981" stroke-width="2" />
          <text x="225" y="51" text-anchor="middle" font-size="16" font-weight="800" fill="#10B981">?</text>
        </svg>
      </div>

      <div class="text-[15px] font-bold tracking-[0.12em] text-emerald-500 mt-5">
        {{ t('errorPage.badge', { code: statusCode }) }}
      </div>

      <h1 class="text-gray-900 mt-3">{{ title }}</h1>

      <p class="text-[17px] leading-relaxed text-gray-500 mt-4 max-w-md">{{ description }}</p>

      <div class="flex flex-wrap gap-3.5 justify-center mt-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition-all"
          @click.prevent="handleGoHome"
        >
          {{ t('errorPage.goHome') }}
        </NuxtLink>
        <NuxtLink
          to="/properties"
          class="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 hover:-translate-y-0.5 text-emerald-500 font-semibold text-base px-7 py-3.5 rounded-2xl border-[1.5px] border-emerald-500 transition-all"
          @click.prevent="handleBrowse"
        >
          {{ t('errorPage.browseProperties') }}
        </NuxtLink>
      </div>

      <div class="w-full max-w-md mt-11">
        <div class="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-4.5 py-3.5 shadow-[0_2px_8px_rgba(17,24,39,0.04)]">
          <BaseIconClient name="search" :size="18" color="#9CA3AF" class="shrink-0" />
          <input
            v-model="searchValue"
            type="text"
            :placeholder="t('errorPage.searchPlaceholder')"
            class="border-none bg-transparent outline-none text-[15px] text-gray-900 w-full placeholder:text-gray-400"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2.5 justify-center mt-5">
        <NuxtLink
          v-for="link in popularLinks"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-600 px-4.5 py-2.5 rounded-full border border-gray-200 transition-colors"
          @click.prevent="handleBrowse"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()

const statusCode = computed(() => props.error?.statusCode ?? 404)
const isNotFound = computed(() => statusCode.value === 404)

const title = computed(() =>
  isNotFound.value ? t('errorPage.title') : t('errorPage.titleGeneric')
)
const description = computed(() =>
  isNotFound.value ? t('errorPage.description') : t('errorPage.descriptionGeneric')
)

useSeoMeta({
  title,
  robots: 'noindex',
})

const searchValue = ref('')

const popularLinks = computed(() => [
  { label: t('errorPage.popular.apartments'), href: '/properties' },
  { label: t('errorPage.popular.houses'), href: '/properties' },
  { label: t('errorPage.popular.rooms'), href: '/properties' },
  { label: t('errorPage.popular.condos'), href: '/properties' },
])

const handleGoHome = () => clearError({ redirect: '/' })
const handleBrowse = () => clearError({ redirect: '/properties' })
const handleSearch = () => clearError({ redirect: '/properties' })
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

.blob-mid {
  background: radial-gradient(circle, rgba(156, 163, 175, 0.18), rgba(156, 163, 175, 0) 70%);
}

@keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes float-med { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes bounce-pin { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes drift { 0% { transform: translateX(0); } 50% { transform: translateX(12px); } 100% { transform: translateX(0); } }

.float-slow { animation: float-slow 6s ease-in-out infinite; }
.float-med { animation: float-med 5s ease-in-out infinite; }
.bounce-pin { animation: bounce-pin 3s ease-in-out infinite; }
.bounce-pin-slow { animation: bounce-pin 3.6s ease-in-out infinite 0.4s; }
.fade-up { animation: fade-up 0.7s ease-out both; }
.drift { animation: drift 8s ease-in-out infinite; }
.drift-slow { animation: drift 10s ease-in-out infinite 1s; }

@media (prefers-reduced-motion: reduce) {
  .float-slow, .float-med, .bounce-pin, .bounce-pin-slow, .fade-up, .drift, .drift-slow {
    animation: none;
  }
}
</style>
