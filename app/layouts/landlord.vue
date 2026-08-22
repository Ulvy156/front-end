<template>
  <div class="flex min-h-screen">

    <!-- ── Mobile overlay backdrop ── -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-20 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- ── Sidebar ── -->
    <aside
      class="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-30 transition-transform duration-200 md:translate-x-0"
      :class="[sidebarOpen ? 'translate-x-0' : '-translate-x-full', collapsed ? 'md:w-18' : 'md:w-60', 'w-60']"
    >

      <!-- Collapse toggle (desktop only) -->
      <button
        class="hidden md:flex absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors cursor-pointer"
        :aria-label="collapsed ? $t('landlord.nav.expand') : $t('landlord.nav.collapse')"
        @click="collapsed = !collapsed"
      >
        <BaseIcon name="chevron-left" :size="14" class="transition-transform duration-200" :class="collapsed ? 'rotate-180' : ''" />
      </button>

      <!-- Logo -->
      <div
        class="h-16 flex items-center gap-2 border-b border-gray-200 shrink-0 overflow-hidden transition-all duration-200"
        :class="effectiveCollapsed ? 'md:justify-center md:px-0 px-5' : 'px-5'"
      >
        <NuxtImg src="/sabayrent-logo.webp" class="h-9 shrink-0" alt="RokPteah logo" width="36" height="36" />
        <span
          class="font-semibold text-gray-900 text-sm leading-tight whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
          :class="effectiveCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'"
        >
          {{ $t('landlord.nav.title') }}
        </span>
      </div>

      <!-- Scrollable nav -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-0.5">

        <!-- OVERVIEW -->
        <p class="sidebar-section-label" :class="effectiveCollapsed ? 'sidebar-section-label--collapsed' : ''">{{ $t('landlord.nav.overview') }}</p>
        <BaseSidebarNavItem to="/landlord" icon="layout-dashboard" :label="$t('landlord.nav.dashboard')" :exact="true" :collapsed="effectiveCollapsed" />

        <!-- PROPERTIES -->
        <p class="sidebar-section-label" :class="effectiveCollapsed ? 'sidebar-section-label--collapsed' : ''">{{ $t('landlord.nav.properties') }}</p>
        <BaseSidebarNavItem to="/landlord/properties" icon="building" :label="$t('landlord.nav.myProperties')" :collapsed="effectiveCollapsed" />
        <BaseSidebarNavItem to="/landlord/post-property" icon="circle-plus" :label="$t('landlord.nav.postProperty')" :collapsed="effectiveCollapsed" />
        <BaseSidebarNavItem to="/landlord/drafts" icon="file-text" :label="$t('landlord.nav.drafts')" :collapsed="effectiveCollapsed" />

      </nav>

      <!-- Bottom: Settings + Logout -->
      <div class="border-t border-gray-200 p-3 space-y-0.5 shrink-0">
        <BaseSidebarNavItem to="/landlord/settings" icon="settings" :label="$t('landlord.nav.settings')" :collapsed="effectiveCollapsed" />
        <BaseTooltip :content="$t('landlord.nav.logout')" placement="right" :disabled="!effectiveCollapsed">
          <button
            class="relative flex w-full items-center px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 overflow-hidden transition-colors duration-200 cursor-pointer"
            :class="effectiveCollapsed ? 'justify-center' : 'gap-3'"
            @click="logout"
          >
            <BaseIcon name="log-out" :size="16" class="shrink-0" />
            <span
              class="whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
              :class="effectiveCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'"
            >{{ $t('landlord.nav.logout') }}</span>
          </button>
        </BaseTooltip>
      </div>

    </aside>

    <!-- ── Main area ── -->
    <div
      class="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-200"
      :class="collapsed ? 'md:ml-18' : 'md:ml-60'"
    >

      <!-- Topbar -->
      <header class="sticky top-0 z-10 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <button
            class="md:hidden shrink-0 p-1.5 -ml-1.5 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            :aria-label="$t('landlord.nav.title')"
            @click="sidebarOpen = true"
          >
            <BaseIcon name="menu" :size="20" />
          </button>
          <h1 class="text-base! font-semibold! text-gray-900 truncate min-w-0">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">

        <!-- Language switcher -->
        <el-dropdown trigger="click" @command="switchLang">
          <button class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600 hover:border-slate-300 transition cursor-pointer">
            <span>{{ locale === 'en' ? '🇬🇧' : '🇰🇭' }}</span>
            <span class="text-xs font-medium hidden sm:inline">{{ locale === 'en' ? 'EN' : 'KM' }}</span>
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
            class="flex items-center gap-x-2 rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div
              class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--nav-active-item)] text-xs font-bold shrink-0"
            >
              {{ userInitials }}
            </div>
            <span class="hidden sm:inline sm:max-w-32 truncate">{{ authStore.user?.name }}</span>
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
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSidebarNavItem from '~/components/ui/BaseSidebarNavItem.vue'
import BaseTooltip from '~/components/ui/BaseTooltip.vue'
import { initials } from '~/utils/initials'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { t, locale, setLocale } = useI18n()

const sidebarOpen = ref(false)
watch(() => route.path, () => { sidebarOpen.value = false })

const collapsed = ref(false)
const isDesktop = ref(false)
onMounted(() => {
  const stored = localStorage.getItem('landlord-sidebar-collapsed')
  if (stored !== null) collapsed.value = stored === 'true'

  const mq = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mq.matches
  const handleChange = (e: MediaQueryListEvent) => { isDesktop.value = e.matches }
  mq.addEventListener('change', handleChange)
  onUnmounted(() => mq.removeEventListener('change', handleChange))
})
watch(collapsed, (val) => {
  localStorage.setItem('landlord-sidebar-collapsed', String(val))
})

// Collapse only ever applies on desktop — the mobile drawer always shows full labels
const effectiveCollapsed = computed(() => collapsed.value && isDesktop.value)

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
  max-height: 2.25rem;
  opacity: 1;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out, padding 0.2s ease-in-out;
}

.sidebar-section-label--collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
