<template>
  <el-skeleton
    style="width: 100%"
    animated
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5, easing: 'ease-out' }"
  >
    <template #template>
      <!-- Breadcrumb -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px">
        <el-skeleton-item variant="text" style="width: 90px" />
        <el-skeleton-item variant="text" style="width: 90px" />
        <el-skeleton-item variant="text" style="width: 160px" />
      </div>

      <!-- Title + badges + price row -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; margin-bottom: 24px">
        <div style="flex: 1; min-width: 260px">
          <div style="display: flex; gap: 8px; margin-bottom: 12px">
            <el-skeleton-item variant="button" style="width: 90px; height: 26px; border-radius: 8px" />
            <el-skeleton-item variant="button" style="width: 110px; height: 26px; border-radius: 8px" />
          </div>
          <el-skeleton-item variant="h1" style="width: 60%; height: 32px" />
          <div style="margin-top: 14px">
            <el-skeleton-item variant="text" style="width: 45%" />
          </div>
          <div style="margin-top: 10px">
            <el-skeleton-item variant="text" style="width: 35%" />
          </div>
        </div>

        <div style="text-align: right">
          <el-skeleton-item variant="h3" style="width: 100px" />
          <div style="margin-top: 10px">
            <el-skeleton-item variant="text" style="width: 80px" />
          </div>
        </div>
      </div>

      <!-- Two-column layout: gallery + content | sidebar -->
      <div class="skeleton-details-grid">
        <!-- Left column -->
        <div style="display: flex; flex-direction: column; gap: 36px">
          <el-skeleton-item variant="image" style="width: 100%; height: 40dvh; border-radius: 8px" />

          <div v-for="section in 4" :key="section">
            <el-skeleton-item variant="h3" style="width: 30%; margin-bottom: 14px" />
            <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 70%" />
          </div>
        </div>

        <!-- Right sidebar -->
        <div style="display: flex; flex-direction: column; gap: 14px">
          <div style="border: 1px solid var(--border, #e5e7eb); border-radius: 8px; padding: 16px">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px">
              <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
              <el-skeleton-item variant="text" style="width: 60%" />
            </div>
            <el-skeleton-item variant="button" style="width: 100%; height: 40px; border-radius: 8px" />
          </div>
          <el-skeleton-item variant="image" style="width: 100%; height: 90px; border-radius: 8px" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script lang="ts" setup></script>

<style scoped>
.skeleton-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}

@media (min-width: 1024px) {
  .skeleton-details-grid {
    grid-template-columns: 1fr 30%;
    column-gap: 40px;
  }
}
</style>
