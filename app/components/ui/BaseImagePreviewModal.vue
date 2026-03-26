<template>
  <el-dialog
    v-model="props.visible"
    append-to-body
    lock-scroll
    destroy-on-close
    draggable
  >
    <div class="flex items-center gap-x-10 ">
      <!-- PREV -->
      <BaseIconClient @click="prev" class="cursor-pointer" size="60" name="circle-chevron-left"/>

      <!-- IMAGE -->
      <BaseImage
        :src="previewList[currentIndex]!"
        format="webp"
        loading="eager"
      />

      <!-- NEXT -->
        <BaseIconClient @click="next" class="cursor-pointer" size="60" name="circle-chevron-right"/>

    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import type { Image } from '~/features/property-details/interface/properties-details'
import BaseIconClient from './BaseIcon.client.vue';
import BaseImage from './BaseImage.vue';

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    images: Image[]
    startIndex?: number
    visible: boolean
  }>(),
  {
    startIndex: 0,
  }
)
const currentIndex = ref(props.startIndex)


const previewList = computed(() =>
  props.images.map(
    img => `${img.imageKey}`
  )
)

function next() {
  currentIndex.value =
    (currentIndex.value + 1) % previewList.value.length
}

function prev() {
  currentIndex.value =
    (currentIndex.value - 1 + previewList.value.length) %
    previewList.value.length
}
</script>
