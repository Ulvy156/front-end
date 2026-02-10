<template>
  <transition name="slide-up">
    <section
      v-if="localVisible"
      class="fixed bottom-0 left-0 right-0 z-50 p-5 bg-white shadow-lg border-t border-gray"
    >
      <div class="flex justify-between mx-20">
        <div class="flex gap-x-10 items-center">
          <div class="flex gap-2 items-center">
            <BaseIconClient
              name="git-compare-arrows"
              class="cursor-pointer"
              @click="close"
            />
            <p>{{ $t("property.compare.title") }}</p>
            <p class="text-(--nav-active-item)">( {{ images.length }} / 4 )</p>
          </div>

          <TransitionGroup
  name="slide-up"
  tag="div"
  class="flex gap-x-4 items-center"
>
  <BaseImage
    v-for="value in images"
    :key="value.id"
    @click="removeItem(value.id)"
    style="height: 100px; object-fit: cover"
    class="border border-(--nav-active-item) rounded-(--radius) cursor-pointer"
    :src="value.img[0]?.imageKey!"
  />
</TransitionGroup>

        </div>
        <div class="flex flex-col gap-5">
          <button
            @click="close"
            :disabled="images.length < 2"
            :class="{'opacity-[0.5] cursor-not-allowed': images.length < 2, 'cursor-pointer': images.length >= 2}"
            class="flex items-center text-white bg-(--nav-active-item) py-2 px-4 rounded-(--radius) gap-x-2 "
          >
            <BaseIconClient name="git-compare-arrows" class="cursor-pointer" />
            {{ $t("property.compare.title") }}
          </button>
          <button
            @click="close"
            class="flex items-center text-black bg-(--bg-gray) border border-(--border-gray) py-2 px-4 rounded-(--radius) gap-x-2 cursor-pointer"
          >
            <BaseIconClient name="trash" class="cursor-pointer" />
            {{ $t("property.compare.clear") }}
          </button>
        </div>
      </div>
    </section>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseImage from "~/components/ui/BaseImage.vue";
import { useCompareProperty } from "#imports";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// local state
const localVisible = ref(props.visible);
const compareStore = useCompareProperty();

const images = computed(() =>
  compareStore.propertyCardItem.map((val) => ({
    img: val.images,
    id: val.id,
  })),
);

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
