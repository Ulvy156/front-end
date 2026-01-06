<template>
  <Icon :name="iconName" :size="props.size" :style="{'color': props.color}"  />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string
    size?: number,
    color?: string
  }>(),
  {
    size: 16,
    color: 'currentColor'
  }
)

const iconName = computed(() => 'lucide:' + props.name)
</script>
