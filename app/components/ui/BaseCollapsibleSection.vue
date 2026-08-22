<template>
  <el-collapse v-model="activeNames" class="filter-collapse">
    <el-collapse-item name="section">
      <template #title>
        <div class="flex items-center gap-x-2 min-w-0">
          <slot name="header" />
        </div>
      </template>
      <slot />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = withDefaults(defineProps<{ defaultOpen?: boolean }>(), {
  defaultOpen: true,
});

const activeNames = ref(props.defaultOpen ? ["section"] : []);
</script>

<style scoped>
.filter-collapse {
  --el-collapse-border-color: transparent;
  --el-collapse-header-height: auto;
  --el-collapse-header-bg-color: var(--bg-gray);
  --el-collapse-header-text-color: inherit;
  --el-collapse-content-bg-color: transparent;
}

.filter-collapse :deep(.el-collapse-item__header) {
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.filter-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

.filter-collapse :deep(.el-collapse-item__wrap) {
  background-color: transparent;
}
</style>
