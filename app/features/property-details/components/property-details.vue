<template>
  <section class="flex gap-x-10 ">
    <div class="w-[65%] flex flex-col gap-y-7">
      <carouselPropertyDetails :property="property!"/>
      <propertyRooms :property="property!"/>
      <propertyDescription :property="property!"/>
      <propertyLocation :property="property!"/>
      <propertyPriceLease :property="property!"/>
      <propertyParking :property="property!"/>
      <propertyAmenities :property="property!"/>
      <propertyHosueRule :property="property!"/>
    </div>
    <!-- land lord -->
    <div class="w-[30%] sticky top-[20%] h-fit self-start">
      <contactLandlord :property="property!" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropertyDetail } from "../interface/properties-details";
import contactLandlord from "./contact-landlord.vue";
import carouselPropertyDetails from "./carousel-property-details.vue";
import propertyDescription from "./property-description.vue";
import propertyRooms from "./property-rooms.vue";
import propertyLocation from "./property-location.vue";
import propertyPriceLease from "./property-price-lease.vue";
import propertyAmenities from "./property-amenities.vue";
import propertyHosueRule from "./property-hosue-rule.vue";
import propertyParking from "./property-parking.vue";

const api = useApi();
const route = useRoute();

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
