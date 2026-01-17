<template>
    <section class="mt-10 grid grid-cols-1 gap-y-6 ">
        <div>
            <div class="flex items-center gap-x-5 text-(--nav-active-item) mb-3">
                <span class="flex items-center bg-(--nav-active)  px-2 py-1 rounded-md">
                    <BaseIconClient name="sparkles"/>
                </span>
                <p>6 results</p>
            </div>
            <h2>Available room</h2>
            <p class="text-(--gradient-primary)">Find your perfect space in the city</p>
        </div>
        <searchBar/>
        <section class="flex items-center gap-x-10 sticky top-0">
            <filterSideBar class="w-[30%]"/>
            <div class="w-[70%]">
                jjj
            </div>
        </section>
    </section>
</template>

<script lang="ts" setup>
import searchBar from '~/features/rooms/components/search-bar.vue';
import filterSideBar from '~/features/rooms/components/filter-side-bar.vue';
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

useSeoMeta({
  title: 'Browse Rooms',
  description: 'Browser your perfect living style',
})
</script>