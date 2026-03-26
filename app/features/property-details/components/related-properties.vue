<template>
  <section v-if="data.length > 0">
    <h4 class="mb-4">{{ $t('property.similar') }}</h4>
    <div class="grid grid-cols-2 gap-5">
      <propertyCard
      v-show="data.length > 0 && !isFetching"
      v-for="value in data"
      :key="value.id"
      :item="value"
      :hideCompareIcon="true"
    />
    </div>
  </section>
</template>

<script lang="ts" setup>
import propertyCard from '~/features/browse-properties/components/property-card.vue';
import { useRoute } from 'vue-router';
import type { PropertyCardItem } from '~/features/browse-properties/interface/property-card-item';

const api = useApi();
const route = useRoute();

const isFetching = ref(false);
const data = shallowRef<PropertyCardItem[]>([]);

async function getRelatedProperties(id: string) {
  try {
    isFetching.value = true;

    const res = await api.get(`/property/related-properties/${id}`);
    data.value = res.data;

  } finally {
    isFetching.value = false;
  }
}

onMounted(async() => {
  await getRelatedProperties(route.params.id as string);
});
</script>


<style>

</style>