<template>
    <div>
        <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
            <BaseIconClient name="dollar-sign" color="var(--nav-active-item)"/>
            <p>{{ $t("filter.priceRange") }}</p>
        </div>
        <div class="flex justify-between gap-x-5 font-semibold">
            <BaseInput type="number" size="small" v-model.number="filter.min" icon="dollar-sign"/>
            <BaseIconClient class="rotate-90" size="40" name="arrow-up-0-1"/>
            <BaseInput type="number" v-model.number="filter.max" icon="dollar-sign"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';
import BaseInput from '~/components/ui/BaseInput.vue';

const filterStore = usePropertyFilterStore()

const filter = ref({
    min: 0,
    max: 0
})

watch(filter.value, () => {
    if(filter.value.min < filter.value.max && filter.value.max >= 30) {
        filterStore.minPrice = filter.value.min;
        filterStore.maxPrice = filter.value.max;
    }
})
</script>