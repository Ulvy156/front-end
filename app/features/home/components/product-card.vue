<template>
    <article class="rounded-lg cursor-pointer shadow-md p-5 group bg-white">
        <!-- IMAGE WRAPPER -->
        <div class="relative overflow-hidden rounded-md">
            <!-- FLOATING ACTIONS -->
            <div class="floating-actions">
                <div class="flex flex-col justify-between h-[40%] ">
                    <button class="fab">
                        <BaseIcon name="heart" :size="18" />
                    </button>

                    <button class="fab" v-if="!hideCompareIcon">
                        <BaseIcon name="git-compare-arrows" :size="18" />
                    </button>
                </div>

                <div class="fab fab-wide">
                    <BaseIcon name="eye" :size="16" />
                    <span>{{ formatView(totalView) }}</span>
                </div>
            </div>

            <!-- IMAGE -->
            <BaseImage :src="src" format="webp" loading="lazy"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>

        <!-- CONTENT -->
        <div class="flex flex-col gap-y-2 mt-3">
            <h4 class="line-clamp-1">
                ${{ price }}/ {{ $t('home.month') }}
            </h4>

            <p class="line-clamp-1">{{ content }}</p>

            <div class="flex items-center gap-x-2">
                <BaseIcon name="map-pinned" :size="15" />
                <span>{{ location }}</span>
            </div>

            <div class="flex items-center gap-x-5">
                <BaseBadge class="w-fit" type="primary" :content="type" />
                <span class="text-gray-500">{{ size }} m<sup>2</sup></span>
            </div>
        </div>
    </article>

</template>


<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue';
import BaseImage from '~/components/ui/BaseImage.vue';
import { formatView } from '#imports';

const props = withDefaults(defineProps<{
  price: number;
  src: string;
  title: string;
  content: string;
  location: string;
  type: string;
  size: number;
  totalView: number;
  hideCompareIcon?: boolean;
}>(), {
  price: 0,
  src: '',
  title: '',
  content: '',
  location: '',
  type: '',
  size: 0,
  totalView: 0,
  hideCompareIcon: false,
});



</script>


<style scoped>
img {
    /* for every 16 width, the height is 9 */
    aspect-ratio: 16/9;
}

.floating-actions {
    position: absolute;
    right: 10px;
    padding: 10px 0;

    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: space-between;
    height: 100%;
    gap: 10px;

    z-index: 20;
}

/* base floating button */
.fab {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 25px;
    height: 25px;
    padding: 5px;

    border-radius: 25px;

    background: whitesmoke;
    backdrop-filter: blur(10px);

    color: black;
    /* color: #e5e7eb; */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

    cursor: pointer;
    transition: all 0.25s ease;
}

/* hover effect */
.fab:hover {
    /* background: rgba(47, 55, 52, 1); */
    transform: translateY(-2px);
}

/* wider pill for view count */
.fab-wide {
    width: auto;
    padding: 0 14px;
    gap: 8px;
    border-radius: 999px;
    font-size: 14px;
}
</style>
