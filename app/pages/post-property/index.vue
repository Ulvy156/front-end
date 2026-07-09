<template>
    <section class="flex flex-col gap-y-5 mt-10">
        <div class="flex flex-col justify-center items-center">
            <h2>{{ $t("post_property.title") }}</h2>
            <p class="text-(--gray)">{{ $t("post_property.desc") }}</p>
        </div>
        <postSection/>
    </section>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'landlord' })

import postSection from '~/features/post-property/components/post-section.vue';
import { reactive, provide } from 'vue';

const postPropertyForm = reactive({
  propertyType: '',
  propertyTitle: '',
  description: '',
  bedrooms: 0,
  bathrooms: 0,
  size: '',
  fullyFurnished: false,
  province: '',
  district: '',
  districtId: 0,
  streetAddress: '',
  latitude: null,
  longitude: null,
  hideAddress: false,
  rent: '',
  deposit: '',
  minStay: '',
  availableFrom: '',
  isAvailable: true,
  amenities: [],
  parkings: [],
  parkingDetails: {},
  ruleKeys: [],
  additionalNotes: '',
  photos: [],
  photoFiles: [],
});

const formErrors = reactive({
  propertyType: '',
  propertyTitle: '',
  description: '',
  size: '',
  province: '',
  district: '',
  streetAddress: '',
  rent: '',
  minStay: '',
  availableFrom: '',
  photos: '',
  amenities: ''
});

provide('postPropertyForm', postPropertyForm);
provide('formErrors', formErrors);
</script>

<style>

</style>