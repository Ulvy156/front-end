<template>
  <section
    class="p-7 rounded-lg overflow-y-auto bg-(--card)"
    :class="isDrawer ? 'h-full' : 'shadow-md h-[70dvh] sticky top-[20%] z-5'"
  >
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center gap-x-3 border-b border-b-(--bg-gray)">
        <span
          class="flex items-center text-(--nav-active-item) bg-(--nav-active) p-2 rounded-md"
        >
          <BaseIconClient name="funnel" />
        </span>
        <h3 class="text-[1.25rem] font-semibold">{{ $t("filter.title") }}</h3>
      </div>
      <div
        @click="filterStore.reset"
        class="flex items-center gap-x-3 text-(--nav-active-item) bg-(--nav-active) p-2 rounded-md cursor-pointer"
      >
        <el-tooltip
        class="box-item"
        effect="dark"
        :content='$t("filter.clear")'
        placement="top"
      >
        <BaseIconClient name="refresh-ccw" />
      </el-tooltip>
      </div>
    </div>
    <!-- content -->
    <div class="grid grid-cols-1 gap-y-7 mt-5">
      <searchBar/>
      <!-- price range -->
      <filterPrice />

      <!-- locations -->
      <filterLocation />

      <!-- property type -->
      <filterProperty :properties="propertyTypes" />

      <!-- property furnished -->
      <filterFurnished />

      <!-- property amenities -->
      <filterAmenities :amenities="amenities" />

      <!-- property rules -->
      <filterHouseRules :rules="rules" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import filterLocation from "./filter-location.vue";
import filterProperty from "./filter-property.vue";
import filterPrice from "./filter-price.vue";
import filterFurnished from "./filter-furnished.vue";
import filterAmenities from "./filter-amenities.vue";
import filterHouseRules from "./filter-house-rules.vue";
import { usePropertyFilterStore } from '~/stores/propertyFilter';
import { useFilterOptions } from "../composable/useFilterOptions";
import searchBar from "./search-bar.vue";

withDefaults(defineProps<{ isDrawer?: boolean }>(), { isDrawer: false })

const filterStore = usePropertyFilterStore();
const { propertyTypes, amenities, rules } = useFilterOptions();
</script>

<style scoped>
.price-tag {
  padding: 8px 16px;
  background: rgb(236, 235, 235);
  border-radius: 6px;
}

.label-filter {
  display: flex;
  column-gap: 16px;
  align-items: center;
  background: #f3f4f680;
  padding: 12px;
  border-radius: 10px;
  /* border: 1px solid #16a28633; */
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease,
    accent-color 0.3s ease,
    accent-color 0.3s ease,
    font-weight 0.3s ease,
    transform 0.3s ease;
}

.label-filter > input[type="radio"]:not(:checked) {
  appearance: none;
  background-color: #fff;
  font: inherit;
  color: rgb(173, 172, 172);
  width: 0.9em;
  height: 0.9em;
  border: 2px solid rgb(173, 172, 172);
  border-radius: 50%;
}

.label-filter:hover {
  background: var(--nav-active);
  transform: translateY(-1px);
}

.label-filter:has(input[type="radio"]:checked) {
  background: var(--nav-active);
  border: 1px solid #16a28633;
  transform: translateY(-2px);
  color: var(--nav-active-item);
  accent-color: var(--nav-active-item);
  font-weight: bold;
}
</style>
