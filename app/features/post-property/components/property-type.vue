<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { propertyTypes } from '~/config/property-types';

const { t } = useI18n();
const form = inject<any>('postPropertyForm', {});


const selected = ref<string>('house');

function selectType(type: string) {
  selected.value = type;
  form.propertyType = type;
}

onMounted(() => {
  if (!form.propertyType) {
    form.propertyType = 'house'
    selected.value = 'house'
  } else {
    selected.value = form.propertyType
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 rounded-(--radius) p-5 shadow-md">
    <div class="col-span-full">
      <h4>{{ t("post_property.property_type.title") }}</h4>
      <p>{{ t("post_property.property_type.subtitle") }}</p>
    </div>

    <span class="w-full col-span-full border-t border-gray"></span>

    <div class="col-span-full">
      <p>{{ t("post_property.property_type.description") }}</p>
    </div>
    <div
      v-for="item in propertyTypes"
      :key="item.value"
      @click="selectType(item.value)"
      class="relative cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all duration-200"
      :class="selected === item.value
        ? 'border-(--nav-active-item) bg-emerald-50'
        : 'border-gray-200 hover:border-gray-300'"
    >
      <!-- Check badge -->
      <div
        v-if="selected === item.value"
        class="absolute top-4 right-4 w-7 h-7 bg-(--nav-active-item) rounded-full flex items-center justify-center"
      >
        <BaseIconClient name="check" :size="16" color="white" />
      </div>

      <!-- Icon box -->
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition font-light"
        :class="selected === item.value
          ? 'bg-(--nav-active-item) text-white'
          : 'bg-gray-100 text-(--gray)'"
      >
        <BaseIconClient
          :name="item.icon"
          :size="28"
        />
      </div>

      <!-- Label -->
      <div class="text-lg font-semibold text-gray-800">
        {{ item.label }}
      </div>

      <div class="text-sm text-gray-500 mt-1">
        {{ item.sub }}
      </div>
    </div>
  </div>
</template>