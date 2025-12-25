<script setup lang="ts">
type Option = {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number | null
  options: Option[]
  placeholder?: string
  clearable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()
</script>

<template>
  <el-select
    class="w-full"
    :model-value="props.modelValue"
    :placeholder="props.placeholder || 'Select'"
    :clearable="props.clearable ?? true"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="opt in props.options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
