<template>
  <div class="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
    <BaseIconClient name="shield-check" color="text-amber-700" :size="18" class=" shrink-0 mt-0.5" />
    <p class="text-[13px] text-amber-700 leading-relaxed">
      {{ $t('property.safety_notice') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
</script>
