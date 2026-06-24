<template>
  <section class="mt-10">
    <div @click="$router.push('/properties')"
      class="flex items-center gap-x-3 mb-5 cursor-pointer">
      <BaseIconClient name="arrow-left"/>
      <span>{{ $t('property.back') }}</span>
    </div>
    <propertyDetails/>
  </section>
</template>

<script setup lang="ts">
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import propertyDetails from '~/features/property-details/components/property-details.vue';
</script>
