<template>
  <div class="w-full px-4 mt-10 md:w-[80%] md:px-0 m-auto flex flex-col gap-6">
    <StepsNavigation
      :current-step="2"
      :total-steps="6"
      @back="() => {}"
      @next="() => {}"
      @save="() => {}"
      @submit="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import StepsNavigation from '~/features/post-property/components/steps-navigation.vue'

useSeoMeta({ robots: 'noindex, nofollow' })
</script>
