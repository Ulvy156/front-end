<!-- components/ui/BaseButton.vue -->
<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  nativeType?: 'button' | 'submit' | 'reset'
  tag?: string
  loading?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  circle?: boolean
  text?: boolean
  block?: boolean
}>(), {
  type: 'primary',
  nativeType: 'button',
  tag: 'button',
  size: 'default',
})
</script>

<template>
  <el-button
    :tag="tag"
    :type="type"
    :native-type="nativeType"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :circle="circle"
    :text="text"
    :class="block ? 'w-full' : 'w-fit'"
  >
    <slot>{{ label }}</slot>
  </el-button>
</template>
