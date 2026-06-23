<!-- components/ui/BaseButton.vue -->
<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  circle?: boolean
  text?: boolean
}>(), {
  type: 'primary',
  size: 'default',
})
</script>

<template>
  <el-button
    :type="type"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :circle="circle"
    :text="text"
    class="w-fit"
  >
    <slot>{{ label }}</slot>
  </el-button>
</template>
