<template>
  <Icon :name="iconName" :size="props.size" :style="{'color': props.color}"  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string,
    color?: string
  }>(),
  {
    size: 16,
    color: 'currentColor'
  }
)

const iconName = computed(() => 'lucide:' + props.name)
</script>
