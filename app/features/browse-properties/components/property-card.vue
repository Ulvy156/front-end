<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{ opacity: 1, y: 0 }"
    :hovered="{ y: -5 }"
    class="card"
    @click="$router.push(`/properties/details/${item.id}`)"
  >
    <!-- IMAGE WRAPPER -->
    <div class="relative overflow-hidden rounded-md">
      <!-- FLOATING ACTIONS -->
      <div class="floating-actions">
        <div class="flex flex-col justify-between h-[40%]">
          <button class="fab">
            <BaseIcon name="heart" :size="18" />
          </button>

          <button class="fab" v-if="!hideCompareIcon">
            <BaseIcon name="git-compare-arrows" :size="18" />
          </button>
        </div>

        <div class="fab fab-wide">
          <BaseIcon name="eye" :size="16" />
          <span>{{ formatView(props.item.totalViews) }}</span>
        </div>
      </div>

      <!-- IMAGE -->
      <BaseImage :src="src" class="w-full object-cover aspect-16/5" />
    </div>

    <!-- CONTENT -->
    <div class="flex flex-col gap-y-4 mt-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <h4 class="text-(--nav-active-item)">${{ props.item.price }}</h4>
          <p class="ml-1">/{{ $t("month") }}</p>
        </div>
        <span
          class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full"
        >
          <BaseIcon name="check" :size="16" />
          {{ isAvailable }}
        </span>
      </div>

      <div>
        <p class="line-clamp-1">{{ props.item.title }}</p>

        <div class="flex items-center gap-x-2 text-gray-500 mt-2">
          <BaseIcon name="map-pinned" :size="15" />
          <span>{{ location }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-6">
          <div class="amenities">
            <BaseTooltip :content="$t('card.bathroom')">
              <BaseIcon name="bath" :size="14" />
            </BaseTooltip>
            <span>{{ props.item.bathroom }}</span>
          </div>

          <div class="amenities">
            <BaseTooltip :content="$t('card.bedroom')">
              <BaseIcon name="bed-double" :size="14" />
            </BaseTooltip>
            <span>{{ props.item.bedroom }}</span>
          </div>

          <div class="amenities">
            <BaseTooltip :content="$t('card.size')">
              <BaseIcon name="expand" :size="13" />
            </BaseTooltip>
            <span>{{ props.item.sizeSqm }} m<sup>2</sup></span>
          </div>
        </div>
        <span
          class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full"
        >
          <BaseIcon :name="item.propertyType.icon" size="12" />
          {{ type }}
        </span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import BaseIcon from "~/components/ui/BaseIcon.client.vue";
import BaseImage from "~/components/ui/BaseImage.vue";
import BaseTooltip from "~/components/ui/BaseTooltip.vue";
import { formatView } from "#imports";
import type { PropertyCardItem } from "../interface/property-card-item";

const props = withDefaults(
  defineProps<{
    item: PropertyCardItem;
    hideCompareIcon?: boolean;
  }>(),
  {
    hideCompareIcon: false,
  },
);

const visible = ref<boolean[]>([]);
// image src
const src = computed(() => props.item.images?.[0]?.imageKey ?? "");
// location text
const location = computed(() =>
  useCurrentLang().value === "en"
    ? `${props.item.district.province.nameEn} ${props.item.district.nameEn}`
    : `${props.item.district.province.nameKh} ${props.item.district.nameKh}`,
);

// property type text
const type = computed(() =>
  useCurrentLang().value === "en"
    ? props.item.propertyType.nameEn
    : props.item.propertyType.nameKh,
);

// availability label
const isAvailable = computed(() =>
  props.item.isAvailable
    ? useCurrentLang().value === "en"
      ? "Available"
      : "ទំនេរ"
    : useCurrentLang().value === "en"
      ? "Unavailable"
      : "មិនទំនេរ",
);
</script>

<style scoped>
.card {
  border-radius: 8px;
  /* rounded-lg */
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  /* shadow-md */

  padding: 20px;
  /* p-5 */
  background: var(--card);
  /* bg-(--card) */

  transition:
    transform 0.5s ease-out,
    box-shadow 0.5s ease-out,
    color 0.5s ease-out;
}

.card:hover {
  /* transform: translateY(-10px); */
  /* hover:-translate-y-1 */
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  /* hover:shadow-xl */

  color: var(--nav-active-item) !important;
  /* hover:text-(--nav-active-item) */
}

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
