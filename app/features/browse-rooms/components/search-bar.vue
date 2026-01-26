<template>
    <section class="sticky md:top-1/6 lg:top-1/8 z-10 bg-white py-3">
        <div class="flex items-center gap-x-4">
            <BaseInput size="large" placeholder="Search by locations, district..." v-model="filterStore.locationName"
                icon="search" />
            <div class="flex items-center rounded-[11px] border border-gray-300">
                <span class="active icon">
                    <BaseIconClient name="grid-3x3" size="18" />
                </span>
                <span class="icon">
                    <BaseIconClient name="layout-panel-left" size="18" />
                </span>
            </div>
            <el-select v-model="filterStore.orderType" placeholder="Select" size="large" style="width: 200px;">
                <el-option v-for="item in selectOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseInput from '~/components/ui/BaseInput.vue';
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';
const filterStore = usePropertyFilterStore()

const selectOption = [
    {
        id: 0,
        label: 'Newest First',
    },
    {
        id: 1,
        label: 'Price: Low to High',
    },
    {
        id: 2,
        label: 'Price: High to Low',
    },
    {
        id: 3,
        label: 'Most Popular',
    }
]

</script>


<style scoped>
.icon {
    padding: 10px 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.active {
    background-color: #f59f0a;
    color: #493003;
}
</style>