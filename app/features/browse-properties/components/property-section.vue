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
    />
    <BasePagination
      :total="meta?.total ?? 0"
      :page-size="6"
      :current-page="filterStore.page"
      @update:current-page="filterStore.page = $event"
    />
  </section>
</template>

<script lang="ts" setup>
import propertyCard from "./property-card.vue";
import type { Meta, PropertyCardItem } from "../interface/property-card-item";
import { debounce } from "lodash-unified";
import BasePagination from "~/components/ui/BasePagination.vue";

const filterStore = usePropertyFilterStore();
const api = useApi();
const isFetching = ref(true);
const { data, status, error, refresh } = useAsyncData("browse-properties", () =>
  api
    .post("/property/browse-properties", {
      ...filterStore.queryParams,
    })
    .then((res) => res.data)
    .finally(() => (isFetching.value = false)),
);

const items = computed<PropertyCardItem[]>(() => data.value?.items ?? []);
const meta = computed<Meta>(() => data.value?.meta);
// debounce refresh
const debouncedRefresh = debounce(() => {
  refresh();
}, 1000);

// watch filters
watch(
  () => filterStore.queryParams,
  () => {
    isFetching.value = true;

    debouncedRefresh();
  },
  { deep: true },
);

watch(items, ()=>{
  filterStore.result = items.value.length;
})

onMounted(async () => {
  await refresh();
});
</script>
