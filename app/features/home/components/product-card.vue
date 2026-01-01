<template>
    <article class="rounded-lg cursor-pointer shadow-md p-5 group relative">
        <div class="flex flex-col justify-end w-[80%] absolute m-2 z-1">
            <!-- <span class="bg-white/60 backdrop-blur rounded-full p-1 size-8 z-1 flex items-center justify-center  ">
                <BaseIcon name="heart" :size="20" color="black" />
            </span> -->

            <div class="flex items-center gap-x-2 px-3 py-1 rounded-full w-fit h-fit
                        bg-white/60 backdrop-blur
                        border-none
                        shadow-sm">
                <BaseIcon name="eye" :size="14" color="black" />
                <span class="text-sm font-medium text-black">238</span>
            </div>
        </div>
        <NuxtImg :src="src" format="webp" loading="lazy"
            class="w-full rounded-md object-cover mb-2 transition-transform duration-500 group-hover:scale-105 " />
        <div class="flex flex-col gap-y-2">
            <h4>{{ title }}</h4>
            <p>{{ content }}</p>
            <div class="flex items-center gap-x-2">
                <BaseIcon name="map-pinned" :size="15" />
                <span>BKK1</span>
            </div>
            <BaseBadge class="w-fit" type="primary" content="Studio" />
        </div>

    </article>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.vue';
import BaseBadge from '~/components/ui/BaseBadge.vue';

const props = defineProps<{
    src: string
    title: string,
    content: string
}>();

</script>


<style scoped>
img {
    /* for every 16 width, the height is 9 */
    aspect-ratio: 16/9;
}
</style>
