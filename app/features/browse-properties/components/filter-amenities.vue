<template>
  <div>
    <div class="flex items-center mb-4 gap-x-2 bg-(--bg-gray) p-2 rounded-md">
      <BaseIconClient name="sparkles" color="var(--nav-active-item)" />
      <p>{{ $t("filter.amenity") }}</p>
      <span
        v-show="selectedItems > 0"
        class="p-1 size-5 flex items-center justify-center rounded-full bg-(--nav-active-item) text-white font-bold"
        >{{ selectedItems }}</span
      >
    </div>
    <div class="flex flex-wrap gap-2 mx-2">
      <span
        v-for="value in amenities"
        :key="value.id"
        @click="onSelect(value.id)"
        :class="activeClass(value.id)"
      >
        <BaseIconClient :name="value.icon" />
        {{ value[langKey] }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropertyAmenityOption } from "../services/browse-properties";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyFilterStore } from '~/stores/propertyFilter';

defineProps<{ amenities: PropertyAmenityOption[] }>();
const filterStore = usePropertyFilterStore();
const langKey = useLangKey();

function activeClass(subId: number) {
  return filterStore.amenities.includes(subId) ? "active" : "default-class";
}
function onSelect(id: number) {
  if (filterStore.amenities.includes(id)) {
    filterStore.amenities = filterStore.amenities.filter((value) => value !== id);
    return;
  }

  filterStore.amenities = [...filterStore.amenities, id];
}
const selectedItems = computed(() => filterStore.amenities.length);


</script>

<style scoped>
.default-class {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  padding: 5px 10px;
  text-align: center;
  background-color: var(--bg-gray);
  border-radius: 15px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.default-class:hover {
  background-color: var(--nav-active);
  color: var(--nav-active-item);
}

.active {
  display: flex;
  padding: 5px 10px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  background: var(--nav-active-item);
  color: white;
}
</style>
