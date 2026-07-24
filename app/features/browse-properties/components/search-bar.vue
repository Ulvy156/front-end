<template>
  <section class=" py-3">
    <!-- <div class="flex items-center gap-x-4">
      <BaseInput
        size="large"
        placeholder="Search by locations, district..."
        v-model="filterStore.locationName"
        icon="search"
      />
      <el-segmented
        size="large"
        v-model="styleGrid.grid"
        :options="directionOptions"
      >
        <template #default="scope">
          <BaseIconClient :name="scope.item.icon" size="18" />
        </template>
      </el-segmented>
    </div> -->
    <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
      <BaseIconClient name="list-ordered" color="var(--nav-active-item)"/>
      <p>{{ $t("filter.order_by") }}</p>
    </div>
    <el-select
      v-model="filterStore.orderType"
      placeholder="Select"
      size="large"
      style="width: 100%"
      :aria-label="$t('filter.order_by')"
    >
      <el-option
        v-for="item in selectOption"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      />
    </el-select>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertySort } from "../composable/usePropertySort";

const { filterStore, sortOptions: selectOption } = usePropertySort()
const directionOptions = [
  { label: "Horizontal", value: 2, icon: "grid-2x2" },
  { label: "Vertical", value: 3, icon: "grid-3x2" },
];
</script>

<style scoped>
.icon {
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.active {
  background-color: #f59f0a;
  color: #493003;
}

.el-segmented {
  --el-segmented-item-selected-color: var(--nav-active-item);
  --el-segmented-item-selected-bg-color: var(--nav-active);
}
</style>
