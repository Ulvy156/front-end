<template>
  <span :class="active ? 'active' : 'default-class'" @click="$emit('click')">
    <slot />
  </span>
</template>

<script lang="ts" setup>
defineProps<{ active: boolean }>();
defineEmits<{ click: [] }>();
</script>

<style scoped>
.default-class {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  padding: 5px 10px;
  text-align: center;
  background-color: var(--bg-gray);
  border-radius: 15px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.default-class:hover {
  background-color: var(--nav-active);
  color: var(--nav-active-item);
}

.active {
  display: flex;
  padding: 5px 10px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  background: var(--nav-active-item);
  color: white;
}
</style>
