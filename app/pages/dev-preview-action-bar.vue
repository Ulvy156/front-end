<template>
  <div class="w-full px-4 mt-10 md:w-[80%] md:px-0 m-auto flex flex-col gap-6">
    <div class="flex gap-2 flex-wrap">
      <button v-for="s in totalSteps" :key="s" class="px-3 py-1 rounded-full border text-sm" :class="s === currentStep ? 'bg-black text-white' : 'bg-white'" @click="currentStep = s">
        Step {{ s }}
      </button>
      <button class="px-3 py-1 rounded-full border text-sm" @click="toggleLocale">
        {{ locale === 'km' ? 'Switch to EN' : 'Switch to KM' }}
      </button>
      <button class="px-3 py-1 rounded-full border text-sm" @click="savingDraft = !savingDraft">
        Toggle saving-draft ({{ savingDraft }})
      </button>
      <button class="px-3 py-1 rounded-full border text-sm" @click="loading = !loading">
        Toggle publishing ({{ loading }})
      </button>
    </div>

    <div class="max-w-[375px]">
      <p class="text-xs text-gray-500 mb-2">375px mobile</p>
      <ActionBar
        :current-step="currentStep"
        :total-steps="totalSteps"
        :loading="loading"
        :saving-draft="savingDraft"
        @back="currentStep = Math.max(1, currentStep - 1)"
        @next="currentStep = Math.min(totalSteps, currentStep + 1)"
        @save="() => {}"
        @submit="() => {}"
      />
    </div>

    <div>
      <p class="text-xs text-gray-500 mb-2">Wider viewport</p>
      <ActionBar
        :current-step="currentStep"
        :total-steps="totalSteps"
        :loading="loading"
        :saving-draft="savingDraft"
        @back="currentStep = Math.max(1, currentStep - 1)"
        @next="currentStep = Math.min(totalSteps, currentStep + 1)"
        @save="() => {}"
        @submit="() => {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionBar from '~/features/post-property/components/action-bar.vue'

const { locale } = useI18n()
const currentStep = ref(1)
const totalSteps = 4
const savingDraft = ref(false)
const loading = ref(false)

function toggleLocale() {
  locale.value = locale.value === 'km' ? 'en' : 'km'
}

useSeoMeta({ robots: 'noindex, nofollow' })
</script>
