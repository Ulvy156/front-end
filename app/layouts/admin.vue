<template>
  <div class="flex min-h-screen">

    <!-- ── Sidebar ── -->
    <aside class="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-30">

      <!-- Logo -->
      <div class="h-16 flex items-center gap-2 px-5 border-b border-gray-200 shrink-0">
        <NuxtImg src="/rentify-logo.webp" class="h-9" alt="Rentify logo" />
        <span class="font-semibold text-gray-900 text-sm leading-tight">
          {{ $t('admin.nav.title') }}
        </span>
      </div>

      <!-- Scrollable nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

        <!-- OVERVIEW -->
        <p class="admin-section-label">{{ $t('admin.nav.overview') }}</p>
        <BaseSidebarNavItem to="/admin" icon="layout-dashboard" :label="$t('admin.nav.dashboard')" :exact="true" />

        <!-- PEOPLE -->
        <p class="admin-section-label">{{ $t('admin.nav.people') }}</p>
        <BaseSidebarNavItem to="/admin/users" icon="users" :label="$t('admin.nav.users')" />
        <BaseSidebarNavItem to="/admin/landlords" icon="user-check" :label="$t('admin.nav.landlords')" />

        <!-- LISTINGS -->
        <p class="admin-section-label">{{ $t('admin.nav.listings') }}</p>
        <BaseSidebarNavItem
          to="/admin/pending"
          icon="clock"
          :label="$t('admin.nav.pendingApproval')"
          :badge="pendingCount"
        />
        <BaseSidebarNavItem to="/admin/properties" icon="building" :label="$t('admin.nav.allProperties')" />
        <BaseSidebarNavItem to="/admin/featured" icon="star" :label="$t('admin.nav.featured')" />

        <!-- CONFIGURATION -->
        <p class="admin-section-label">{{ $t('admin.nav.configuration') }}</p>
        <BaseSidebarNavItem to="/admin/property-types" icon="layers" :label="$t('admin.nav.propertyTypes')" />
        <BaseSidebarNavItem to="/admin/amenities" icon="sparkles" :label="$t('admin.nav.amenities')" />
        <BaseSidebarNavItem to="/admin/house-rules" icon="shield-check" :label="$t('admin.nav.houseRules')" />

        <!-- REPORTS -->
        <p class="admin-section-label">{{ $t('admin.nav.reports') }}</p>
        <BaseSidebarNavItem
          to="/admin/feedback"
          icon="message-square"
          :label="$t('admin.nav.feedback')"
          :badge="feedbackCount"
        />

      </nav>

      <!-- Bottom: Settings + Logout -->
      <div class="border-t border-gray-200 p-3 space-y-0.5 shrink-0">
        <BaseSidebarNavItem to="/admin/settings" icon="settings" :label="$t('admin.nav.settings')" />
        <button
          class="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          @click="logout"
        >
          <BaseIcon name="log-out" :size="16" class="shrink-0" />
          <span>{{ $t('admin.nav.logout') }}</span>
        </button>
      </div>

    </aside>

    <!-- ── Main area ── -->
    <div class="ml-60 flex-1 flex flex-col min-h-screen">

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
import { initials } from '~/utils/initials'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { t } = useI18n()

const pendingCount = ref(0)
const feedbackCount = ref(0)

const userInitials = computed(() => initials(authStore.user?.name ?? ''))

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin')                        return t('admin.nav.dashboard')
  if (path.startsWith('/admin/users'))          return t('admin.nav.users')
  if (path.startsWith('/admin/landlords'))      return t('admin.nav.landlords')
  if (path.startsWith('/admin/pending'))        return t('admin.nav.pendingApproval')
  if (path.startsWith('/admin/properties'))     return t('admin.nav.allProperties')
  if (path.startsWith('/admin/featured'))       return t('admin.nav.featured')
  if (path.startsWith('/admin/property-types')) return t('admin.nav.propertyTypes')
  if (path.startsWith('/admin/amenities'))      return t('admin.nav.amenities')
  if (path.startsWith('/admin/house-rules'))    return t('admin.nav.houseRules')
  if (path.startsWith('/admin/feedback'))       return t('admin.nav.feedback')
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
}
</style>
