<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
  import BaseIconClient from './BaseIcon.client.vue';
defineProps<{
  modelValue: string | number
  placeholder?: string
  type?: string,
  icon?:string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <el-input :type="type || 'text'" :placeholder="placeholder" :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <template v-if="icon" #prefix>
      <BaseIconClient :name="icon" />
    </template>
  </el-input>
</template>
