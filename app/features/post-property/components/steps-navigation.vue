<template>
  <div class="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-12 sm:py-4.5">
    <!-- Back -->
    <BaseButton type="info" :disabled="currentStep === 1" @click="emit('back')">
      <BaseIconClient name="arrow-left" :size="18" />
      <span class="font-medium">{{ $t('post_property.back') }}</span>
    </BaseButton>

    <!-- Save draft -->
    <BaseButton v-if="showDraftControls" text type="info" :loading="savingDraft" @click="emit('save')">
      <BaseIconClient v-if="!savingDraft" name="save" :size="18" />
      <span class="font-medium">{{ $t('post_property.draft') }}</span>
    </BaseButton>

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
  savingDraft?: boolean
  showDraftControls?: boolean
  submitLabel?: string
  submittingLabel?: string
  submitIcon?: string
}>(), {
  showDraftControls: true,
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
