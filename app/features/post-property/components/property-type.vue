<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';
import { usePropertyTypeOptions } from '~/features/browse-properties/composable/usePropertyTypeOptions';
import { propertyTypeKey } from '~/utils/propertyTypeKey';

const { t } = useI18n();
const props = defineProps<{ form?: any }>();
const injected = inject<any>('postPropertyForm', {});
const form = props.form ?? injected;

// Reads straight off the live /property-type list (not a hardcoded local
// list) so a type added in the admin panel (e.g. Villa) shows up here with
// no frontend change.
const { data: propertyTypes } = usePropertyTypeOptions();

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
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.property_type.title") }}
      </h2>
      <p class="text-sm text-gray-500">{{ t("post_property.property_type.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <p class="text-sm text-gray-500 mb-4">{{ t("post_property.property_type.description") }}</p>

    <el-form-item prop="propertyType">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <div
          v-for="item in propertyTypes"
          :key="item.id"
          @click="selectType(propertyTypeKey(item.nameEn))"
          class="relative cursor-pointer rounded-2xl border-1.5 p-4.5 flex flex-col gap-1.5 transition-all duration-150"
          :class="selected === propertyTypeKey(item.nameEn)
            ? 'border-(--nav-active-item) bg-emerald-50 ring-2 ring-emerald-100'
            : 'border-gray-200 bg-white hover:border-gray-300 shadow-xs'"
        >
          <!-- Check badge -->
          <div
            v-if="selected === propertyTypeKey(item.nameEn)"
            class="absolute top-4 right-4 w-7 h-7 bg-(--nav-active-item) rounded-full flex items-center justify-center"
          >
            <BaseIconClient name="check" :size="16" color="white" />
          </div>

          <!-- Icon box -->
          <div
            class="w-10 h-10 rounded-[10px] flex items-center justify-center mb-0.5 transition"
            :class="selected === propertyTypeKey(item.nameEn)
              ? 'bg-emerald-100 text-(--nav-active-item)'
              : 'bg-gray-100 text-(--gray)'"
          >
            <BaseIconClient
              :name="item.icon"
              :size="20"
            />
          </div>

          <!-- Label -->
          <div class="text-[15px] font-bold text-gray-900">
            {{ item.nameEn }}
          </div>

          <div class="text-[13px] text-gray-500" style="font-family: var(--font-km)">
            {{ item.nameKh }}
          </div>
        </div>
      </div>
    </el-form-item>
  </div>
</template>