<template>
  <section class="flex flex-col gap-y-5">
    <div class="flex flex-col justify-center items-center">
      <h2>{{ $t("post_property.title") }}</h2>
      <p class="text-(--gray)">{{ $t("post_property.desc") }}</p>
    </div>
    <postSection />
  </section>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'landlord', layout: 'landlord' })

import postSection from '~/features/post-property/components/post-section.vue'
import { provide } from 'vue'
import { createPropertyForm, createPropertyFormErrors } from '~/utils/propertyFormDefaults'

const postPropertyForm = createPropertyForm()
const formErrors = createPropertyFormErrors()

provide('postPropertyForm', postPropertyForm)
provide('formErrors', formErrors)
</script>
