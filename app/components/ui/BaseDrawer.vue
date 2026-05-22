<template>
  <el-drawer
    :model-value="modelValue"
    :direction="direction"
    :title="title"
    :size="size"
    :destroy-on-close="destroyOnClose"
    resizable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot></slot>
  </el-drawer>
</template>

<script lang="ts" setup>
type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

withDefaults(
  defineProps<{
    modelValue: boolean
    direction?: DrawerDirection
    title?: string
    size?: string
    destroyOnClose?: boolean
  }>(),
  {
    direction: 'btt',
    destroyOnClose: false,
  },
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
