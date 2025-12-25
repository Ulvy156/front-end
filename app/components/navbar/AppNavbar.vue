<template>
  <header class="sticky mt-2 z-40 hidden md:block inset-0">
    <div
      class="mx-auto flex justify-between max-w-7xl items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-1 text-lg font-semibold tracking-tight cursor-pointer"
      >
        <NuxtImg class="h-14 " src="/rentify-logo.webp" alt="app logo"/>
        <span class="text-lg">{{ $t('nav.title') }}</span>
      </NuxtLink>

      <!-- Center Search -->
      <div
        class="mx-auto flex items-center gap-3 rounded-full border bg-gray-50 p-4 text-sm text-gray-600"
      >
        <Icon name="lucide:bed-double" size="16" />
        <span class="cursor-pointer hover:text-black">{{ $t('nav.rooms') }} </span>

        <span class="text-gray-300">|</span>

        <Icon name="lucide:building-2" size="16" />
        <span class="cursor-pointer hover:text-black">{{ $t('nav.apartments') }}</span>

        <span class="text-gray-300">|</span>

        <Icon name="lucide:house" size="16" />
        <span class="cursor-pointer hover:text-black">{{ $t('nav.houses') }}</span>

        <span class="text-gray-300">|</span>

        <Icon name="lucide:land-plot" size="16" />
        <span class="cursor-pointer hover:text-black">{{ $t('nav.land') }}</span>

        <span class="text-gray-300">|</span>

        <Icon name="lucide:circle-parking" size="16" />
        <span class="cursor-pointer hover:text-black">{{ $t('nav.parking') }}</span>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-4">
        <switchLng/>
        <div class="backdrop-blur border p-2 size-10 flex justify-center items-center rounded-full">
          <Icon name="lucide:user-round" size="16"  />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import switchLng from './switch-lng.vue';
</script>