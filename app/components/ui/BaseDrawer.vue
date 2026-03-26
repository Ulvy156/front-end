<template>
  <el-drawer v-model="modelValue" :direction="direction" resizable>
    <slot></slot>
  </el-drawer>
</template>

<script lang="ts" setup>
type Drawer = "rtl" | "ltr" | "ttb" | "btt";

withDefaults(
  defineProps<{
    modelValue: boolean
    direction?: Drawer
  }>(),
  {
    direction: 'btt',
  }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

</script>

<style></style>
