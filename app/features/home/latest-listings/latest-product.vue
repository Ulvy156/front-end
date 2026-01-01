<template>
    <section class="w-full m-auto my-5">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-x-2">
                <BaseIcon name="table-of-contents" :size="22" color="black"/>
                <h3>{{ $t('home.latest_listings') }}</h3>
            </div>
            <!-- <div class="flex gap-x-2 items-center blue">
                <span>See All</span>
                <BaseIcon name="chevrons-right" :size="20"/>

            </div> -->
        </div>
        <section class="grid grid-cols-3 gap-7 mt-3 ">
            <productCard
            v-for="value in featuredListings" :key="value.url"
            :src="value.url"
            :title="value.title"
            :content="value.content"
            />
        </section>
    </section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.vue';
import productCard from '../components/product-card.vue';

const featuredListings = shallowRef([
    {
        url: "https://imgs.search.brave.com/UkZZ8SFWdJ8svAvwOsY532zr5YyXSrpbEUUZC-9cgog/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/MTEwLzcxNy9zbWFs/bC9tb2Rlcm4tY29u/ZG8tdG93bmhvdXNl/cy1pbi1ldmVuaW5n/LWZyZWUtcGhvdG8u/anBn",
        title: "$250 / month",
        content: "2 Bedroom - Toul Kok",
    },
    {
        url: "https://imgs.search.brave.com/n7smA0RNTB9GxCf6qDRXQ_0s2Nou1BT-qlqY_wPXeoQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2FtYm9kaWFwcm9w/ZXJ0eS5hc2lhL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI1LzEw/L0NvbmRvLWZvci1T/YWxlLUNocm95LUNo/YW5ndmFyLVBobm9t/LVBlbmgtMS1CZWRy/b29tLWF0LVRoZS1Q/ZW5pbnN1bGEtOC0x/MjQweDcyMC5qcGc_/dj0xNzYwNTk1OTg3",
        title: "$150 / month",
        content: "1 Bedroom - Chroy Chongvar",
    },
    {
        url: "https://imgs.search.brave.com/P-M6iunlRIqNn0nfTyH4shHLuKfl6IqHjxOvuXAUCAw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8zOTdj/OGM3Mi5kZWxpdmVy/eS5yb2NrZXRjZG4u/bWUvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDgvUGhub20t/UGVuaC1Db25kby1m/b3ItU2FsZS1CZWZv/cmUtQ29uc3RydWN0/aW9uLUJlZ2lucy5q/cGc",
        title: "$100 / month",
        content: "1 Bedroom - Boeung Kok",
    },
])
</script>
