<template>
  <section class="flex flex-col gap-y-5">
    <div class="flex flex-col justify-center items-center">
      <h2>{{ $t('landlord.editProperty.title') }}</h2>
      <p class="text-(--gray)">{{ $t('landlord.editProperty.subtitle') }}</p>
    </div>
    <editSection />
  </section>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'landlord', layout: 'landlord' })

import editSection from '~/features/edit-property/components/edit-section.vue'
</script>
