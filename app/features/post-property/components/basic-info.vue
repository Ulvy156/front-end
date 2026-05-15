<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <!-- Header -->
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

      <!-- Property Title -->
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

      <!-- Description -->
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

      <!-- Property Details -->
      <div class="md:col-span-2">
        <h3 class="text-sm font-medium text-gray-800 mb-3">
          {{ t("post_property.basic_info.property_details") }}
        </h3>

        <div class="grid grid-cols-3 gap-4">

          <!-- Bedrooms -->
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">
              {{ t("post_property.basic_info.bedrooms") }}
            </label>
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                @click="form.bedrooms = Math.max(0, form.bedrooms - 1); console.log('Bedrooms decreased:', form.bedrooms)"
                class="w-9 h-10 bg-gray-100 hover:bg-gray-200"
              >−</button>
              <span class="flex-1 text-center text-sm">{{ form.bedrooms }}</span>
              <button
                type="button"
                @click="form.bedrooms++; console.log('Bedrooms increased:', form.bedrooms)"
                class="w-9 h-10 bg-gray-100 hover:bg-gray-200"
              >+</button>
            </div>
          </div>

          <!-- Bathrooms -->
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">
              {{ t("post_property.basic_info.bathrooms") }}
            </label>
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                @click="form.bathrooms = Math.max(0, form.bathrooms - 1); console.log('Bathrooms decreased:', form.bathrooms)"
                class="w-9 h-10 bg-gray-100 hover:bg-gray-200"
              >−</button>
              <span class="flex-1 text-center text-sm">{{ form.bathrooms }}</span>
              <button
                type="button"
                @click="form.bathrooms++; console.log('Bathrooms increased:', form.bathrooms)"
                class="w-9 h-10 bg-gray-100 hover:bg-gray-200"
              >+</button>
            </div>
          </div>

          <!-- Size -->
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">
              {{ t("post_property.basic_info.size") }}
              <span class="text-red-500">*</span>
              <span v-if="formErrors.size" class="text-red-500 text-xs font-normal ml-1">
                ( {{ formErrors.size }} )
              </span>
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

      <!-- Fully Furnished -->
      <div class="md:col-span-2">
        <div
          class="flex items-center gap-3 rounded-lg px-4 py-3.5"
          :class="form.fullyFurnished ? 'bg-emerald-50' : 'bg-gray-50'"
        >
          <div class="w-9 h-9 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48">
              <path fill="#e8eaf6" d="M42 39H6V23L24 6l18 17z"/>
              <path fill="#c5cae9" d="m39 21l-5-5V9h5zM6 39h36v5H6z"/>
              <path fill="#b71c1c" d="M24 4.3L4 22.9l2 2.2L24 8.4l18 16.7l2-2.2z"/>
              <path fill="#d84315" d="M18 28h12v16H18z"/>
              <path fill="#01579b" d="M21 17h6v6h-6z"/>
              <path fill="#ff8a65" d="M27.5 35.5c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5s.5-.2.5-.5v-2c0-.3-.2-.5-.5-.5"/>
            </svg>
          </div>

          <div class="flex-1">
            <p class="text-sm font-medium" :class="form.fullyFurnished ? 'text-emerald-900' : 'text-gray-700'">
              {{ t("post_property.basic_info.fully_furnished") }}
            </p>
            <p class="text-xs" :class="form.fullyFurnished ? 'text-emerald-700' : 'text-gray-500'">
              {{ t("post_property.basic_info.fully_furnished_desc") }}
            </p>
          </div>

          <button
            type="button"
            @click="form.fullyFurnished = !form.fullyFurnished; console.log('Fully furnished toggled:', form.fullyFurnished)"
            :class="form.fullyFurnished ? 'bg-emerald-500' : 'bg-gray-300'"
            class="relative w-11 h-6 rounded-full transition cursor-pointer border-none outline-none"
          >
            <span
              :class="form.fullyFurnished ? 'translate-x-5' : 'translate-x-0.5'"
              class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform block"
            ></span>
          </button>
        </div>
      </div>

      <!-- Tips -->
      <div class="md:col-span-2">
        <div class="bg-gray-50 rounded-lg border-l-4 border-amber-400 px-4 py-3.5">
          <p class="text-sm font-medium text-amber-700 mb-2">
            {{ t("post_property.basic_info.tips_title") }}
          </p>
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
import { inject } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const form       = inject<any>("postPropertyForm", {})
const formErrors = inject<any>("formErrors", {})
</script>