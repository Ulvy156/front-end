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
import BaseInput from "~/components/ui/BaseInput.vue";
import { usePropertyFilterStore } from "~/stores/propertyFilter";
import { getCurrentLocation } from "#imports";
import { useNotify } from "#imports";
import { checkLocationPermission } from "#imports";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";

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
  {
    id: 4,
    label: "Nearest Location",
  },
];
const directionOptions = [
  { label: "Horizontal", value: 2, icon: "grid-2x2" },
  { label: "Vertical", value: 3, icon: "grid-3x2" },
];

watch(
  () => filterStore.orderType,
  async (newVal) => {
    // empty location when user chose other
    if (newVal !== 4) {
      filterStore.lat = null;
      filterStore.lng = null;
      return;
    }

    try {
      
      const status = await checkLocationPermission();
      if (status === 'denied') {
        useNotify().warning(
          'Location access is blocked. Please enable it in your browser settings.',
        );

        filterStore.orderType = null;
        return
      }

      const location = await getCurrentLocation()
      

      filterStore.lat = location.latitude
      filterStore.lng = location.longitude

    } catch (err) {
      // Reset back to default sorting
      filterStore.orderType = null;

      // Show notification
      useNotify().warning(
        'We can’t show nearest properties because location access was denied.',
      );
    }
  }
)


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
