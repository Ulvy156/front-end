<template>
  <section class="sticky top-0 z-10 p-5 rounded-md bg-(--bg-card)">
    <div class="flex items-center gap-x-3 border-b border-b-(--bg-gray) pb-5">
      <span class="flex items-center text-(--hover-text-color) bg-(--active-bg)  p-2 rounded-md">
        <BaseIconClient name="funnel" />
      </span>
      <h4>Filters</h4>
    </div>
    <!-- content -->
    <div class="grid grid-cols-1 gap-y-7 mt-5">
      <!-- price range -->
      <div>
        <p class="mb-3">{{ $t("filter.price_range") }}</p>
        <el-slider v-model="filter.price" placement="top" size="small" :max="1000" />
        <div class="flex justify-between font-semibold">
          <span class="price-tag">$0</span>
          <span class="price-tag">$1000+</span>
        </div>
      </div>

      <!-- locations -->
      <div class="label-parent">
        <p>{{ $t("filter.location") }}</p>
        <label class="label-filter"
          v-for="value in location?.popularLocations" :key="value.districtId" 
          :for="value.districtId.toString()"
          @click="filter.location = value.districtId">
          <input :id="value.districtId.toString()" type="radio" :checked="filter.location === value.districtId">
          <p>{{ value.nameEn }}</p>
        </label>
      </div>

      <!-- property type -->
      <div class="label-parent">
        <p>{{ $t("filter.room_type") }}</p>
        <label class="label-filter"
         v-for="value in properties" :value="value.id" :key="value.id" 
         :for="value.id.toString()"
          @click="filter.propertyType = value.id">
          <input :id="value.id.toString()" type="radio" :checked="filter.propertyType === value.id">
          <p>{{ value.nameEn }}</p>
        </label>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { useHomePageQuery } from '~/features/home/composable/useHomePageQuery';
import { usePropertyTypeQuery } from '../composable/properTypeQuery';

const { data: location, isFetched } = useHomePageQuery()
const { data: properties } = usePropertyTypeQuery()

const filter = reactive({
  price: 0,
  location: 0,
  propertyType: 0
})

watch(
  [isFetched, location, properties],
  ([fetched, loc, props]) => {
    if (!fetched) return

    filter.location = loc?.popularLocations?.[0]?.districtId ?? 0
    filter.propertyType = props?.[0]?.id ?? 0
  },
  { immediate: true }
)

</script>

<style scoped>
.price-tag {
  padding: 8px 16px;
  background: var(--bg-gray);
  border-radius: 6px;
}

.label-parent {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  row-gap: calc(var(--spacing) * 3) /* 0.75rem = 12px */;
  align-items: center;
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
  background: var(--bg-gray);
  transform: translateY(-1px);
}

.label-filter:has(input[type="radio"]:checked) {
  background: var(--active-bg);
  border: 1px solid #16a28633;
  transform: translateY(-2px);
  color: var(--hover-text-color);
  accent-color: var(--hover-text-color);
  font-weight: bold;
}

</style>