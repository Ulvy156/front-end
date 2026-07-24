<template>
    <div>
        <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
            <BaseIconClient name="dollar-sign" color="var(--nav-active-item)"/>
            <p>{{ $t("filter.priceRange") }}</p>
        </div>
        <div class="flex flex-col sm:flex-row justify-between gap-y-2 sm:gap-x-5 font-semibold">
            <BaseInput type="number" size="small" v-model.number="filter.min" icon="dollar-sign"/>
            <BaseIconClient class="rotate-90 w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10" name="arrow-up-0-1"/>
            <BaseInput type="number" v-model.number="filter.max" icon="dollar-sign"/>
        </div>
        <p v-if="error" class="text-red-500 text-xs mt-2">{{ $t(error.key, error.params ?? {}) }}</p>
    </div>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';
import { useAppSettingsStore } from '~/stores/appSettings';
import BaseInput from '~/components/ui/BaseInput.vue';

const filterStore = usePropertyFilterStore()
const appSettingsStore = useAppSettingsStore()

const filter = ref({
    min: filterStore.minPrice,
    max: filterStore.maxPrice
})

const error = ref<{ key: string, params?: Record<string, number> } | null>(null)

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
    const boundMin = appSettingsStore.minPropertyPrice
    const boundMax = appSettingsStore.maxPropertyPrice

    if (min === 0 && max === 0) {
        error.value = null
        filterStore.minPrice = 0
        filterStore.maxPrice = 0
        return
    }

    if (min >= max) {
        error.value = { key: 'filter.priceRangeInvalid' }
        return
    }

    if (boundMin !== null && max < boundMin) {
        error.value = { key: 'filter.priceRangeTooLow', params: { min: boundMin } }
        return
    }

    if (boundMax !== null && min > boundMax) {
        error.value = { key: 'filter.priceRangeTooHigh', params: { max: boundMax } }
        return
    }

    error.value = null
    filterStore.minPrice = min
    filterStore.maxPrice = max
})
</script>