<template>
  <div>
    <div class="flex items-center mb-4 gap-x-2 bg-(--bg-gray) p-2 rounded-md">
      <BaseIconClient name="bed" color="var(--nav-active-item)" />
      <p>{{ $t("filter.furnished") }}</p>
    </div>
    <div class="grid grid-cols-1 gap-y-4 mx-2">
      <div>
        <span class="flex items-center mb-1 gap-x-2 text-(--gray)">
          <BaseIconClient name="bed" size="14" color="var(--nav-active-item)" />
          <span>{{ $t("filter.bedroom") }}</span>
        </span>
        <!-- bedroom -->
        <div class="grid grid-cols-4 gap-x-2">
          <span
            v-for="value in bedrooms"
            :key="value.id"
            @click="filterStore.bedroom = value.value"
            :class="activeClass(filterStore.bedroom, value.value)"
          >
            {{ value.label }}
          </span>
        </div>
      </div>
      <!-- bathroom -->
      <div>
        <span class="flex items-center mb-1 gap-x-2 text-(--gray)">
          <BaseIconClient
            name="bath"
            size="14"
            color="var(--nav-active-item)"
          />
          <span>{{ $t("filter.bathroom") }}</span>
        </span>
        <div class="grid grid-cols-4 gap-x-2">
          <span
            v-for="value in bathrooms"
            :key="value.id"
            @click="filterStore.bathroom = value.value"
            :class="activeClass(filterStore.bathroom, value.value)"
          >
            {{ value.label }}
          </span>
        </div>
      </div>
      <!-- furnishing -->
      <!-- <div>
        <span class="flex items-center mb-1 gap-x-2 text-(--gray)">
          <BaseIconClient
            name="bath"
            size="14"
            color="var(--nav-active-item)"
          />
          <span>{{ $t("filter.furnishing") }}</span>
        </span>
        <div class="grid grid-cols-3 gap-x-2">
          <span
            v-for="value in furnishing"
            :key="value.id"
            @click="filterStore.furnishing = value.value"
            :class="activeClass(filterStore.furnishing, value.value)"
          >
            {{ value.label }}
          </span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyFilterStore } from "~/stores/propertyFilter";

const filterStore = usePropertyFilterStore();
const bedrooms = readonly([
  {
    id: "bd1",
    label: "Any",
    value: 0,
  },
  {
    id: "bd2",
    label: "1",
    value: 1,
  },
  {
    id: "bd3",
    label: "2",
    value: 2,
  },
  {
    id: "bd4",
    label: "3+",
    value: 3,
  },
]);
const bathrooms = readonly([
  {
    id: "bh1",
    label: "Any",
    value: 0,
  },
  {
    id: "bh2",
    label: "1",
    value: 1,
  },
  {
    id: "bh3",
    label: "2",
    value: 2,
  },
  {
    id: "fn4",
    label: "3+",
    value: 3,
  },
]);
const furnishing = readonly([
  {
    id: "fn1",
    label: "Any",
    value: 0,
  },
  {
    id: "fn2",
    label: "Furnished",
    value: 1,
  },
  {
    id: "fn3",
    label: "Unfurnished",
    value: 2,
  },
]);

function activeClass(mainId: number, subId: number) {
  return mainId === subId ? "active" : "default-class";
}
</script>

<style scoped>
.default-class {
  padding: 5px;
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
  padding: 5px;
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
