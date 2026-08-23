<template>
  <div class="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 sm:px-8 sm:py-4">
    <!-- Back -->
    <BaseButton
      type="info"
      plain
      block
      :disabled="currentStep === 1"
      class="rounded-full! px-5! font-medium! border-gray-200! sm:w-auto!"
      @click="emit('back')"
    >
      <BaseIconClient name="arrow-left" :size="18" />
      <span class="ml-1.5">{{ $t('post_property.back') }}</span>
    </BaseButton>

    <div class="flex items-center gap-2.5 w-full sm:w-auto">
      <!-- Save draft -->
      <BaseButton
        v-if="showDraftControls"
        type="info"
        plain
        :loading="savingDraft"
        class="rounded-full! px-5! font-medium! border-gray-200! flex-1 sm:flex-none min-w-0"
        @click="emit('save')"
      >
        <BaseIconClient v-if="!savingDraft" name="save" :size="18" />
        <span class="truncate ml-1.5">{{ $t('post_property.draft') }}</span>
      </BaseButton>

      <!-- Right — submit / next -->
      <BaseButton
        :loading="loading"
        class="rounded-full! px-6! font-semibold! shadow-md! shadow-emerald-600/25! hover:shadow-lg! hover:shadow-emerald-600/35! transition-shadow! flex-1 sm:flex-none min-w-0"
        @click="isLastStep ? emit('submit') : emit('next')"
      >
        <BaseIconClient v-if="!loading" :name="isLastStep ? submitIcon : 'arrow-right'" :size="18" />
        <span class="truncate ml-1.5">{{ loading ? submittingLabel : (isLastStep ? submitLabel : $t('post_property.continue')) }}</span>
      </BaseButton>
    </div>
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
