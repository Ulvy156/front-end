<template>
  <el-skeleton
    v-for="value in numberOfItems"
    :key="value"
    style="width: 100%"
    v-show="!isHide"
    animated
    :initial="{ opacity: 0, y: 20, scale: 0.96 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="{ duration: 0.5, easing: 'ease-out' }"
  >
    <template #template>
      <div v-if="variant === 'horizontal'" style="display: flex; border: 1px solid #ECEFED; border-radius: 12px; overflow: hidden;">
        <el-skeleton-item variant="image" style="width: 148px; flex-shrink: 0; height: auto; border-radius: 0;" />
        <div style="padding: 16px; flex: 1; min-width: 0;">
          <el-skeleton-item variant="text" style="width: 40%; height: 20px; margin-bottom: 12px;" />
          <el-skeleton-item variant="h3" style="width: 80%; margin-bottom: 12px;" />
          <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 12px;" />
          <div style="display: flex; align-items: center; gap: 14px; height: 16px;">
            <el-skeleton-item variant="text" style="width: 20%;" />
            <el-skeleton-item variant="text" style="width: 20%;" />
            <el-skeleton-item variant="text" style="width: 20%;" />
          </div>
        </div>
      </div>
      <template v-else>
        <el-skeleton-item variant="image" style="width: 100%; height: 30dvh" />
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
    </template>
  </el-skeleton>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    numberOfItems?: number;
    isHide?: boolean;
    variant?: 'vertical' | 'horizontal';
  }>(),
  {
    numberOfItems: 3,
    isHide: false,
    variant: 'vertical',
  },
);
</script>
