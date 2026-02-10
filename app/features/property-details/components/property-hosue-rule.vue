<template>
  <section
    v-if="props.property.rules.length > 0"
    class="p-5 border border-gray rounded-(--radius) bg-white"
  >
    <div class="flex flex-col gap-x-2">
      <h3>
        <BaseIconClient
          color="var(--nav-active-item)"
          size="20"
          name="sparkles"
        />
        {{ $t("property.rules.title") }}
      </h3>
      <span>{{ $t("property.rules.desc") }}</span>
    </div>
    <!-- rules item -->
    <section class="flex flex-col lg:flex-row gap-8 mt-5">
      <!-- ALLOWED -->
      <div class="flex flex-wrap items-start gap-5 w-1/2 h-fit">
        <rulesItem
          v-for="rule in allowedRules"
          :key="rule.icon"
          :rule="rule"
          :isAllowed="true"
        />
      </div>
      <div class="border-r border-gray hidden lg:block md:block"></div>
      <!-- NOT ALLOWED -->
      <div class="flex flex-wrap items-start gap-5 w-1/2">
        <rulesItem
          v-for="rule in notAllowedRules"
          :key="rule.icon"
          :rule="rule"
          :isAllowed="false"
        />
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";
import { useCurrentLang } from "#imports";
import rulesItem from "./rules-item.vue";

const props = defineProps<{
  property: PropertyDetail;
}>();

const allowedRules = computed(
  () => props.property?.rules?.filter((rule) => rule.is_allow) ?? [],
);

const notAllowedRules = computed(
  () => props.property?.rules?.filter((rule) => !rule.is_allow) ?? [],
);
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
