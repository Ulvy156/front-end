<script lang="ts" setup>
import type { UseMutationReturnType } from '@tanstack/vue-query'
import BaseToggle from '~/components/ui/BaseToggle.vue'
import type { ContactVisibility, UserProfile } from '../types/profile'

const props = defineProps<{
  profile: UserProfile
  mutation: UseMutationReturnType<ContactVisibility, unknown, Partial<ContactVisibility>, unknown>
}>()

const { t } = useI18n()
const { success, error: notifyError } = useNotify()
const { extract } = useErrorMsg()

const showPhone = ref(props.profile.showPhone)
const showTelegram = ref(props.profile.showTelegram)
const showEmail = ref(props.profile.showEmail)

watch(() => props.profile, (p) => {
  showPhone.value = p.showPhone
  showTelegram.value = p.showTelegram
  showEmail.value = p.showEmail
})

async function onToggle(field: keyof ContactVisibility, value: boolean) {
  try {
    await props.mutation.mutateAsync({ [field]: value })
    success(t('profile.visibility.updateSuccess'))
  } catch (err) {
    if (field === 'showPhone') showPhone.value = !value
    if (field === 'showTelegram') showTelegram.value = !value
    if (field === 'showEmail') showEmail.value = !value
    notifyError(extract(err))
  }
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-500 mb-3">{{ $t('profile.visibility.description') }}</p>

    <BaseToggle
      v-model="showPhone"
      :label="$t('profile.visibility.showPhone')"
      :description="$t('profile.visibility.showPhoneDesc')"
      @update:model-value="onToggle('showPhone', $event)"
    />
    <BaseToggle
      v-model="showTelegram"
      :label="$t('profile.visibility.showTelegram')"
      :description="$t('profile.visibility.showTelegramDesc')"
      @update:model-value="onToggle('showTelegram', $event)"
    />
    <BaseToggle
      v-model="showEmail"
      :label="$t('profile.visibility.showEmail')"
      :description="$t('profile.visibility.showEmailDesc')"
      @update:model-value="onToggle('showEmail', $event)"
    />
  </div>
</template>
