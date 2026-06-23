<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="mb-6">
      <h2 class="text-lg font-medium text-gray-900">
        {{ t("post_property.basic_info.title") }}
      </h2>
      <p class="text-sm text-gray-500 mt-3">
        {{ t("post_property.basic_info.subtitle") }}
      </p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.basic_info.property_title") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.propertyTitle" class="text-red-500 text-xs font-normal ml-1">
            ( {{ formErrors.propertyTitle }})
          </span>
        </label>
        <input
          v-model="form.propertyTitle"
          type="text"
          maxlength="100"
          :placeholder="t('post_property.basic_info.property_title_placeholder')"
          :class="formErrors.propertyTitle
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
          class="w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition"
          @input="formErrors.propertyTitle = ''"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.basic_info.description") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.description" class="text-red-500 text-xs font-normal ml-1">
            ({{ formErrors.description }})
          </span>
        </label>
        <textarea
          v-model="form.description"
          rows="5"
          maxlength="2000"
          :placeholder="t('post_property.basic_info.description_placeholder')"
          :class="formErrors.description
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
          class="w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition resize-y"
          @input="formErrors.description = ''"
        ></textarea>
      </div>

      <div class="md:col-span-2">
        <h3 class="text-sm font-medium text-gray-800 mb-3">
          {{ t("post_property.basic_info.property_details") }}
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">{{ t("post_property.basic_info.bedrooms") }}</label>
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" @click="form.bedrooms = Math.max(0, form.bedrooms - 1)" class="w-9 h-10 bg-gray-100 hover:bg-gray-200">−</button>
              <span class="flex-1 text-center text-sm">{{ form.bedrooms }}</span>
              <button type="button" @click="form.bedrooms++" class="w-9 h-10 bg-gray-100 hover:bg-gray-200">+</button>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">{{ t("post_property.basic_info.bathrooms") }}</label>
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" @click="form.bathrooms = Math.max(0, form.bathrooms - 1)" class="w-9 h-10 bg-gray-100 hover:bg-gray-200">−</button>
              <span class="flex-1 text-center text-sm">{{ form.bathrooms }}</span>
              <button type="button" @click="form.bathrooms++" class="w-9 h-10 bg-gray-100 hover:bg-gray-200">+</button>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">
              {{ t("post_property.basic_info.size") }}
              <span class="text-red-500">*</span>
              <span v-if="formErrors.size" class="text-red-500 text-xs font-normal ml-1">( {{ formErrors.size }} )</span>
            </label>
            <input
              v-model="form.size"
              type="number"
              min="1"
              placeholder="e.g., 45"
              :class="formErrors.size
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
              class="w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition"
              @input="formErrors.size = ''"
            />
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <BaseToggle v-model="form.fullyFurnished" :label="t('post_property.basic_info.fully_furnished')" :description="t('post_property.basic_info.fully_furnished_desc')" />
      </div>

      <div class="md:col-span-2">
        <div class="bg-gray-50 rounded-lg border-l-4 border-amber-400 px-4 py-3.5">
          <p class="text-sm font-medium text-amber-700 mb-2">{{ t("post_property.basic_info.tips_title") }}</p>
          <ul class="text-sm text-gray-500 list-disc pl-4 space-y-1">
            <li>{{ t("post_property.basic_info.tips.0") }}</li>
            <li>{{ t("post_property.basic_info.tips.1") }}</li>
            <li>{{ t("post_property.basic_info.tips.2") }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import BaseToggle from "~/components/ui/BaseToggle.vue"

const props = defineProps<{ form: any; formErrors: any }>()
const { t } = useI18n()
</script>
