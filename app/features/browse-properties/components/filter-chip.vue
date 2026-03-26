<template>
  <div class="flex flex-wrap items-center gap-3">
    <BaseBadge
      type="primary"
      v-for="chip in activeFilters"
      :key="chip.key"
      :content="chip.label"
    >
      <BaseIconClient name="x" @click="removeFilter(chip.key)" />
    </BaseBadge>
  </div>
</template>

<script lang="ts" setup>
import BaseBadge from "~/components/ui/BaseBadge.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";

const filterStore = usePropertyFilterStore();

const activeFilters = computed(() => {
  const chips: { key: string; label: string }[] = [];

  // order by type
  if(filterStore.orderType) {
    chips.push({
      key: "Order by",
      label: `Order By`,
    });
  }
  // amenities
  if(filterStore.amenities.length > 0) {
    chips.push({
      key: "amenities",
      label: `Amenities`,
    });
  }
  // house rules
  if(filterStore.houseRules.length > 0) {
    chips.push({
      key: "houseRules",
      label: `House Rules`,
    });
  }
  
  // Price
  if (filterStore.maxPrice > 0) {
    chips.push({
      key: "price",
      label: `Price: $${filterStore.minPrice || 0} - $${filterStore.maxPrice}`,
    });
  }

  // Location
  if (filterStore.locationName) {
    chips.push({
      key: "location",
      label: filterStore.locationName,
    });
  }

  // Room Type
  if (filterStore.roomType > 0) {
    chips.push({
      key: "roomType",
      label: `Room Type`,
    });
  }

  // Bedroom
  if (filterStore.bedroom > 0) {
    chips.push({
      key: "bedroom",
      label: `${filterStore.bedroom} Bedroom`,
    });
  }

  // Bathroom
  if (filterStore.bathroom > 0) {
    chips.push({
      key: "bathroom",
      label: `${filterStore.bathroom} Bathroom`,
    });
  }

  // Nearest
  if (filterStore.orderType === 3) {
    chips.push({
      key: "nearest",
      label: `Nearest`,
    });
  }

  return chips;
});
function removeFilter(key: string) {
  switch (key) {
    case "price":
      filterStore.minPrice = 0;
      filterStore.maxPrice = 0;
      break;

    case "location":
      filterStore.location = null;
      filterStore.locationName = "";
      break;

    case "roomType":
      filterStore.roomType = 0;
      break;

    case "bedroom":
      filterStore.bedroom = 0;
      break;

    case "bathroom":
      filterStore.bathroom = 0;
      break;

    case "nearest":
      filterStore.orderType = null;
      filterStore.lat = null;
      filterStore.lng = null;
      break;
  }
}
</script>

<style></style>
