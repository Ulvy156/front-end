<template>
  <transition name="slide-up">
    <section
      v-if="localVisible"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-5 bg-white shadow-lg border-t border-gray"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-4 md:mx-20">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-x-10 min-w-0">
          <div class="flex gap-2 items-center shrink-0">
            <BaseIconClient
              name="git-compare-arrows"
              class="cursor-pointer"
              @click="close"
            />
            <p>{{ $t("property.compare.title") }}</p>
            <p class="text-(--nav-active-item) whitespace-nowrap">( {{ compareStore.getImage.length }} / 4 )</p>
          </div>

          <animationGroup
            key="property.compare.title"
            class="hidden md:flex gap-x-3 md:gap-x-4 items-center overflow-x-auto"
          >
            <BaseImage
              v-for="value in compareStore.getImage"
              :key="value.id"
              @click="removeItem(value.id)"
              class="h-14 w-14 md:h-25 md:w-auto object-cover border border-(--nav-active-item) rounded-(--radius) cursor-pointer shrink-0"
              :src="value.img[0]?.imageKey!"
            />
          </animationGroup>
        </div>
        <div class="flex flex-row md:flex-col gap-3 md:gap-5 shrink-0">
          <button
            @click="compareStore.isCompare = true"
            :disabled="compareStore.getImage.length < 2"
            :class="{
              'opacity-[0.5] cursor-not-allowed': compareStore.getImage.length < 2,
              'cursor-pointer': compareStore.getImage.length >= 2,
            }"
            class="flex-1 md:flex-none flex items-center justify-center text-white bg-(--nav-active-item) py-2 px-4 rounded-(--radius) gap-x-2 whitespace-nowrap"
          >
            <BaseIconClient name="git-compare-arrows" class="cursor-pointer" />
            {{ $t("property.compare.title") }}
          </button>
          <button
            @click="close"
            class="flex-1 md:flex-none flex items-center justify-center text-black bg-(--bg-gray) border border-(--border-gray) py-2 px-4 rounded-(--radius) gap-x-2 cursor-pointer whitespace-nowrap"
          >
            <BaseIconClient name="trash" class="cursor-pointer" />
            {{ $t("property.compare.clear") }}
          </button>
        </div>
      </div>
    </section>
  </transition>

  <compareProperties/>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseImage from "~/components/ui/BaseImage.vue";
import { useCompareProperty } from "#imports";
import animationGroup from "~/components/animation/animation-group.vue";
const compareProperties = defineAsyncComponent(() => import('./compare-properties.vue'))

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// local state
const localVisible = ref(props.visible);
const compareStore = useCompareProperty();

function close() {
  localVisible.value = false; // close internally
  compareStore.reset();
  emit("update:visible", false); // notify parent
}
function removeItem(id: string) {
  compareStore.removeItem(id);
}
// keep in sync when parent changes
watch(
  () => props.visible,
  (val) => {
    localVisible.value = val;
  },
);
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
