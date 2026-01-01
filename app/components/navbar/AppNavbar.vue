<template>
  <header class="fixed top-2 z-40 hidden md:block left-1/2 -translate-x-1/2 w-11/12">
    <div
      class="m-auto flex justify-between w-11/12 items-center gap-4 rounded-2xl border border-gray-50 bg-white/60 px-6 py-3 shadow-sm backdrop-blur">
      <!-- Logo -->
      <NuxtLink to="/" 
      class="flex items-center gap-1 text-lg font-semibold tracking-tight cursor-pointer ">
        <NuxtImg class="h-14 " src="/rentify-logo.webp" alt="app logo" />
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <!-- Center Search -->
      <div class="mx-auto flex items-center gap-3 rounded-full border bg-gray-50 px-4 py-2 text-sm text-gray-600">
        <div 
        :class="{'menu-item-active': isActive('/')}"
        class="menu-items">
          <BaseIcon name="house" :size="16" />
          <span>{{ $t('nav.home') }} </span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="search" :size="16" />
          <span>{{ $t('nav.borwse_room') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="circle-plus" :size="16" />
          <span>{{ $t('nav.post_room') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="heart" :size="16" />
          <span>{{ $t('nav.favourites') }}</span>
        </div>

        <!-- <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="circle-parking" :size="16" />
          <span>{{ $t('nav.parking') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <BaseIcon name="key-square" :size="16" />
          <span>{{ $t('nav.rent') }}</span>
        </div> -->
      </div>

      <!-- Right -->
      <div class="flex items-center justify-end gap-4">
        <switchLng />
      </div>
    </div>
  </header>

  <!-- for mobile only -->
  <MobileNavDrawer />
</template>

<script lang="ts" setup>
import switchLng from './switch-lng.vue';
import BaseIcon from '../ui/BaseIcon.vue';
import MobileNavDrawer from './MobileNavDrawer.vue';
import { useActiveRoute } from '~/composables/useActiveRoute';

const { isActive } = useActiveRoute();

</script>

<style scoped>
.menu-items {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  transition: color 0.5s ease, transform 0.5s ease;
}

.menu-items:hover {
  color: var(--hover-text-color);
  text-shadow: 0 0 0.5px var(--color-emerald-700);
}
.menu-item-active {
  background-color: color-mix(in oklab, var(--color-emerald-400) /* oklch(76.5% 0.177 163.223) */ 8%, transparent);
  color: var(--color-emerald-700);
  border-width: 2px;
  border-color: color-mix(in oklab, var(--color-emerald-200) /* oklch(90.5% 0.093 164.15) = #a4f4cf */ 40%, transparent);
  padding: 10px 16px;
  border-radius: calc(infinity * 1px);
}
</style>