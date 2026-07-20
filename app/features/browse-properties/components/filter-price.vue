<template>
    <div>
        <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
            <BaseIconClient name="dollar-sign" color="var(--nav-active-item)"/>
            <p>{{ $t("filter.priceRange") }}</p>
        </div>
        <div class="flex flex-col sm:flex-row justify-between gap-y-2 sm:gap-x-5 font-semibold">
            <BaseInput type="number" size="small" v-model.number="filter.min" icon="dollar-sign"/>
            <BaseIconClient class="rotate-90" size="40" name="arrow-up-0-1"/>
            <BaseInput type="number" v-model.number="filter.max" icon="dollar-sign"/>
        </div>
        <p v-if="errorKey" class="text-red-500 text-xs mt-2">{{ $t(errorKey) }}</p>
    </div>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';
import BaseInput from '~/components/ui/BaseInput.vue';

const filterStore = usePropertyFilterStore()

const filter = ref({
    min: filterStore.minPrice,
    max: filterStore.maxPrice
})

const errorKey = ref('')

// Keep the local staging values in sync when the store changes from outside
// this component (restored from the persisted cookie, or "Clear filters").
watch(
    () => [filterStore.minPrice, filterStore.maxPrice],
    ([min, max]) => {
        filter.value.min = min
        filter.value.max = max
    },
)

watch(filter.value, () => {
    const { min, max } = filter.value

    if (min === 0 && max === 0) {
        errorKey.value = ''
        filterStore.minPrice = 0
        filterStore.maxPrice = 0
        return
    }

    if (min >= max) {
        errorKey.value = 'filter.priceRangeInvalid'
        return
    }

    if (max < 30) {
        errorKey.value = 'filter.priceRangeTooLow'
        return
    }

    errorKey.value = ''
    filterStore.minPrice = min
    filterStore.maxPrice = max
})
</script>