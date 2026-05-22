<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  leading?: 'circle' | 'square' | 'none'
  leadingSize?: string
  lines?: number
  animated?: boolean
}>(), {
  rows: 4,
  leading: 'none',
  leadingSize: '40px',
  lines: 2,
  animated: true,
})
</script>

<template>
  <div class="space-y-3">
    <el-skeleton v-for="n in rows" :key="n" :animated="animated" :rows="0">
      <template #template>
        <slot>
          <div class="flex items-center gap-3">
            <el-skeleton-item
              v-if="leading === 'circle'"
              variant="circle"
              :style="`width: ${leadingSize}; height: ${leadingSize}; flex-shrink: 0;`"
            />
            <el-skeleton-item
              v-else-if="leading === 'square'"
              variant="image"
              :style="`width: ${leadingSize}; height: ${leadingSize}; border-radius: 8px; flex-shrink: 0;`"
            />
            <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
              <el-skeleton-item variant="text" style="width: 65%; height: 14px;" />
              <el-skeleton-item v-if="lines >= 2" variant="text" style="width: 40%; height: 12px;" />
              <el-skeleton-item v-if="lines >= 3" variant="text" style="width: 80%; height: 12px;" />
            </div>
          </div>
        </slot>
      </template>
    </el-skeleton>
  </div>
</template>
