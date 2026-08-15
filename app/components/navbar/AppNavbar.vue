<template>
  <header v-if="!isMounted || isLgUp" :class="overlay" class=" top-2 z-40 hidden lg:block ">
    <nav
      class="m-auto flex justify-between w-11/12 items-center gap-4 rounded-2xl border border-gray-50 bg-white/60 px-6 py-3 shadow-sm bg-clip-padding  backdrop-filter backdrop-blur-sm">
      <!-- Logo -->
      <NuxtLink to="/" 
      class="flex items-center gap-1 text-lg font-semibold tracking-tight cursor-pointer ">
        <NuxtImg class="h-14 " src="/sabayrent-logo.webp" alt="app logo" width="56" height="56" />
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <!-- Center Search -->
      <div class="mx-auto flex items-center gap-1 rounded-full border border-(--nav-active-item) bg-white px-2 py-1.5 text-sm text-gray-600 whitespace-nowrap">
        <NuxtLink to="/"
        :class="{'menu-item-active': isActive('/')}"
        class="menu-items">
          <BaseIcon name="house" :size="16" />
          <p>{{ $t('nav.home') }} </p>
        </NuxtLink>

        <NuxtLink to="/properties"
        :class="{'menu-item-active': startsWith('/properties')}"
        class="menu-items">
          <BaseIcon name="search" :size="16" />
          <p>{{ $t('nav.browseRoom') }}</p>
        </NuxtLink>

        <NuxtLink
          v-if="canSeePostProperty"
          :class="{'menu-item-active': startsWith('/landlord/post-property')}"
          to="/landlord/post-property" class="menu-items">
          <BaseIcon name="circle-plus" :size="16" />
          <p>{{ $t('nav.postRoom') }}</p>
        </NuxtLink>

        <NuxtLink
          to="/user/favourites"
          :class="{'menu-item-active': startsWith('/user/favourites')}"
          class="menu-items"
        >
          <BaseIcon name="heart" :size="16" />
          <p>{{ $t('nav.favourites') }}</p>
        </NuxtLink>
      </div>

      <!-- Right -->
      <div class="flex items-center justify-end gap-4">
        <switchLngClient />

        <!-- Unauthenticated -->
        <NuxtLink v-if="!authStore.isAuthenticated" to="/auth/login"
          class="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white
                 hover:bg-blue-700 transition-colors whitespace-nowrap">
          {{ $t('auth.signIn') }}
        </NuxtLink>

        <!-- Authenticated. ClientOnly keeps el-dropdown's useId() calls out of SSR so a server/client auth-state mismatch can't shift every el-* id rendered after it (see FeedbackDialog in layouts/default.vue for the same fix). -->
        <ClientOnly v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <button class="block rounded-full cursor-pointer">
              <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center
                          text-blue-700 text-xs font-bold shrink-0 overflow-hidden
                          ring-2 ring-blue-200 ring-offset-2 ring-offset-white">
                <BaseImage v-if="authStore.user?.imgUrl" :src="authStore.user.imgUrl" :alt="authStore.user.name" fit="cover" />
                <span v-else>{{ userInitials }}</span>
              </div>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <BaseIcon name="user" :size="14" class="mr-2" />
                  {{ $t('nav.profile') }}
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided class="text-red-500">
                  <BaseIcon name="log-out" :size="14" class="mr-2" />
                  {{ $t('nav.signOut') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </ClientOnly>
      </div>
    </nav>
  </header>

  <MobileBottomNav />
</template>

<script lang="ts" setup>
import switchLngClient from './switch-lng.client.vue';
import BaseIcon from '../ui/BaseIcon.client.vue';
import BaseImage from '../ui/BaseImage.vue';
import MobileBottomNav from './MobileBottomNav.vue';
import { useActiveRoute } from '~/composables/useActiveRoute';
import { initials } from '~/utils/initials'

const { isActive, startsWith } = useActiveRoute();
const route = useRoute()

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useLogout()
const { isLandlord, isAdmin } = useRole()
const { isMounted, isLgUp } = useAppBreakpoints()

const canSeePostProperty = computed(() => !authStore.isAuthenticated || isLandlord.value)

const profileRoute = computed(() => {
  if (isAdmin.value) return '/admin/settings'
  if (isLandlord.value) return '/landlord/settings'
  return '/user/profile'
})

const overlay = computed(() => {
  if(route.meta.headerOverlay === true) {
    return 'fixed left-1/2 -translate-x-1/2 w-full';
  }
  return 'sticky mb-2 m-auto w-full';
})

const userInitials = computed(() => initials(authStore.user?.name ?? ''))

const handleCommand = async (cmd: string) => {
  if (cmd === 'profile') {
    router.push(profileRoute.value)
  } else if (cmd === 'logout') {
    await logout()
  }
}
</script>

<style scoped>
.menu-items {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  padding: 10px 16px;
  transition: color 0.5s ease, transform 0.5s ease;
}

.menu-items:hover {
  color: var(--nav-active-item);
  text-shadow: 0 0 0.5px var(--color-emerald-700);
}
.menu-item-active {
  background: var(--nav-active);
  color: var(--nav-active-item);
  border-width: 2px;
  border-color: color-mix(in oklab, var(--color-emerald-200) /* oklch(90.5% 0.093 164.15) = #a4f4cf */ 40%, transparent);
  padding: 10px 16px;
  border-radius: calc(infinity * 1px);
}
</style>