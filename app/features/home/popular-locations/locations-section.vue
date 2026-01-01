<template>
    <section class="w-full m-auto my-5">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-x-2">
                <BaseIcon name="map-pinned" :size="22" color="black" />
                <h3>{{ $t('home.popular_location') }}</h3>
            </div>
            <div class="flex gap-x-2 items-center blue">
                <span>See All</span>
                <BaseIcon name="chevrons-right" :size="20" />

            </div>
        </div>
        <section class="grid grid-cols-4 gap-7 mt-3">
            <article v-for="value in featuredListings" :key="value.url" class="card"
                :style="{ backgroundImage: `url(${value.url})` }">
                <div class="overlay"></div>

                <div class="content">
                    <p>{{ value.title }}</p>
                    <p>{{ value.result }} results</p>
                </div>
            </article>

        </section>
    </section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.vue';

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
    // {
    //     url: "https://imgs.search.brave.com/ogWs1GoK-tgVfjq3Ca_QTRQESyYeZPpcRaDrPclks2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jYW1y/ZWFsdHlzZXJ2aWNl/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wOC9waG5v/bS1wZW5oLWNvbmRv/LXNhbGUtcGhub20t/cGVuaC1yZWFsLWVz/dGF0ZS1yZW50LXNh/bGUtUzEwNzkwNjgy/LmpwZw",
    //     title: "$300 / month",
    //     content: "3 Bedroom - Toul Kok",
    // },
    // {
    //     url: "https://imgs.search.brave.com/ogWs1GoK-tgVfjq3Ca_QTRQESyYeZPpcRaDrPclks2w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jYW1y/ZWFsdHlzZXJ2aWNl/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8wOC9waG5v/bS1wZW5oLWNvbmRv/LXNhbGUtcGhub20t/cGVuaC1yZWFsLWVz/dGF0ZS1yZW50LXNh/bGUtUzEwNzkwNjgy/LmpwZw",
    //     title: "$300 / month",
    //     content: "3 Bedroom - Toul Kok",
    // },
])
</script>

<style scoped>
.card {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
  aspect-ratio: 16/9;
  cursor: pointer;
}

.card:hover > .overlay {
    background: rgba(113, 112, 112, 0.4); 
    transition: background 0.5s;
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
