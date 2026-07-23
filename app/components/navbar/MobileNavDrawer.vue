<template>
  <!-- Mobile Header -->
  <header class="sticky top-2 z-40 md:hidden px-4 w-full">
    <div
      class="flex items-center justify-between rounded-2xl border border-gray-200 w-full
             bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
    >
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <NuxtImg src="/rokpteah-logo.webp" class="h-10" alt="app logo" />
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border
               hover:bg-gray-100 transition cursor-pointer"
        @click="drawer = true"
      >
        <BaseIcon name="menu" :size="20" />
      </button>
    </div>
  </header>

  <!-- Drawer -->
  <BaseDrawer
    v-model="drawer"
    direction="ltr"
    size="80%"
  >
    <div class="flex flex-col h-full gap-6">
      <!-- Navigation -->
      <nav class="flex flex-col gap-1">
        <template v-for="item in navItems" :key="item.to">
          <NuxtLink
            v-if="!item.can"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors"
            :class="isActiveRoute(item) ? 'bg-(--nav-active) text-(--nav-active-item) font-semibold' : 'text-gray-700 hover:bg-gray-50'"
            @click="drawer = false"
          >
            <BaseIcon :name="item.icon" :size="18" />
            {{ item.label }}
          </NuxtLink>
          <NuxtLink
            v-else
            v-can="item.can"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors"
            :class="isActiveRoute(item) ? 'bg-(--nav-active) text-(--nav-active-item) font-semibold' : 'text-gray-700 hover:bg-gray-50'"
            @click="drawer = false"
          >
            <BaseIcon :name="item.icon" :size="18" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <!-- Bottom section -->
      <div class="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-4">
        <div class="px-4">
          <switchLngClient />
        </div>

        <!-- Unauthenticated -->
        <NuxtLink
          v-if="!authStore.isAuthenticated"
          to="/auth/login"
          class="mx-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-blue-700 transition-colors"
          @click="drawer = false"
        >
          {{ $t('auth.signIn') }}
        </NuxtLink>

        <!-- Authenticated -->
        <template v-else>
          <NuxtLink
            :to="profileRoute"
            class="flex items-center gap-3 mx-4 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            @click="drawer = false"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
            </div>
          </NuxtLink>
          <button
            class="flex items-center gap-2 mx-4 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <BaseIcon name="log-out" :size="16" />
            {{ $t('nav.signOut') }}
          </button>
        </template>
      </div>
    </div>
  </BaseDrawer>
</template>

<script lang="ts" setup>
import switchLngClient from './switch-lng.client.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { useActiveRoute } from '~/composables/useActiveRoute'
import { initials } from '~/utils/initials'

const { t } = useI18n()
const { isActive, startsWith } = useActiveRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { isLandlord, isAdmin } = useRole()
const drawer = ref(false)

const userInitials = computed(() => initials(authStore.user?.name ?? ''))

const profileRoute = computed(() => {
  if (isAdmin.value) return '/admin/settings'
  if (isLandlord.value) return '/landlord/settings'
  return '/user/profile'
})

const navItems = computed(() => [
  { to: '/', icon: 'house', label: t('nav.home'), exact: true, can: undefined },
  { to: '/properties', icon: 'search', label: t('nav.browseRoom'), exact: false, can: undefined },
  { to: '/landlord/post-property', icon: 'circle-plus', label: t('nav.postRoom'), exact: false, can: 'landlord' as const },
  { to: '/user/favourites', icon: 'heart', label: t('nav.favourites'), exact: false, can: undefined },
])

function isActiveRoute(item: { to: string; exact: boolean }) {
  return item.exact ? isActive(item.to) : startsWith(item.to)
}

async function handleLogout() {
  drawer.value = false
  await logout()
}
</script>
