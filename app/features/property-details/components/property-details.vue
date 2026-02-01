<template>
  <section class="flex gap-x-10">
    <section class="w-[65%]">
      <el-carousel
        height="60dvh"
indicator-position="outside"
        arrow="always"
        :autoplay="false"
        class="property-carousel "
      >
        <el-carousel-item
          v-for="item in property?.images"
          :key="item?.imageKey"
          class="carousel-item"
        >
          <BaseImage :src="item.imageKey" class="carousel-img" />
        </el-carousel-item>
      </el-carousel>
      <div class="flex items-center gap-x-4">
        <!-- property type -->
        <span
          class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
        >
          <BaseIconClient :name="property?.propertyType.icon ?? ''" size="12" />
          {{ type }}
        </span>
        <!-- featured -->
        <span
          v-if="property?.isFeatured"
          class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
        >
          <BaseIconClient name="sparkles" size="12" />
          Featured
        </span>
        <!-- avaiable -->
        <span
          v-if="property?.isAvailable"
          class="flex items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full w-fit"
        >
          <BaseIconClient name="sparkles" size="12" />
          {{ $t("property.available") }}
        </span>
      </div>
    </section>
    <!-- land lord -->
    <section class="w-[30%] grid grid-cols-1 gap-y-5">
      <div class="col-span-1 rounded-lg shadow-md p-5">
        <h5>{{ $t("property.contact") }}</h5>
        <!-- profile -->
        <div class="mt-5">
          <div class="flex items-center gap-x-5">
            <BaseAvatar
              :name="property?.user.name"
              :src="property?.user.imgUrl"
            />
            <div>
              <h6 class="text-lg">{{ property?.user.name }}</h6>
              <span class="text-(--gray)">{{ property?.user.role }}</span>
            </div>
          </div>
          <!-- socail media -->
          <div class="grid grid-cols-1 gap-y-5 mt-4">
            <!-- phone number -->
            <div
              class="flex items-center gap-x-3 bg-(--bg-gray) p-3 rounded-md"
            >
              <BaseIconClient name="phone-call" />
              <p class="">{{ property?.user.phones?.[0]?.phoneNumber }}</p>
            </div>
            <!-- call now -->
            <div
              class="flex justify-center items-center gap-x-3 bg-(--nav-active-item) text-white p-3 rounded-md"
            >
              <BaseIconClient name="phone-call" />
              <p class="">{{ $t("property.call") }}</p>
            </div>
            <!-- telegram -->
            <div
              class="flex justify-center items-center gap-x-3 border border-[#e2e0e0] bg-(--bg-gray) p-3 rounded-md"
            >
              <BaseIconClient name="message-square-text" />
              <p class="">{{ $t("property.telegram") }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- share social media -->
      <div class="grid grid-cols-3 gap-5 rounded-lg shadow-md p-5 share">
        <h5 class="col-span-full flex items-center gap-x-3">
          <BaseIconClient name="share-2" />
          {{ $t("property.share") }}
        </h5>
        <!-- facebook -->
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z"
            />
          </svg>
        </span>
        <!-- telegram -->
        <span>
          <BaseIconClient name="message-square-text" />
        </span>
        <!-- copy link -->
        <span>
          <BaseIconClient name="copy" />
        </span>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { PropertyDetail } from "../interface/properties-details";
import BaseImage from "~/components/ui/BaseImage.vue";
import BaseAvatar from "~/components/ui/BaseAvatar.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseBadge from "~/components/ui/BaseBadge.vue";

const api = useApi();
const route = useRoute();

const carousel = ref();
const activeIndex = ref(0);

const goTo = (index: number) => {
  activeIndex.value = index;
  carousel.value?.setActiveItem(index);
};
const id = computed(() => route.params.id as string);
const type = computed(() =>
  useCurrentLang().value == "en"
    ? property.value?.propertyType.nameEn
    : property.value?.propertyType.nameKh,
);

const { data: property } = await useAsyncData<PropertyDetail>(
  () =>
    api.get<PropertyDetail>(`/property/${id.value}`).then((res) => res.data),
  { watch: [id] },
);
</script>

<style scoped>
.share > span {
  padding: calc(var(--spacing) * 4) /* 1rem = 16px */;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-md) /* 0.375rem = 6px */;
  background-color: var(--bg-gray);
  cursor: pointer;
}

.property-carousel,
.property-carousel .el-carousel__container,
.property-carousel .el-carousel__item {
  height: 100%;
}

.carousel-item {
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
}

.thumb {
  width: 80px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.thumb.active {
  border-color: #10b981; /* green highlight */
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
