<template>
    <section class="mt-10 grid grid-cols-1 gap-y-6 ">
        <div>
            <div class="flex items-center gap-x-5 text-(--nav-active-item) mb-3">
                <span class="flex items-center bg-(--nav-active)  px-2 py-1 rounded-md">
                    <BaseIconClient name="sparkles"/>
                </span>
                <p class=" lowercase">{{ filterStore.result }} {{ $t('results') }}</p>
            </div>
            <h2>{{$t('filter.available')}}</h2>
            <p class="text-(--gradient-primary)">{{ $t("filter.description") }}</p>
        </div>
        <searchBar/>
        <section class="flex justify-between gap-x-10">
            <filterSideBar class="w-[25%]"/>
            <div class="w-[75%]">
                <propertySection/>
            </div>
        </section>
    </section>
</template>

<script lang="ts" setup>
import searchBar from '~/features/browse-properties/components/search-bar.vue';
import filterSideBar from '~/features/browse-properties/components/filter-side-bar.vue';
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import propertySection from '~/features/browse-properties/components/property-section.vue';
import { usePropertyFilterStore } from '~/stores/propertyFilter';

const filterStore = usePropertyFilterStore();

useSeoMeta({
  title: 'Browse Properties',
  description: 'Browser your perfect living style',
})
</script>