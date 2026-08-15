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

    <!-- Tip banner -->
    <div class="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5 mb-5">
      <BaseIconClient name="info" :size="18" class="text-(--nav-active-item) shrink-0 mt-0.5" />
      <p class="text-[13px] text-(--nav-active-item) leading-relaxed">
        {{ t("post_property.basic_info.tip_banner") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Property Title -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.basic_info.property_title") }}
          <span class="text-red-500">*</span>
        </label>
        <el-form-item prop="propertyTitle">
          <BaseInput
            :model-value="form.propertyTitle"
            type="text"
            :maxlength="100"
            :placeholder="t('post_property.basic_info.property_title_placeholder')"
            @update:model-value="(val: string) => { form.propertyTitle = val }"
          />
        </el-form-item>
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.basic_info.description") }}
          <span class="text-red-500">*</span>
        </label>
        <el-form-item prop="description">
          <BaseInput
            :model-value="form.description"
            type="textarea"
            :rows="5"
            :maxlength="2000"
            :placeholder="t('post_property.basic_info.description_placeholder')"
            @update:model-value="(val: string) => { form.description = val }"
          />
        </el-form-item>
      </div>

      <!-- Property Details -->
      <div class="md:col-span-2">
        <h3 class="text-sm font-medium text-gray-800 mb-3">
          {{ t("post_property.basic_info.property_details") }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <!-- Bedrooms -->
          <div>
            <label class="text-xs text-gray-500 mb-2 block">
              {{ t("post_property.basic_info.bedrooms") }}
            </label>
            <div class="flex items-center gap-3.5">
              <button
                type="button"
                @click="form.bedrooms = Math.max(0, form.bedrooms - 1);"
                class="w-10 h-10 rounded-[10px] border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >−</button>
              <span class="min-w-6 text-center text-[17px] font-bold text-gray-900">{{ form.bedrooms }}</span>
              <button
                type="button"
                @click="form.bedrooms++;"
                class="w-10 h-10 rounded-[10px] border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >+</button>
            </div>
          </div>

          <!-- Bathrooms -->
          <div>
            <label class="text-xs text-gray-500 mb-2 block">
              {{ t("post_property.basic_info.bathrooms") }}
            </label>
            <div class="flex items-center gap-3.5">
              <button
                type="button"
                @click="form.bathrooms = Math.max(0, form.bathrooms - 1); "
                class="w-10 h-10 rounded-[10px] border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >−</button>
              <span class="min-w-6 text-center text-[17px] font-bold text-gray-900">{{ form.bathrooms }}</span>
              <button
                type="button"
                @click="form.bathrooms++;"
                class="w-10 h-10 rounded-[10px] border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >+</button>
            </div>
          </div>

          <!-- Size -->
          <div>
            <label class="text-xs text-gray-500 mb-1.5 block">
              {{ t("post_property.basic_info.size") }}
              <span class="text-red-500">*</span>
            </label>
            <el-form-item prop="size">
              <div class="relative w-full">
                <BaseInput
                  size="large"
                  :model-value="form.size"
                  decimal
                  type="number"
                  placeholder="e.g., 45"
                  @update:model-value="(val: string) => { if (isNonNegativeNumber(val)) form.size = val }"
                />
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">m²</span>
              </div>
            </el-form-item>
          </div>

        </div>
      </div>

      <!-- Fully Furnished -->
      <div class="md:col-span-2">
        <BaseToggle
          v-model="form.fullyFurnished"
          :label="t('post_property.basic_info.fully_furnished')"
          :description="t('post_property.basic_info.fully_furnished_desc')"
        />
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
import BaseToggle from "~/components/ui/BaseToggle.vue"
import BaseInput from "~/components/ui/BaseInput.vue"
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import { isNonNegativeNumber } from "~/utils/validators"

const { t } = useI18n()

const props = defineProps<{ form?: any }>()
const injected = inject<any>("postPropertyForm", {})
const form = props.form ?? injected
</script>
