<template>
  <section class="w-[80%] mt-10 m-auto">
    <!-- Step Header -->
    <el-steps :active="active" finish-status="success">
      <el-step :title="t('post_property.steps.one')" />
      <el-step :title="t('post_property.steps.two')" />
      <el-step :title="t('post_property.steps.three')" />
      <el-step :title="t('post_property.steps.four')" />
      <el-step :title="t('post_property.steps.five')" />
      <el-step :title="t('post_property.steps.six')" />
      <el-step :title="t('post_property.steps.seven')" />
    </el-steps>

    <!-- Step Content -->
    <div class="mt-8">
      <component :is="currentComponent" />
    </div>

    <!-- Controls -->
    <div class="mt-6 flex justify-between">
      <stepsNavigation/>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref } from "vue";
import stepsNavigation from "./steps-navigation.vue";

const { t } = useI18n();

const active = ref(0);

// Lazy loaded components
const steps = [
  defineAsyncComponent(() => import("./property-type.vue")),
  //   defineAsyncComponent(() => import('./basic-info.vue')),
  //   defineAsyncComponent(() => import('./location.vue')),
  //   defineAsyncComponent(() => import('./price.vue')),
  //   defineAsyncComponent(() => import('./amenities.vue')),
  //   defineAsyncComponent(() => import('./photos.vue')),
  //   defineAsyncComponent(() => import('./preview.vue')),
];

const currentComponent = computed(() => steps[active.value]);

const next = () => {
  if (active.value < steps.length - 1) {
    active.value++;
  }
};

const prev = () => {
  if (active.value > 0) {
    active.value--;
  }
};
</script>
