<template>
  <section class="grid grid-cols-2 gap-5">
    <el-skeleton
      v-for="value in 6"
      :key="value"
      style="width: 100%"
      animated
      v-show="isFetching"
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
    <NuxtImg
      v-show="items.length === 0 && !isFetching"
      class="col-span-full m-auto"
      :initial="{ opacity: 0, y: 20, scale: 0.96 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.5, easing: 'ease-out' }"
      src="/not-found.png"
      width="500"
      height="500"
    />

    <propertyCard
      v-show="items.length > 0 && !isFetching"
      v-for="value in items"
      :key="value.id"
      :item="value"
      @compare="drawerVisible = $event"
    />
    <BasePagination
      class="col-span-full"
      :total="meta?.total ?? 0"
      :page-size="6"
      :current-page="filterStore.page"
      @update:current-page="filterStore.page = $event"
    />
  </section>

  <drawerComponent v-model:visible="drawerVisible"/>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue";
import propertyCard from "./property-card.vue";
import BasePagination from "~/components/ui/BasePagination.vue";
import { useBrowseProperties } from "../composable/useBrowseProperties";
const drawerComponent = defineAsyncComponent(() => import('./compare-drawer.vue'))

const drawerVisible = ref(false)
const { filterStore, isFetching, items, meta } = useBrowseProperties()
</script>
