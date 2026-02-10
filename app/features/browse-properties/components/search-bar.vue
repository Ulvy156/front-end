<template>
  <section class=" py-3">
    <div class="flex items-center gap-x-4">
      <BaseInput
        size="large"
        placeholder="Search by locations, district..."
        v-model="filterStore.locationName"
        icon="search"
      />
      <!-- <el-segmented
        size="large"
        v-model="styleGrid.grid"
        :options="directionOptions"
      >
        <template #default="scope">
          <BaseIconClient :name="scope.item.icon" size="18" />
        </template>
      </el-segmented> -->
      <el-select
        v-model="filterStore.orderType"
        placeholder="Select"
        size="large"
        style="width: 200px"
      >
        <el-option
          v-for="item in selectOption"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseInput from "~/components/ui/BaseInput.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyFilterStore } from "~/stores/propertyFilter";

const filterStore = usePropertyFilterStore();
const selectOption = [
  {
    id: 0,
    label: "Newest First",
  },
  {
    id: 1,
    label: "Price: Low to High",
  },
  {
    id: 2,
    label: "Price: High to Low",
  },
  {
    id: 3,
    label: "Most Popular",
  },
];
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
