<template>
  <div class="p-5 border border-gray rounded-(--radius) bg-white">
    <div class="flex items-center gap-x-2">
      <BaseIconClient name="book-text" size="20" />
      <h3>{{ $t("property.desc") }}</h3>
    </div>
    <p class="text-(--gray) mt-3">{{ property.description }}</p>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";

const props = defineProps<{
  property: PropertyDetail;
}>();
</script>
