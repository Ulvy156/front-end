<template>
    <div>
        <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
            <BaseIconClient name="dollar-sign" color="var(--nav-active-item)"/>
            <p>{{ $t("filter.priceRange") }}</p>
        </div>
        <el-slider v-model="price" placement="top" size="small" :max="1000" />
        <div class="flex justify-between font-semibold">
            <span class="price-tag">$0</span>
            <span class="price-tag">$1000+</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';

const filterStore = usePropertyFilterStore()

const price = computed({
  get: () => filterStore.priceRange.max ?? 0,
  set: (val: number) => {
    filterStore.priceRange.max = val
  },
})

</script>