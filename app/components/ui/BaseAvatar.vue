<template>
  <el-avatar
    :size="60"
  >
    <BaseImage v-if="src" :src="image"/>
    <h3 v-if="!src">{{ userName }}</h3>
  </el-avatar>
</template>

<script setup lang="ts">
import BaseImage from './BaseImage.vue';

const props = withDefaults(
  defineProps<{
    src: string | undefined | null
    name: string | undefined
    size?: number
  }>(),
  {
    size: 60,
  }
);

const image = computed(() => props.src ?? '');
const userName = computed(() => {
  if(props.name) {
    return props.name[0];
  }
  return '';
})
</script>
