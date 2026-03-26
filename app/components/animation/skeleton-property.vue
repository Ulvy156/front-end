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
  </el-skeleton>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    numberOfItems?: number;
    isHide: boolean;
  }>(),
  {
    numberOfItems: 3,
    isHide: false,
  },
);
</script>
