<template>
  <div class="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Mobile -->
    <div v-if="!isMounted || !isMdUp" class="flex flex-col gap-2.5 px-4.5 py-3.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-(--nav-active-item) tracking-wide uppercase">
          {{ t('post_property.step_progress.step_of', { current: currentStep + 1, total: stepKeys.length }) }}
        </span>
      </div>
      <div class="text-lg font-bold text-gray-900 leading-tight">
        {{ t(stepKeys[currentStep]) }}
      </div>
      <div class="flex gap-1.5">
        <button
          v-for="(key, index) in stepKeys"
          :key="key"
          type="button"
          class="flex-1 h-1.5 rounded-full transition-colors border-none cursor-pointer"
          :class="index <= currentStep ? 'bg-(--nav-active-item)' : 'bg-gray-200'"
          @click="emit('jump', index)"
        />
      </div>
    </div>

    <!-- Desktop -->
    <div v-if="!isMounted || isMdUp" class="px-10 py-5.5">
      <div class="relative">
        <div class="absolute top-4.75 left-12 right-12 h-0.5 bg-gray-200" />
        <div
          class="absolute top-4.75 left-12 h-0.5 bg-(--nav-active-item) transition-[width] duration-300"
          :style="{ width: progressWidth }"
        />
        <div class="relative flex justify-between">
          <button
            v-for="(key, index) in stepKeys"
            :key="key"
            type="button"
            class="flex flex-col items-center gap-2 w-30 border-none bg-transparent cursor-pointer"
            @click="emit('jump', index)"
          >
            <span
              class="w-9.5 h-9.5 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
              :class="circleClass(index)"
            >
              <BaseIconClient v-if="index < currentStep" name="check" :size="16" />
              <template v-else>{{ index + 1 }}</template>
            </span>
            <span class="text-center">
              <span
                class="block text-[13px] leading-tight"
                :class="[
                  index === currentStep ? 'font-bold' : 'font-semibold',
                  index > currentStep ? 'text-gray-400' : 'text-gray-900',
                ]"
              >
                {{ t(key) }}
              </span>
              <span class="block text-[11px] text-gray-400 mt-0.5" style="font-family: var(--font-km)">
                {{ STEP_LABELS_KM[index] }}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useAppBreakpoints } from '~/composables/useAppBreakpoints'

const { t } = useI18n()
const { isMounted, isMdUp } = useAppBreakpoints()

const props = defineProps<{
  stepKeys: string[]
  currentStep: number
}>()

// vue-i18n's per-call `{ locale: 'km' }` override doesn't resolve under this
// project's i18n setup (renders the raw key) — mirrors km/post_property.json's
// steps.one..seven values directly instead.
const STEP_LABELS_KM = [
  'ប្រភេទអចលនទ្រព្យ',
  'ព័ត៌មានមូលដ្ឋាន',
  'ទីតាំង',
  'តម្លៃ',
  'សេវាកម្ម និងសម្ភារៈ',
  'រូបថត',
  'មើលមុន',
]

const emit = defineEmits<{
  (e: 'jump', index: number): void
}>()

const progressWidth = computed(() => {
  const total = props.stepKeys.length
  if (total <= 1) return '0px'
  const ratio = Math.min(props.currentStep, total - 1) / (total - 1)
  return `calc((100% - 6rem) * ${ratio})`
})

function circleClass(index: number) {
  if (index < props.currentStep) {
    return 'bg-(--nav-active-item) border-(--nav-active-item) text-white'
  }
  if (index === props.currentStep) {
    return 'bg-emerald-50 border-(--nav-active-item) text-(--nav-active-item) ring-4 ring-emerald-50'
  }
  return 'bg-white border-gray-200 text-gray-400'
}
</script>
