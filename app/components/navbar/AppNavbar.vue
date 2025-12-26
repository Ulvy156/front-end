<template>
  <header class="fixed top-2 z-40 hidden md:block inset-0 shadow-lg">
    <div
      class="mx-auto flex justify-between max-w-7xl items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-1 text-lg font-semibold tracking-tight cursor-pointer">
        <NuxtImg class="h-14 " src="/rentify-logo.webp" alt="app logo" />
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <!-- Center Search -->
      <div class="mx-auto flex items-center gap-3 rounded-full border bg-gray-50 p-4 text-sm text-gray-600">
        <div class="menu-items">
          <Icon name="lucide:bed-double" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.rooms') }} </span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <Icon name="lucide:building-2" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.apartments') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <Icon name="lucide:house" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.houses') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <Icon name="lucide:land-plot" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.land') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <Icon name="lucide:circle-parking" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.parking') }}</span>
        </div>

        <span class="text-gray-300">|</span>

        <div class="menu-items">
          <Icon name="lucide:key-square" size="16" />
          <span class="cursor-pointer hover:text-black">{{ $t('nav.rent') }}</span>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-4">
        <switchLng />
      </div>
    </div>
  </header>

  <!-- for mobile only -->
  <MobileNavDrawer />
</template>

<script lang="ts" setup>
import switchLng from './switch-lng.vue';
import MobileNavDrawer from './MobileNavDrawer.vue';
</script>

<style scoped>
.menu-items {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}

.menu-items:hover {
  color: black;
}
</style>