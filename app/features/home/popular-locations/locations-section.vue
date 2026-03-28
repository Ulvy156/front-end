<template>
    <section class="w-full m-auto my-5">
        <div class="flex flex-col items-center justify-between">
            <div class="flex items-center text-(--nav-active-item) gap-x-3">
                <BaseIcon name="map-plus"  />
                <p class="font-bold">{{ $t('home.location.title') }}</p>
            </div>
            <h3>{{ $t('home.location.title') }}</h3>
            <p>{{ $t('home.location.description') }}</p>
            <!-- <div class="flex gap-x-2 items-center blue">
                <span>See All</span>
                <BaseIcon name="chevrons-right" :size="20" />

            </div> -->
        </div>
        <section class="flex overflow-x-auto gap-7 mt-6 overflow-y-hidden " style="scrollbar-width: none;">
            <article v-for="(value, i) in popularLocations" :key="value.districtId" class="card"
                :style="{ backgroundImage: `url(${featuredListings[i]?.url})` }">
                <div class="overlay"></div>

                <div class="content">
                    <p>{{ value[langKey] }}</p>
                    <p>{{ value.totalListings }} {{ $t('results') }}</p>
                </div>
            </article>

            <skeletonProperty :number-of-items="4" :is-hide="popularLocations.length > 0"/>

        </section>
    </section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import type { PopularDistrict } from '../featured-listings/feature.listings';
import skeletonProperty from "~/components/animation/skeleton-property.vue";
import { useLangKey } from '#imports';

const langKey = useLangKey();


defineProps<{
    popularLocations: PopularDistrict[]
}>()
const currentLng = useCurrentLang();

const featuredListings = shallowRef([
    {
        url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
        title: "BKK1",
        result: 45,
    },
    {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
        title: "Toul Kork",
        result: 35,
    },
    {
        url: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400",
        title: "Riverside",
        result: 55,
    },
    {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
        title: "BKK1",
        result: 65,
    },
    {
        url: "https://imgs.search.brave.com/ogWs1GoK-tgVfjq3Ca_QTRQESyYeZPpcRaDrPclks2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jYW1y/ZWFsdHlzZXJ2aWNl/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wOC9waG5v/bS1wZW5oLWNvbmRv/LXNhbGUtcGhub20t/cGVuaC1yZWFsLWVz/dGF0ZS1yZW50LXNh/bGUtUzEwNzkwNjgy/LmpwZw",
        title: "$300 / month",
        content: "3 Bedroom - Toul Kok",
    },
    {
        url: "https://imgs.search.brave.com/lk4zfgYgQOabQauW5kUbI-pBvDWuMFDwxnNtatwLR-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9scC1j/bXMtcHJvZHVjdGlv/bi5pbWdpeC5uZXQv/MjAxOS0wNi9pU3Rv/Y2tfMDAwMDMxNzE1/NTY0TWVkaXVtLmpw/Zz9hdXRvPWZvcm1h/dCxjb21wcmVzcyZx/PTcyJmZpdD1jcm9w/Jnc9MzYwJmFyPTE6/MQ",
        title: "$300 / month",
        content: "3 Bedroom - Toul Kok",
    },
])
</script>

<style scoped>
.card {
    position: relative;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    border-radius: 12px;
    padding: 20px;
    overflow: hidden;
    aspect-ratio: 16/9;
    min-width: 280px;
    cursor: pointer;
    transition:
        background 0.3s ease-in-out,
        transform 0.3s ease-in-out,
    ;
}

.card:hover>.overlay {
    background: rgba(113, 112, 112, 0.4);
}

.card:hover {
    transform: translateY(-5px);
}

.overlay {
    position: absolute;
    inset: 0;
    background: rgba(32, 32, 32, 0.4);
}

.content {
    position: relative;
    color: white;
    z-index: 1;
}
</style>
