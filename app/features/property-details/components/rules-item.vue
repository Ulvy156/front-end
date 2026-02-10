<template>
<div
  :class="[
    'flex items-center justify-between gap-x-3 p-3 rounded-(--radius) font-medium',
    'shrink-0', // Key change here
    isAllowed 
      ? 'bg-(--nav-active) text-(--nav-active-item)' 
      : 'bg-red-500/10 text-red-600'
  ]"
>
  <div class="flex items-center gap-x-3 whitespace-nowrap">
    <BaseIconClient :name="rule.icon" />
    <p>{{  props.rule[currentLng] }}</p>
  </div>
  <BaseIconClient :name="isAllowed ? 'check-check' : 'x'" />
</div>
</template>

<script setup lang="ts">
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { useLangKey } from '#imports';

const props = defineProps<{
  rule: any // could type this better
  isAllowed: boolean
}>()

const currentLng = useLangKey();

</script>