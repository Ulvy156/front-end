<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
import BaseIconClient from './BaseIcon.client.vue';

withDefaults(
  defineProps<{
    modelValue: string | number
    placeholder?: string
    type?: 'text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url',
    icon?: string,
    size?: 'large' | 'default' | 'small'
  }>(),
  {
    type: 'text',
    size: 'default',
    
  }
)

defineEmits(['update:modelValue'])
</script>

<template>
  <el-input :type :placeholder :size :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <template v-if="icon" #prefix>
      <BaseIconClient :name="icon" />
    </template>
  </el-input>
</template>
