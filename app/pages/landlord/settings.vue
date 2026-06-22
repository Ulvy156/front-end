<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 gap-3">
    <ClientOnly>
      <BaseIcon name="settings" :size="48" class="text-gray-300" />
    </ClientOnly>
    <p class="text-sm text-gray-500">{{ t('landlord.settings.comingSoon') }}</p>
  </div>
</template>
