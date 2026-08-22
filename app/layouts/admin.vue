<template>
  <div class="flex min-h-screen">

    <!-- ── Sidebar ── -->
    <aside
      class="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-30 transition-all duration-200"
      :class="collapsed ? 'w-18' : 'w-60'"
    >

      <!-- Collapse toggle -->
      <button
        class="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors cursor-pointer"
        :aria-label="collapsed ? $t('admin.nav.expand') : $t('admin.nav.collapse')"
        @click="collapsed = !collapsed"
      >
        <BaseIcon name="chevron-left" :size="14" class="transition-transform duration-200" :class="collapsed ? 'rotate-180' : ''" />
      </button>

      <!-- Logo -->
      <div
        class="h-16 flex items-center gap-2 border-b border-gray-200 shrink-0 overflow-hidden transition-all duration-200"
        :class="collapsed ? 'justify-center px-0' : 'px-5'"
      >
        <NuxtImg src="/sabayrent-logo.webp" class="h-9 shrink-0" alt="RokPteah logo" width="36" height="36" />
        <span
          class="font-semibold text-gray-900 text-sm leading-tight whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
          :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'"
        >
          {{ $t('admin.nav.title') }}
        </span>
      </div>

      <!-- Scrollable nav -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-0.5">

        <!-- OVERVIEW -->
        <p class="admin-section-label" :class="collapsed ? 'admin-section-label--collapsed' : ''">{{ $t('admin.nav.overview') }}</p>
        <BaseSidebarNavItem to="/admin" icon="layout-dashboard" :label="$t('admin.nav.dashboard')" :exact="true" :collapsed="collapsed" />

        <!-- PEOPLE -->
        <p class="admin-section-label" :class="collapsed ? 'admin-section-label--collapsed' : ''">{{ $t('admin.nav.people') }}</p>
        <BaseSidebarNavItem to="/admin/users" icon="users" :label="$t('admin.nav.users')" :collapsed="collapsed" />
        <BaseSidebarNavItem to="/admin/landlords" icon="user-check" :label="$t('admin.nav.landlords')" :collapsed="collapsed" />
        <BaseSidebarNavItem to="/admin/deletion-requests" icon="user-x" :label="$t('admin.nav.deletionRequests')" :collapsed="collapsed" />

        <!-- LISTINGS -->
        <p class="admin-section-label" :class="collapsed ? 'admin-section-label--collapsed' : ''">{{ $t('admin.nav.listings') }}</p>
        <BaseSidebarNavItem
          to="/admin/pending"
          icon="clock"
          :label="$t('admin.nav.pendingApproval')"
          :badge="pendingCount"
          :collapsed="collapsed"
        />
        <BaseSidebarNavItem to="/admin/properties" icon="building" :label="$t('admin.nav.allProperties')" :collapsed="collapsed" />
        <BaseSidebarNavItem to="/admin/featured" icon="star" :label="$t('admin.nav.featured')" :collapsed="collapsed" />

        <!-- CONFIGURATION -->
        <p class="admin-section-label" :class="collapsed ? 'admin-section-label--collapsed' : ''">{{ $t('admin.nav.configuration') }}</p>
        <BaseSidebarNavItem to="/admin/property-types" icon="layers" :label="$t('admin.nav.propertyTypes')" :collapsed="collapsed" />
        <BaseSidebarNavItem to="/admin/amenities" icon="sparkles" :label="$t('admin.nav.amenities')" :collapsed="collapsed" />
        <BaseSidebarNavItem to="/admin/house-rules" icon="shield-check" :label="$t('admin.nav.houseRules')" :collapsed="collapsed" />

        <!-- REPORTS -->
        <p class="admin-section-label" :class="collapsed ? 'admin-section-label--collapsed' : ''">{{ $t('admin.nav.reports') }}</p>
        <BaseSidebarNavItem
          to="/admin/feedback"
          icon="message-square"
          :label="$t('admin.nav.feedback')"
          :badge="feedbackCount"
          :collapsed="collapsed"
        />
        <BaseSidebarNavItem to="/admin/reports" icon="flag" :label="$t('admin.nav.propertyReports')" :collapsed="collapsed" />

      </nav>

      <!-- Bottom: Settings + Logout -->
      <div class="border-t border-gray-200 p-3 space-y-0.5 shrink-0">
        <BaseSidebarNavItem to="/admin/settings" icon="settings" :label="$t('admin.nav.settings')" :collapsed="collapsed" />
        <BaseTooltip :content="$t('admin.nav.logout')" placement="right" :disabled="!collapsed">
          <button
            class="relative flex w-full items-center px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 overflow-hidden transition-colors duration-200 cursor-pointer"
            :class="collapsed ? 'justify-center' : 'gap-3'"
            @click="logout"
          >
            <BaseIcon name="log-out" :size="16" class="shrink-0" />
            <span
              class="whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
              :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'"
            >{{ $t('admin.nav.logout') }}</span>
          </button>
        </BaseTooltip>
      </div>

    </aside>

    <!-- ── Main area ── -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-200"
      :class="collapsed ? 'ml-18' : 'ml-60'"
    >

      <!-- Topbar -->
      <header class="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h1 class="text-base font-semibold text-gray-900">{{ pageTitle }}</h1>

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
                {{ $t('admin.nav.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import BaseTooltip from '~/components/ui/BaseTooltip.vue'
import { initials } from '~/utils/initials'
import { useAdminDashboard } from '~/features/admin/composables/useAdminDashboard'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { t } = useI18n()
const { data: dashboardData } = useAdminDashboard()

// Every page under this layout is a gated admin screen — none should ever
// be indexed, so set it once here instead of on each /admin/* page.
useSeoMeta({ robots: 'noindex, nofollow' })

const pendingCount = computed(() => dashboardData.value?.stats.properties.unpublished ?? 0)
const feedbackCount = computed(() => dashboardData.value?.stats.feedback.total ?? 0)

const collapsed = ref(false)
onMounted(() => {
  const stored = localStorage.getItem('admin-sidebar-collapsed')
  if (stored !== null) collapsed.value = stored === 'true'
})
watch(collapsed, (val) => {
  localStorage.setItem('admin-sidebar-collapsed', String(val))
})

const userInitials = computed(() => initials(authStore.user?.name ?? ''))

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin')                        return t('admin.nav.dashboard')
  if (path.startsWith('/admin/users'))          return t('admin.nav.users')
  if (path.startsWith('/admin/landlords'))      return t('admin.nav.landlords')
  if (path.startsWith('/admin/deletion-requests')) return t('admin.nav.deletionRequests')
  if (path.startsWith('/admin/pending'))        return t('admin.nav.pendingApproval')
  if (path.startsWith('/admin/properties'))     return t('admin.nav.allProperties')
  if (path.startsWith('/admin/featured'))       return t('admin.nav.featured')
  if (path.startsWith('/admin/property-types')) return t('admin.nav.propertyTypes')
  if (path.startsWith('/admin/amenities'))      return t('admin.nav.amenities')
  if (path.startsWith('/admin/house-rules'))    return t('admin.nav.houseRules')
  if (path.startsWith('/admin/feedback'))       return t('admin.nav.feedback')
  if (path.startsWith('/admin/reports'))        return t('admin.nav.propertyReports')
  if (path.startsWith('/admin/settings'))       return t('admin.nav.settings')
  return t('admin.nav.title')
})

const handleCommand = async (cmd: string) => {
  if (cmd === 'logout') await logout()
}
</script>

<style scoped>
.admin-section-label {
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

.admin-section-label--collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
