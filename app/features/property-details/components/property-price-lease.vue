<template>
  <div class="p-5 border border-gray rounded-(--radius) bg-white">
    <div class="flex items-center gap-x-2">
      <h3>$ {{ $t("property.price.title") }}</h3>
    </div>
    <!-- price -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5 pb-6"
    >
      <!-- monthly rent -->
      <div class="card">
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.price.montly") }}
        </p>
        <h4>${{ formatView(property.monthly_price) }}</h4>
      </div>
      <!-- deposit -->
      <div class="card">
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.price.deposit") }}
        </p>
        <h4>${{ formatView(property.deposit) }}</h4>
      </div>
      <!-- deposit -->
      <div class="card">
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.price.lease") }}
        </p>
        <h4>
          {{ formatDuration(property.minimumStayLength, currentLang) }}
        </h4>
      </div>
      <!-- available from -->
      <div class="card">
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.price.available") }}
        </p>
        <h4>
          {{ formatDateLong(property.availableFrom, currentLang) }}
        </h4>
      </div>
    </div>
    <!-- utilities -->
    <!-- <div class="mt-5">
      <div class="flex items-center gap-x-3">
          <BaseIconClient name="clock-2"/>
          <h5>{{ $t('property.price.utilities') }}</h5>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import type { PropertyDetail } from "../interface/properties-details";
import { formatView } from "#imports";
import { formatDateLong } from "#imports";
import { formatDuration } from "#imports";

const props = defineProps<{
  property: PropertyDetail;
}>();
const currentLang = useCurrentLang();
</script>

<style scoped>
.card {
  padding: 15px;
  border-radius: var(--radius);
  background: var(--bg-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 4px solid var(--nav-active-item);
}
.card h4 {
  font-size: 16px;
}
</style>
