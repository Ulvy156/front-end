<template>
  <section v-if="relatedProperties.length > 0">
    <h3 class="mb-4">{{ $t('property.similar') }}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

const { relatedProperties, isFetching } = useRelatedProperties()
</script>


<style>

</style>
