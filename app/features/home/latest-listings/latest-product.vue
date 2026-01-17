<template>
    <section class="w-full m-auto my-5">
        <div class="flex items-center text-(--nav-active-item) gap-x-3 mb-2">
            <BaseIcon name="trending-up" :size="22"  />
            <p class="font-bold">{{ $t('home.featured.justListed') }}</p>
        </div>
        <div class="flex justify-between items-center">
            <div>
                <h3>{{ $t('home.latestListings') }}</h3>
                <p class="text-(--gray)">{{ $t('home.featured.newList') }}</p>
            </div>
        </div>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-3 ">
            <productCard 
            v-for="value in latestListings" 
            :key="value.id" 
            :price="value.price"
            :src="value.images[0]?.imageKey ?? ''" 
            :title="value.title" 
            :content="value.title"
            :location="value.district" 
            :type="value.propertyType" 
            :bathroom="value.bathroom"
            :bedroom="value.bedroom" 
            :size="value.sizeSqm" 
            :total-view="value.totalViews"
            :is-available="value.isAvailable"
            :hide-compare-icon="true" />
        </section>
    </section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue';
import productCard from '../components/product-card.vue';
import type { FeaturedProperty } from '../featured-listings/feature.listings';

defineProps<{
    latestListings: FeaturedProperty[]
}>()


</script>
