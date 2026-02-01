<template>
  <header :class="overlay" class=" top-2 z-40 hidden md:block ">
    <nav
      class="m-auto flex justify-between w-11/12 items-center gap-4 rounded-2xl border border-gray-50 bg-white/60 px-6 py-3 shadow-sm bg-clip-padding  backdrop-filter backdrop-blur-sm">
      <!-- Logo -->
      <NuxtLink to="/" 
      class="flex items-center gap-1 text-lg font-semibold tracking-tight cursor-pointer ">
        <NuxtImg class="h-14 " src="/rentify-logo.webp" alt="app logo" />
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <!-- Center Search -->
      <div class="mx-auto flex items-center gap-3 rounded-full border border-(--nav-active-item) bg-gray-50 px-4 py-2 text-sm text-gray-600">
        <NuxtLink to="/" 
        :class="{'menu-item-active': isActive('/')}"
        class="menu-items">
          <BaseIcon name="house" :size="16" />
          <p>{{ $t('nav.home') }} </p>
        </NuxtLink>

        <span class="text-gray-300">|</span>

        <NuxtLink to="/properties" 
        :class="{'menu-item-active': startsWith('/properties/details')}"
        class="menu-items">
          <BaseIcon name="search" :size="16" />
          <p>{{ $t('nav.browseRoom') }}</p>
        </NuxtLink>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="circle-plus" :size="16" />
          <p>{{ $t('nav.postRoom') }}</p>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="heart" :size="16" />
          <p>{{ $t('nav.favourites') }}</p>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center justify-end gap-4">
        <switchLngClient />
      </div>
    </nav>
  </header>

  <!-- for mobile only -->
  <!-- <MobileNavDrawer /> -->
</template>

<script lang="ts" setup>
import switchLngClient from './switch-lng.client.vue';
import BaseIcon from '../ui/BaseIcon.client.vue';
// import MobileNavDrawer from './MobileNavDrawer.vue';
import { useActiveRoute } from '~/composables/useActiveRoute';

const { isActive, startsWith } = useActiveRoute();
const route = useRoute()

// if on home page keep navbar as fixed 
// otherwise keep it as stikcy
const overlay = computed(() => {
  if(route.meta.headerOverlay === true) {
    return 'fixed left-1/2 -translate-x-1/2 w-full';
  }
  return 'sticky mb-2 m-auto w-full';
})
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