<template>
  <!-- Mobile only -->
  <div class="md:hidden">
    <!-- Toggle -->
    <button
      class="rounded-xl p-2 transition hover:bg-gray-100"
      @click="open = true"
    >
      <Icon name="lucide:menu" size="22" />
    </button>

    <!-- Overlay -->
    <div
      v-show="open"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      @click="open = false"
    />

    <!-- Drawer -->
    <aside
      v-show="open"
      class="fixed right-0 top-0 z-50 h-full w-3/4 max-w-xs bg-white p-6 shadow-xl transition"
    >
      <!-- Close -->
      <button
        class="mb-6 rounded-xl p-2 hover:bg-gray-100"
        @click="open = false"
      >
        <Icon name="lucide:x" size="22" />
      </button>

      <nav class="flex flex-col gap-4">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 text-lg font-medium"
          @click="open = false"
        >
          <Icon :name="item.icon" size="20" />
          {{ item.label }}
        </NuxtLink>

        <button
          class="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white"
        >
          <Icon name="lucide:plus" size="18" />
          List your place
        </button>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const open = ref(false)

const nav = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'Rooms', to: '/rooms', icon: 'lucide:bed-double' },
  { label: 'Apartments', to: '/apartments', icon: 'lucide:building-2' },
  { label: 'Map', to: '/map', icon: 'lucide:map' },
]
</script>
