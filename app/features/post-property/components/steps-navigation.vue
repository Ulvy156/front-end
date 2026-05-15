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
      @click="isLastStep ? emit('publish') : emit('next')"
      :disabled="loading"
      class="flex items-center gap-2 text-white px-4 py-3 rounded-xl font-semibold transition bg-(--nav-active-item) disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <BaseIconClient v-else :name="isLastStep ? 'upload' : 'arrow-right'" :size="18" />
      <span v-if="loading">{{ $t("post_property.publishing") }}</span>
      <span v-else>{{ isLastStep ? $t("post_property.publish") : $t("post_property.continue") }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
const props = defineProps<{
  currentStep: number
  totalSteps: number
  autoSaveText?: string
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: "back"): void;
  (e: "next"): void;
  (e: "save"): void;
  (e: "publish"): void;
}>();
const isLastStep = computed(() => props.currentStep === props.totalSteps);
</script>


<style scoped>
button {
    cursor: pointer;
}
</style>