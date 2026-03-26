<template>
  <div>
    <div class="flex items-center mb-4 gap-x-2 bg-(--bg-gray) p-2 rounded-md">
      <BaseIconClient name="house" color="var(--nav-active-item)" />
      <p>{{ $t("filter.roomType") }}</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        @click="selectedId = 0"
        :class="activeClass(0)"
      >
        {{ $t("all") }}
      </span>
      <span
        v-for="value in properties"
        :key="value.id"
        @click="selectedId = value.id"
        :class="activeClass(value.id)"
      >
        {{ value.nameEn }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePropertyFilterStore } from "~/stores/propertyFilter";
import { usePropertyTypeQuery } from "../composable/properTypeQuery";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";

const { data: properties } = usePropertyTypeQuery();
const filterStore = usePropertyFilterStore()


function activeClass(subId: number) {
  return selectedId.value === subId ? "active" : "default-class";
}

const selectedId = computed({
  get: () => filterStore.roomType ?? 0,
  set: (val: number) => {
    filterStore.roomType = val
  },
})
</script>

<style scoped>
.default-class {
  padding: 5px 8px;
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
  padding: 5px 8px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  background: var(--nav-active-item);
  color: white;
}
</style>
