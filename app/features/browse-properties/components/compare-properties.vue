<template>
  <BaseModal
    :title="$t('property.compare.comparasion')"
    width="70%"
    v-model="compareStore.isCompare"
    style="padding: 30px"
  >
    <animationGroup
        key="property.compare.comparasion"
      class="flex justify-end w-full gap-x-5"
    >
      <div
        v-for="value in compareStore.getImage"
        :key="value.id"
        class="relative overflow-x-auto w-65 h-50 rounded-xl overflow-hidden border border-(--nav-active-item)"
      >
        <!-- Image -->
        <BaseImage
          :src="value.img[0]?.imageKey!"
          class="w-auto h-auto object-cover"
        />

        <!-- Close button -->
        <button
          class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
          @click="compareStore.removeItem(value.id)"
        >
          ✕
        </button>

        <!-- Bottom overlay -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3"
        >
          <p class="text-white text-sm font-medium truncate">
            {{ value.title }}
          </p>
          <span
            @click="viewPropertyDetails(value.id)"
            class="cursor-pointer text-(--nav-active-item) hover:underline"
            >{{ $t("property.compare.details") }}</span
          >
        </div>
      </div>
    </animationGroup>
    <compareTable/>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "~/components/ui/BaseModal.vue";
import { useCompareProperty } from "#imports";
import BaseImage from "~/components/ui/BaseImage.vue";
import { useRouter } from "vue-router";
import animationGroup from "~/components/animation/animation-group.vue";
import compareTable from "./compare-table.vue";

const compareStore = useCompareProperty();
const router = useRouter();

const viewPropertyDetails = (id: string) => {
  if (!id) return;
  compareStore.isCompare = false;
  router.push(`/properties/details/${id}`);
};
</script>
