<template>
    <section class="w-full m-auto my-5">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-x-2">
                <BaseIcon name="text-search" :size="22" color="black" />
                <h3>{{ $t('home.feature_list') }}</h3>
            </div>
            <!-- <div class="flex gap-x-2 items-center blue">
                <span>See All</span>
                <BaseIcon name="chevrons-right" :size="20" />

            </div> -->
        </div>
        <section class="grid grid-cols-3 gap-7 mt-3 ">
            <productCard
            v-for="value in featuredListings" :key="value.id"
            :price="value.price"
            :src="value.images[0]?.imageKey ?? ''"
            :title="value.title"
            :content="value.title"
            :location="`${value.district.province.nameEn} ${value.district.nameEn}`"
            :type="value.propertyType.nameEn"
            :size="value.sizeSqm"
            :total-view="value.totalViews"
            :hide-compare-icon="true"

            />
        </section>
    </section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import productCard from '../components/product-card.vue';
import type { FeaturedProperty } from './feature.listings';

defineProps<{
  featuredListings: FeaturedProperty[]
}>()

</script>
