<template>
    <article class="rounded-lg cursor-pointer shadow-md
         transition-all duration-500 ease-out
         hover:-translate-y-1 hover:shadow-xl
         p-5 group bg-white">
        <!-- IMAGE WRAPPER -->
        <div class="relative overflow-hidden rounded-md">
            <!-- FLOATING ACTIONS -->
            <div class="floating-actions">
                <div class="flex flex-col justify-between h-[40%] ">
                    <!-- <div class="flex items-center gap-x-2 fab">
                        <BaseIcon name="badge-check" />
                        <span>{{ isAvailable }}</span>
                    </div> -->
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
            <BaseImage :src="src"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-16/5" />
        </div>

        <!-- CONTENT -->
        <div class="flex flex-col gap-y-4 mt-3">
            <div class="flex justify-between items-center">
                <h4 class="flex  items-center">
                    ${{ price }}<p class="ml-1">/{{ $t('home.month') }}</p>
                </h4>
                <BaseBadge class="w-fit" type="primary" :content="isAvailable">
                    <BaseIcon name="check" :size="16" />
                </BaseBadge>
            </div>

            <div>
                <p class="line-clamp-1">{{ content }}</p>

                <div class="flex items-center gap-x-2 text-gray-500">
                    <BaseIcon name="map-pinned" :size="15" />
                    <p>{{ location }}</p>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-x-6">
                    <div class="amenities">
                        <BaseTooltip :content="$t('card.bathroom')">
                            <BaseIcon name="bath" :size="14" />
                        </BaseTooltip>
                        <span>{{ bathroom }}</span>
                    </div>

                    <div class="amenities">
                        <BaseTooltip :content="$t('card.bedroom')">
                            <BaseIcon name="bed-double" :size="14" />
                        </BaseTooltip>
                        <span>{{ bedroom }}</span>
                    </div>

                    <div class="amenities">
                        <BaseTooltip :content="$t('card.size')">
                            <BaseIcon name="expand" :size="13" />
                        </BaseTooltip>
                        <span>{{ size }} m<sup>2</sup></span>
                    </div>
                </div>
                <BaseBadge class="w-fit" type="primary" :content="type" />

            </div>

        </div>
    </article>

</template>


<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue';
import BaseImage from '~/components/ui/BaseImage.vue';
import BaseTooltip from '~/components/ui/BaseTooltip.vue';
import { formatView } from '#imports';

const props = withDefaults(defineProps<{
    price: number;
    src: string;
    title: string;
    content: string;
    bathroom: number;
    bedroom: number;
    isAvailable: boolean,
    location: {
        nameEn: string
        nameKh: string
        province: {
            nameEn: string
            nameKh: string
        }
    };
    type: {
        nameEn: string,
        nameKh: string,
    };
    size: number;
    totalView: number;
    hideCompareIcon?: boolean;
}>(), {
    price: 0,
    src: '',
    title: '',
    content: '',
    size: 0,
    totalView: 0,
    hideCompareIcon: false,
});

const location = computed(() => useCurrentLang().value == 'en' ?
    `${props.location.province.nameEn} ${props.location.nameEn}` :
    `${props.location.province.nameKh} ${props.location.nameKh}`);

const type = computed(() => useCurrentLang().value == 'en' ? props.type.nameEn : props.type.nameKh);
const isAvailable = computed(() => useCurrentLang().value == 'en' ? 'Available' : 'ទំនេរ');

</script>


<style scoped>
img {
    /* for every 16 width, the height is 9 */
    aspect-ratio: 16/9;
}

.floating-actions {
    color: var(--hover-text-color);
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

    background: #f9fbfa;
    backdrop-filter: blur(2px);

    color: #628478;
    /* color: #e5e7eb; */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

    cursor: pointer;
    transition: all 0.25s ease;
}

/* hover effect */
.fab:hover {
    color: var(--hover-text-color);
    background: var(--active-bg);
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

.amenities {
    display: flex;
    align-items: center;
    column-gap: 5px;
}
</style>
