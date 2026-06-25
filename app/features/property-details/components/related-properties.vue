<template>
  <section v-if="relatedProperties.length > 0">
    <h4 class="mb-4">{{ $t('property.similar') }}</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <propertyCard
      v-show="relatedProperties.length > 0 && !isFetching"
      v-for="value in relatedProperties"
      :key="value.id"
      :item="value"
      :hideCompareIcon="true"
    />
    </div>
  </section>
</template>

<script lang="ts" setup>
import propertyCard from '~/features/browse-properties/components/property-card.vue';
import { useRelatedProperties } from '../composable/useRelatedProperties';

const { relatedProperties, isFetching } = await useRelatedProperties()
</script>


<style>

</style>
