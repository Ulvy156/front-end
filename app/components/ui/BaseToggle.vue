<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  label?: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3.5">
    <svg class="w-5 h-5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-800">
        {{ label }}
      </p>
      <p v-if="description" class="text-xs text-gray-500 mt-0.5">
        {{ description }}
      </p>
    </div>
    <button
      type="button"
      @click="modelValue = !modelValue"
      :class="modelValue ? 'bg-emerald-500' : 'bg-gray-300'"
      class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-none outline-none"
    >
      <span
        :class="modelValue ? 'translate-x-5' : 'translate-x-0.5'"
        class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 block"
      ></span>
    </button>
  </div>
</template>