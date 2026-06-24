<template>
  <section v-if="props.property.rules.length > 0">
    <h2 class="text-xl font-bold text-gray-800 mb-3.5">
      {{ $t("property.rules.title") }}
    </h2>
    <div class="grid grid-cols-2 gap-2.5">
      <div
        v-for="rule in props.property.rules"
        :key="rule.icon"
        class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg py-3 px-4"
      >
        <span
          class="w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0"
          :class="rule.is_allow
            ? 'bg-green-500/10 text-green-500'
            : 'bg-red-500/10 text-red-500'"
        >
          <BaseIconClient :name="rule.icon" :size="13" />
        </span>
        <span class="text-sm text-gray-500">{{ rule[currentKey] }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()

const currentKey = useLangKey()
</script>
