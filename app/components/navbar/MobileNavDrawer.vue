<template>
  <!-- Mobile Header -->
  <header class="sticky top-2 z-40 md:hidden px-4 w-full">
    <div
      class="flex items-center justify-between rounded-2xl border border-gray-200 w-full
             bg-white/80 px-4 shadow-sm backdrop-blur"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-semibold"
      >
        <NuxtImg
          src="/rentify-logo.webp"
          class="size-18"
          alt="app logo"
        />
      </NuxtLink>

      <!-- Menu Button -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border
               backdrop-blur hover:bg-gray-100 transition"
        @click="drawer = true"
      >
        <Icon name="lucide:menu" size="20" />
      </button>
    </div>
  </header>

  <!-- Drawer -->
  <el-drawer
    v-model="drawer"
    direction="rtl"
    size="80%"
    :with-header="false"
  >
    <div class="flex flex-col h-full p-4 gap-6">

      <!-- Drawer Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 font-semibold">
          <NuxtImg src="/rentify-logo-56.webp" class="h-8 w-8" />
          <span>{{ $t('nav.title') }}</span>
        </div>

        <button
          class="p-2 rounded-full hover:bg-gray-100"
          @click="drawer = false"
        >
          <Icon name="lucide:x" size="18" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-col gap-4 text-sm ">
        <NavItem icon="lucide:bed-double" :label="$t('nav.rooms')" />
        <NavItem icon="lucide:building-2" :label="$t('nav.apartments')" />
        <NavItem icon="lucide:house" :label="$t('nav.houses')" />
        <NavItem icon="lucide:land-plot" :label="$t('nav.land')" />
        <NavItem icon="lucide:circle-parking" :label="$t('nav.parking')" />
      </nav>

      <div class="mt-auto flex items-center justify-between gap-3">
        <switchLng />

        <!-- Auth -->
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full
                 border backdrop-blur"
        >
          <Icon name="lucide:user-round" size="18" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import switchLng from './switch-lng.client.vue'

const drawer = ref(false)
</script>
