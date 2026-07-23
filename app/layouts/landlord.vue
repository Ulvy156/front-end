<template>
  <div class="flex min-h-screen">

    <!-- ── Sidebar ── -->
    <aside class="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-30">

      <!-- Logo -->
      <div class="h-16 flex items-center gap-2 px-5 border-b border-gray-200 shrink-0">
        <NuxtImg src="/rokpteah-logo.webp" class="h-9" alt="Rokpteah logo" />
        <span class="font-semibold text-gray-900 text-sm leading-tight">
          {{ $t('landlord.nav.title') }}
        </span>
      </div>

      <!-- Scrollable nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

        <!-- OVERVIEW -->
        <p class="sidebar-section-label">{{ $t('landlord.nav.overview') }}</p>
        <BaseSidebarNavItem to="/landlord" icon="layout-dashboard" :label="$t('landlord.nav.dashboard')" :exact="true" />

        <!-- PROPERTIES -->
        <p class="sidebar-section-label">{{ $t('landlord.nav.properties') }}</p>
        <BaseSidebarNavItem to="/landlord/properties" icon="building" :label="$t('landlord.nav.myProperties')" />
        <BaseSidebarNavItem to="/landlord/post-property" icon="circle-plus" :label="$t('landlord.nav.postProperty')" />

      </nav>

      <!-- Bottom: Settings + Logout -->
      <div class="border-t border-gray-200 p-3 space-y-0.5 shrink-0">
        <BaseSidebarNavItem to="/landlord/settings" icon="settings" :label="$t('landlord.nav.settings')" />
        <button
          class="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          @click="logout"
        >
          <BaseIcon name="log-out" :size="16" class="shrink-0" />
          <span>{{ $t('landlord.nav.logout') }}</span>
        </button>
      </div>

    </aside>

    <!-- ── Main area ── -->
    <div class="ml-60 flex-1 flex flex-col min-h-screen">

      <!-- Topbar -->
      <header class="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h1 class="text-base font-semibold text-gray-900">{{ pageTitle }}</h1>

        <div class="flex items-center gap-3">

        <!-- Language switcher -->
        <el-dropdown trigger="click" @command="switchLang">
          <button class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 hover:border-slate-300 transition cursor-pointer">
            <span>{{ locale === 'en' ? '🇬🇧' : '🇰🇭' }}</span>
            <span class="text-xs font-medium">{{ locale === 'en' ? 'EN' : 'KM' }}</span>
            <BaseIcon name="chevron-down" :size="12" class="text-slate-400" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="en">🇬🇧 English</el-dropdown-item>
              <el-dropdown-item command="km">🇰🇭 ខ្មែរ</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- User dropdown -->
        <el-dropdown trigger="click" @command="handleCommand">
          <button
            class="flex items-center gap-x-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div
              class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--nav-active-item)] text-xs font-bold shrink-0"
            >
              {{ userInitials }}
            </div>
            <span class="max-w-32 truncate">{{ authStore.user?.name }}</span>
            <BaseIcon name="chevron-down" :size="14" class="text-slate-400" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout" class="text-red-500!">
                <ClientOnly>
                  <BaseIcon name="log-out" :size="14" class="mr-2" />
                </ClientOnly>
                {{ $t('landlord.nav.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSidebarNavItem from '~/components/ui/BaseSidebarNavItem.vue'
import { initials } from '~/utils/initials'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { t, locale, setLocale } = useI18n()

const userInitials = computed(() => initials(authStore.user?.name ?? ''))

function switchLang(lang: string) {
  localStorage.setItem('lang', lang)
  setLocale(lang)
}

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/landlord')                    return t('landlord.nav.dashboard')
  if (path.startsWith('/landlord/properties')) return t('landlord.nav.myProperties')
  if (path.startsWith('/landlord/post-property')) return t('landlord.nav.postProperty')
  if (path.startsWith('/landlord/settings'))      return t('landlord.nav.settings')
  return t('landlord.nav.title')
})

const handleCommand = async (cmd: string) => {
  if (cmd === 'logout') await logout()
}
</script>

<style scoped>
.sidebar-section-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 0.75rem 0.25rem;
}
</style>
