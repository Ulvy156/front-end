<template>
  <section class="p-7 rounded-lg shadow-md">
    <div class="flex items-center gap-x-3 border-b border-b-(--bg-gray) pb-5">
      <span class="flex items-center text-(--nav-active-item) bg-(--nav-active)  p-2 rounded-md">
        <BaseIconClient name="funnel" />
      </span>
      <h4>{{ $t('filter.title') }}</h4>
    </div>
    <!-- content -->
    <div class="grid grid-cols-1 gap-y-7 mt-5">
      <!-- price range -->
      <div>
        <p class="mb-3">{{ $t("filter.priceRange") }}</p>
        <el-slider v-model="filter.price" placement="top" size="small" :max="1000" />
        <div class="flex justify-between font-semibold">
          <span class="price-tag">$0</span>
          <span class="price-tag">$1000+</span>
        </div>
      </div>

      <!-- locations -->
      <div class="label-parent">
        <filterLocation/>
      </div>

      <!-- property type -->
      <filterProperty/>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { useHomePageQuery } from '~/features/home/composable/useHomePageQuery';
import { usePropertyTypeQuery } from '../composable/properTypeQuery';
import filterLocation from './filter-location.vue';
import filterProperty from './filter-property.vue';

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
  background: rgb(236, 235, 235);
  border-radius: 6px;
}

.label-parent {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  row-gap: calc(var(--spacing) * 3)
    /* 0.75rem = 12px */
  ;
  align-items: center;
  /* height: 20vh;
  overflow-y: auto;
  scrollbar-width: none; */
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

.label-filter>input[type="radio"]:not(:checked) {
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