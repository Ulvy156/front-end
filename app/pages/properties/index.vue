<template>
  <section class="mt-10 grid grid-cols-1 gap-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
      <div>
        <div class="flex items-center gap-x-5 text-(--nav-active-item) mb-3">
          <span
            class="flex items-center bg-(--nav-active) px-2 py-1 rounded-md"
          >
            <BaseIconClient name="sparkles" />
          </span>
          <p class="lowercase">{{ filterStore.result }} {{ $t("results") }}</p>
        </div>
        <h2>{{ $t("filter.available") }}</h2>
        <p class="text-(--gradient-primary)">{{ $t("filter.description") }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-(--nav-active-item) text-(--nav-active-item) bg-(--nav-active) cursor-pointer"
          @click="showFilterDrawer = true"
        >
          <BaseIconClient name="funnel" :size="16" />
          {{ $t('filter.title') }}
        </button>
        <filterChip />
      </div>
    </div>
    <section class="flex flex-col md:flex-row justify-between gap-y-6 md:gap-x-10">
      <filterSideBar class="hidden md:block w-full md:w-[25%]" />
      <div class="w-full md:w-[75%]">
        <propertySection />
      </div>
    </section>

    <!-- Mobile filter drawer -->
    <BaseDrawer
      v-model="showFilterDrawer"
      direction="ltr"
      :title="$t('filter.title')"
      size="85%"
    >
      <filterSideBar is-drawer />
    </BaseDrawer>
  </section>
</template>

<script lang="ts" setup>
import filterSideBar from "~/features/browse-properties/components/filter-side-bar.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseDrawer from "~/components/ui/BaseDrawer.vue";
import propertySection from "~/features/browse-properties/components/property-section.vue";
import { usePropertyFilterStore } from "~/stores/propertyFilter";
import filterChip from "~/features/browse-properties/components/filter-chip.vue";
import { useSEO } from "#imports";

definePageMeta({
  keepalive: true,
})

const showFilterDrawer = ref(false)

const filterStore = usePropertyFilterStore();
// Restore persisted filters before any child (e.g. FilterChip) reads the
// store during render — doing this later, inside a child's own setup,
// let FilterChip render with pre-restoration state during SSR while the
// client hydrated against post-restoration state, causing a hydration
// child-count mismatch.
filterStore.init();
const SEO = useSEO();

SEO.setSEO({
  title: "Browse Rooms & Apartments for Rent in Cambodia | RokPteah",
  description: "Browse rooms and apartments for rent across Cambodia. Filter by price, location, and nearby places to find your perfect home.",
});
</script>
