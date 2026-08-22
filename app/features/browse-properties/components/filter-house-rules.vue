<template>
  <BaseCollapsibleSection :default-open="defaultOpen">
    <template #header>
      <BaseIconClient name="sparkles" color="var(--nav-active-item)" />
      <p>{{ $t("filter.rules") }}</p>
      <span
        v-show="selectedItems > 0"
        class="p-1 size-5 flex items-center justify-center rounded-full bg-(--nav-active-item) text-white font-bold"
        >{{ selectedItems }}</span
      >
    </template>
    <div class="flex flex-wrap gap-2 mx-2">
      <FilterTagChip
        v-for="value in rules"
        :key="value.id"
        :active="filterStore.houseRules.includes(value.id)"
        @click="onSelect(value.id)"
      >
        <BaseIconClient :name="value.icon" />
        {{ value[langKey] }}
      </FilterTagChip>
    </div>
  </BaseCollapsibleSection>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseCollapsibleSection from "~/components/ui/BaseCollapsibleSection.vue";
import FilterTagChip from "./filter-tag-chip.vue";
import type { PropertyRuleOption } from "../services/browse-properties";
import { usePropertyFilterStore } from '~/stores/propertyFilter';

withDefaults(
  defineProps<{ rules: PropertyRuleOption[]; defaultOpen?: boolean }>(),
  { defaultOpen: true },
);
const filterStore = usePropertyFilterStore();
const langKey = useLangKey();

function onSelect(id: number) {
  if (filterStore.houseRules.includes(id)) {
    filterStore.houseRules = filterStore.houseRules.filter((value) => value !== id);
    return;
  }

  filterStore.houseRules = [...filterStore.houseRules, id];
}
const selectedItems = computed(() => filterStore.houseRules.length);
</script>
