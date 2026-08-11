<template>
  <!-- Bottom Tab Bar (Liquid Glass style) -->
<nav
  v-if="!isMounted || !isLgUp"
  ref="navEl"
  class="mobile-bottom-nav fixed w-[90%] inset-x-0 mx-auto
         bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
         z-40 lg:hidden
         flex items-center justify-center
         rounded-[40px]
         border border-white/30
         bg-white/15
         shadow-[0_8px_32px_rgba(0,0,0,0.25)]
         backdrop-blur-2xl
         backdrop-saturate-150"
  :class="{ 'mobile-bottom-nav--collapsed': isScrollCollapsed }"
>
    <!-- Full tab row — fades out while scrolling, the nav itself shrinks to a small circle -->
    <div
      class="nav-items flex items-center justify-around gap-1 w-full px-2 py-2"
      :class="{ 'nav-items--hidden': isScrollCollapsed }"
    >
      <!-- Sliding active-tab indicator, positioned to match the active tab-item's rect -->
      <div
        class="tab-indicator"
        :style="{
          transform: indicatorStyle.transform,
          width: indicatorStyle.width,
          height: indicatorStyle.height,
          opacity: indicatorStyle.opacity,
        }"
      />

      <template v-for="item in navItems" :key="item.to">
        <NuxtLink
          v-if="!item.can"
          :ref="(el) => setItemRef(el, item.to)"
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
          :ref="(el) => setItemRef(el, item.to)"
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
        :ref="(el) => setItemRef(el, 'profile')"
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
    </div>

    <!-- Collapsed state — just the active tab's icon, shown while scrolling -->
    <div
      class="nav-collapsed-icon"
      :class="{ 'nav-collapsed-icon--visible': isScrollCollapsed }"
    >
      <div
        v-if="activeKey === 'profile' && authStore.isAuthenticated"
        class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold shrink-0 overflow-hidden"
      >
        <BaseImage v-if="authStore.user?.imgUrl" :src="authStore.user.imgUrl" :alt="authStore.user.name" fit="cover" />
      </div>
      <BaseIcon v-else :name="collapsedIcon" :size="20" />
    </div>
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
import { defineAsyncComponent, type ComponentPublicInstance } from 'vue'
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

// Sliding pill indicator — tracks whichever tab-item is currently active
// (route match, or the profile button while its sheet is open) and glides
// between them instead of the highlight just popping in/out.
const navEl = ref<HTMLElement | null>(null)
const itemEls = new Map<string, HTMLElement>()

function setItemRef(el: Element | ComponentPublicInstance | null, key: string) {
  const domEl = (el && '$el' in el ? (el as ComponentPublicInstance).$el : el) as HTMLElement | undefined
  if (domEl instanceof HTMLElement) {
    itemEls.set(key, domEl)
  } else {
    itemEls.delete(key)
  }
}

const indicatorStyle = reactive({
  transform: 'translate(0px, 0px)',
  width: '0px',
  height: '0px',
  opacity: 0,
})

const activeKey = computed(() => {
  const match = navItems.value.find((item) => isActiveRoute(item))
  if (match) return match.to
  if (sheetOpen.value) return 'profile'
  return null
})

const INDICATOR_HEIGHT = 3
const INDICATOR_WIDTH_RATIO = 0.8

function updateIndicator() {
  const nav = navEl.value
  const el = activeKey.value ? itemEls.get(activeKey.value) : null

  if (!nav || !el) {
    indicatorStyle.opacity = 0
    return
  }

  const navRect = nav.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const width = elRect.width * INDICATOR_WIDTH_RATIO
  const x = elRect.left - navRect.left + (elRect.width - width) / 2
  const y = elRect.top - navRect.top + elRect.height - INDICATOR_HEIGHT

  indicatorStyle.transform = `translate(${x}px, ${y}px)`
  indicatorStyle.width = `${width}px`
  indicatorStyle.height = `${INDICATOR_HEIGHT}px`
  indicatorStyle.opacity = 1
}

watch(activeKey, () => nextTick(updateIndicator))

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(updateIndicator)
  resizeObserver = new ResizeObserver(() => updateIndicator())
  if (navEl.value) resizeObserver.observe(navEl.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

// Collapse the whole bar to a small circle while the page is scrolling,
// expand it back once scroll events go quiet for a moment (Facebook/X-style FAB collapse).
const SCROLL_COLLAPSE_IDLE_MS = 700

const isScrollCollapsed = ref(false)
let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null

const collapsedIcon = computed(() => {
  if (activeKey.value === 'profile') return 'user'
  return navItems.value.find((item) => item.to === activeKey.value)?.icon ?? 'circle'
})

function handleScroll() {
  isScrollCollapsed.value = true
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
  scrollIdleTimer = setTimeout(() => {
    isScrollCollapsed.value = false
  }, SCROLL_COLLAPSE_IDLE_MS)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
})

async function handleLogout() {
  sheetOpen.value = false
  await logout()
}
</script>

<style scoped>
.mobile-bottom-nav {
  height: 68px;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-bottom-nav--collapsed {
  width: 56px;
  height: 56px;
}

.nav-items {
  position: relative;
  transition: opacity 0.2s ease;
}

.nav-items--hidden {
  opacity: 0;
  pointer-events: none;
}

.nav-collapsed-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nav-active-item);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.nav-collapsed-icon--visible {
  opacity: 1;
  pointer-events: auto;
}

.tab-indicator {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 999px;
  background: var(--nav-active-item);
  z-index: 0;
  pointer-events: none;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s ease;
}

.tab-item {
  position: relative;
  z-index: 1;
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
  transition: color 0.2s ease;
}

.tab-item-active {
  color: var(--nav-active-item);
}

:deep(.el-drawer) {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}
</style>
