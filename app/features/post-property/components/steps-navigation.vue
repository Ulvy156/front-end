<template>
  <div
    class="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between"
  >
    <!-- Back -->
    <BaseButton type="info" @click="emit('back')">
      <BaseIconClient name="arrow-left" :size="18" />
      <span class="font-medium">{{ $t('post_property.back') }}</span>
    </BaseButton>

    <!-- Middle (draft controls) — only in create mode -->
    <div v-if="showDraftControls" class="flex justify-between items-center gap-6">
      <BaseButton text type="info" @click="emit('save')">
        <BaseIconClient name="save" :size="18" />
        <span class="font-medium">{{ $t('post_property.draft') }}</span>
      </BaseButton>

      <div class="flex items-center gap-2 text-gray-500">
        <BaseIconClient name="circle-check" :size="18" class="text-green-500" />
        <span>{{ autoSaveText }}</span>
      </div>
    </div>

    <!-- Right — submit / next -->
    <BaseButton
      :loading="loading"
      @click="isLastStep ? emit('submit') : emit('next')"
    >
      <BaseIconClient v-if="!loading" :name="isLastStep ? submitIcon : 'arrow-right'" :size="18" />
      <span>{{ loading ? submittingLabel : (isLastStep ? submitLabel : $t('post_property.continue')) }}</span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  currentStep: number
  totalSteps: number
  loading?: boolean
  showDraftControls?: boolean
  autoSaveText?: string
  submitLabel?: string
  submittingLabel?: string
  submitIcon?: string
}>(), {
  showDraftControls: true,
  autoSaveText: '',
  submitIcon: 'upload',
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
  (e: 'save'): void
  (e: 'submit'): void
}>()

const isLastStep = computed(() => props.currentStep === props.totalSteps)

const submitLabel = computed(() => props.submitLabel || t('post_property.publish'))
const submittingLabel = computed(() => props.submittingLabel || t('post_property.publishing'))
</script>
