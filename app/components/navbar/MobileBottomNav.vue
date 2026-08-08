<template>
  <!-- Bottom Tab Bar (Liquid Glass style) -->
<nav
  v-if="!isMounted || !isLgUp"
  class="fixed w-[70%] inset-x-0 mx-auto
         bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
         z-40 lg:hidden
         flex items-center justify-around gap-1
         rounded-[40px]
         border border-white/30
         bg-white/15
         px-2 py-2
         shadow-[0_8px_32px_rgba(0,0,0,0.25)]
         backdrop-blur-2xl
         backdrop-saturate-150"
>
    <template v-for="item in navItems" :key="item.to">
      <NuxtLink
        v-if="!item.can"
        :to="item.to"
        class="tab-item"
        :class="isActiveRoute(item) ? 'tab-item-active' : 'text-gray-500'"
      >
        <BaseIcon :name="item.icon" :size="20" />
        <!-- <span class="line-clamp-1">{{ item.label }}</span> -->
      </NuxtLink>
      <NuxtLink
        v-else
        v-can="item.can"
        :to="item.to"
        class="tab-item"
        :class="isActiveRoute(item) ? 'tab-item-active' : 'text-gray-500'"
      >
        <BaseIcon :name="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </template>

    <!-- Profile / account -->
    <button
      type="button"
      class="tab-item"
      :class="sheetOpen ? 'tab-item-active' : 'text-gray-500'"
      @click="openSheet"
    >
      <div
        v-if="authStore.isAuthenticated"
        class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold shrink-0 overflow-hidden"
      >
        <BaseImage v-if="authStore.user?.imgUrl" :src="authStore.user.imgUrl" :alt="authStore.user.name" fit="cover" />
        <!-- <span v-else>{{ userInitials }}</span> -->
      </div>
      <BaseIcon v-else name="user" :size="20" />
      <!-- <span>{{ authStore.isAuthenticated ? $t('nav.profile') : $t('auth.signIn') }}</span> -->
    </button>
  </nav>

  <!-- Account bottom sheet — mounted lazily on first open so its el-drawer/el-overlay
       CSS chunk never loads on a fresh page visit that never opens it. -->
  <ClientOnly>
    <BaseDrawer
      v-if="sheetMounted"
      v-model="sheetOpen"
      size="280px"
    >
      <div class="flex flex-col gap-4 px-1">
        <!-- Authenticated -->
        <template v-if="authStore.isAuthenticated">
          <NuxtLink
            :to="profileRoute"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            @click="sheetOpen = false"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 overflow-hidden">
              <BaseImage v-if="authStore.user?.imgUrl" :src="authStore.user.imgUrl" :alt="authStore.user.name" fit="cover" />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
            </div>
          </NuxtLink>

          <div class="px-1">
            <switchLngClient />
          </div>

          <button
            class="flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <BaseIcon name="log-out" :size="16" />
            {{ $t('nav.signOut') }}
          </button>
        </template>

        <!-- Guest -->
        <template v-else>
          <NuxtLink
            to="/auth/login"
            class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-blue-700 transition-colors"
            @click="sheetOpen = false"
          >
            {{ $t('auth.signIn') }}
          </NuxtLink>

          <div class="px-1">
            <switchLngClient />
          </div>
        </template>
      </div>
    </BaseDrawer>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import switchLngClient from './switch-lng.client.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import { useActiveRoute } from '~/composables/useActiveRoute'
import { initials } from '~/utils/initials'

const BaseDrawer = defineAsyncComponent(() => import('~/components/ui/BaseDrawer.vue'))

const { t } = useI18n()
const { isActive, startsWith } = useActiveRoute()
const authStore = useAuthStore()
const { logout } = useLogout()
const { isLandlord, isAdmin } = useRole()
const { isMounted, isLgUp } = useAppBreakpoints()

const sheetOpen = ref(false)
// Keeps BaseDrawer unmounted until the user actually opens the account
// sheet, stays mounted afterward so the close transition still plays
// normally on subsequent opens/closes.
const sheetMounted = ref(false)

function openSheet() {
  sheetMounted.value = true
  sheetOpen.value = true
}

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
  sheetOpen.value = false
  await logout()
}
</script>

<style scoped>
.tab-item {
  display: flex;
  /* flex: 1 1 0; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 50px;
  width: 50px;
  border-radius: 50px;
  font-size: 11px;
  line-height: 1.1;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.tab-item-active {
  background: var(--nav-active);
  color: var(--nav-active-item);
}

:deep(.el-drawer) {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}
</style>
