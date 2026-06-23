<template>
  <section class="p-5 border border-gray rounded-(--radius) bg-white">
    <div class="flex items-center gap-x-2">
      <h3>
        <BaseIconClient
          color="var(--nav-active-item)"
          size="20"
          name="sparkles"
        />
        {{ $t("property.amenity") }}
      </h3>
    </div>
    <!-- amenities item -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5 pb-6">
      <div
        class="flex items-center justify-between gap-x-3 bg-(--nav-active) text-(--nav-active-item) p-2 rounded-(--radius)"
        v-for="value in props.property.amenities"
      >
        <div class="flex items-center gap-x-3">
          <BaseIconClient color="var(--nav-active-item)" :name="value.icon" />
          <p >{{ value[currentKey] }}</p>
        </div>
        <BaseIconClient color="var(--nav-active-item)" name="check-check" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";
import { useLangKey } from "#imports";

const props = defineProps<{
  property: PropertyDetail;
}>();
const currentKey = useLangKey();

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
