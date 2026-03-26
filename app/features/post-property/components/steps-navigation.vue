<template>
  <div
    class="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between"
  >
    <!-- Back -->
    <button
      @click="emit('back')"
      class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
    >
      <BaseIconClient name="arrow-left" :size="18" />
      <span class="font-medium">{{ $t('post_property.back') }}</span>
    </button>
    <!-- Left -->
    <div class="flex justify-between items-center gap-6">
      <!-- Save Draft -->
      <button
        @click="emit('save')"
        class="flex items-center gap-2 text-gray-700 hover:text-black transition"
      >
        <BaseIconClient name="save" :size="18" />
        <span class="font-medium">{{ $t('post_property.draft') }}</span>
      </button>

      <!-- Auto Save Info -->
      <div class="flex items-center gap-2 text-gray-500">
        <BaseIconClient name="circle-check" :size="18" class="text-green-500" />
        <span>Auto-saved at 2:24:52 PM</span>
      </div>
    </div>

    <!-- Right -->
    <button
      @click="emit('next')"
      class="flex items-center gap-2 bg-(--nav-active-item) text-white px-4 py-3 rounded-xl font-semibold transition"
    >
      {{ $t('post_property.continue') }}
      <BaseIconClient name="arrow-right" :size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";

const emit = defineEmits<{
  (e: "back"): void;
  (e: "next"): void;
  (e: "save"): void;
}>();
</script>


<style scoped>
button {
    cursor: pointer;
}
</style>