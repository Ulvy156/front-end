<template>
  <div>
    <div class="flex items-center mb-4 gap-x-2 bg-(--bg-gray) p-2 rounded-md">
      <BaseIconClient name="sparkles" color="var(--nav-active-item)" />
      <p>{{ $t("filter.rules") }}</p>
      <span
        v-show="selectedItems > 0"
        class="p-1 size-5 flex items-center justify-center rounded-full bg-(--nav-active-item) text-white font-bold"
        >{{ selectedItems }}</span
      >
    </div>
    <div class="flex flex-wrap gap-2 mx-2">
      <span
        v-for="value in rules"
        :key="value.id"
        @click="onSelect(value.id)"
        :class="activeClass(value.id)"
      >
        <BaseIconClient :name="value.icon" />
        {{ value.nameEn }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyRuleOptions } from "../composable/usePropertyRuleOptions";
import { usePropertyFilterStore } from '~/stores/propertyFilter';

const { data: rules } = usePropertyRuleOptions();
const filterStore = usePropertyFilterStore();


function activeClass(subId: number) {
  return filterStore.houseRules.includes(subId) ? "active" : "default-class";
}

function onSelect(id: number) {
  if (filterStore.houseRules.includes(id)) {
    filterStore.houseRules = filterStore.houseRules.filter((value) => value !== id);
    return;
  }

  filterStore.houseRules = [...filterStore.houseRules, id];
}
const selectedItems = computed(() => filterStore.houseRules.length);
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
