<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900">
        {{ t("post_property.preview.title") }}
      </h2>
      <p class="text-sm text-gray-500 mt-0.5">
        {{ t("post_property.preview.subtitle") }}
      </p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Review heading -->
    <div class="text-center mb-5">
      <h3 class="text-base font-medium text-gray-900">
        {{ t("post_property.preview.review_title") }}
      </h3>
      <p class="text-sm text-gray-500 mt-1">
        {{ t("post_property.preview.review_desc") }}
      </p>
    </div>

    <!-- Listing Card -->
    <div class="border border-gray-200 rounded-xl overflow-hidden mb-5">
      <!-- Photo -->
      <div class="relative">
        <div class="w-full overflow-hidden rounded-t-xl" style="height:650px">
        
          <img
            v-if="form.photos && form.photos.length"
            :src="currentPhotoSrc"
            class="w-full h-full"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <div class="text-center">
              <svg
                class="w-10 h-10 text-gray-300 mx-auto mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p class="text-xs text-gray-400">
                {{ t("post_property.preview.no_photos") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex gap-1.5">
          <span
            v-if="form.propertyType"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm"
          >
            {{ form.propertyType }}
          </span>
          <span
            v-if="form.fullyFurnished"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm"
          >
            {{ t("post_property.preview.furnished") }}
          </span>
        </div>

        <!-- Edit photos -->
        <button
          type="button"
          @click="$emit('go-to', 5); console.log('Edit photos clicked')"
          class="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white transition cursor-pointer border-none"
        >
          <svg
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          {{ t("post_property.preview.edit_photos") }}
        </button>

        <!-- Photo counter -->
        <div
          v-if="form.photos && form.photos.length > 1"
          class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full"
        >
          {{ currentPhoto + 1 }}/{{ form.photos.length }}
        </div>
      </div>

      <!-- Info -->
      <div class="p-4">
        <!-- Title + Price -->
        <div class="flex items-start justify-between mb-1">
          <h4 class="text-base font-medium text-gray-900">
            {{ form.propertyTitle || t("post_property.preview.untitled") }}
          </h4>
          <div class="text-right shrink-0 ml-3">
            <span class="text-lg font-medium text-emerald-600"
              >${{ Number(form.rent || 0).toLocaleString() }}</span
            >
            <span class="text-xs text-gray-400 block">/month</span>
          </div>
        </div>

        <!-- Location -->
        <div class="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <svg
            class="w-3.5 h-3.5 text-gray-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {{
            [form.district, form.province].filter(Boolean).join(", ") ||
            t("post_property.preview.no_location")
          }}
        </div>

        <!-- Stats row -->
        <div
          class="flex items-center gap-4 text-xs text-gray-600 pb-3 border-b border-gray-100 mb-3"
        >
          <span class="flex items-center gap-1">
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8" />
              <path d="M2 10V6a2 2 0 012-2h4v6" />
              <rect x="10" y="14" width="4" height="6" rx="1" />
            </svg>
            {{ form.bedrooms || 0 }} {{ t("post_property.preview.bed") }}
          </span>
          <span class="flex items-center gap-1">
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M2 12h20M2 12v4a2 2 0 002 2h16a2 2 0 002-2v-4M2 12V6a2 2 0 012-2h4"
              />
              <circle cx="7" cy="6" r="1" />
            </svg>
            {{ form.bathrooms || 0 }} {{ t("post_property.preview.bath") }}
          </span>
          <span class="flex items-center gap-1">
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            {{ form.size || 0 }} m²
          </span>
          <span v-if="form.availableFrom" class="flex items-center gap-1">
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ form.availableFrom }}
          </span>
        </div>

        <!-- About -->
        <div class="mb-3">
          <p class="text-xs font-medium text-gray-700 mb-1">
            {{ t("post_property.preview.about") }}
          </p>
          <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {{ form.description || t("post_property.preview.no_description") }}
          </p>
        </div>

        <!-- House Rules -->
        <div v-if="selectedRules.length" class="mb-3">
          <p class="text-xs font-medium text-gray-700 mb-2">
            {{ t("post_property.preview.house_rules") }}
          </p>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="rule in selectedRules"
              :key="rule.id"
              class="flex items-center gap-1 text-xs text-gray-500"
            >
              <BaseIconClient :name="rule.icon" class="w-3.5 h-3.5 text-gray-400" />
              {{ rule.name }}
            </span>
          </div>
        </div>

        <!-- Pricing Details -->
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs font-medium text-gray-700 mb-2">
            {{ t("post_property.preview.pricing_details") }}
          </p>
          <div class="grid grid-cols-2 gap-y-1.5 text-xs">
            <span class="text-gray-500">{{
              t("post_property.pricing.monthly_rent")
            }}</span>
            <span class="text-gray-800 font-medium text-right"
              >${{ Number(form.rent || 0).toLocaleString() }}</span
            >
            <span class="text-gray-500">{{
              t("post_property.pricing.security_deposit")
            }}</span>
            <span class="text-gray-800 font-medium text-right"
              >${{ Number(form.deposit || 0).toLocaleString() }}</span
            >
            <span class="text-gray-500">{{ t("post_property.preview.min_stay") }}</span>
            <span class="text-gray-800 font-medium text-right">{{ minStayLabel }}</span>
            <template v-if="form.openTime && form.closeTime">
              <span class="text-gray-500">{{ t("post_property.preview.operating_hours") }}</span>
              <span class="text-gray-800 font-medium text-right">{{ form.openTime }} - {{ form.closeTime }}</span>
            </template>
            <span class="text-gray-500">{{ t("post_property.preview.status") }}</span>
            <span class="text-right">
              <span
                :class="form.isAvailable ? 'text-emerald-600' : 'text-red-500'"
                class="font-medium"
              >
                {{
                  form.isAvailable
                    ? t("post_property.preview.available")
                    : t("post_property.preview.unavailable")
                }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Buttons Grid -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="btn in editButtons"
        :key="btn.step"
        type="button"
        @click="$emit('go-to', btn.step); console.log('Edit button clicked:', btn.key, 'step:', btn.step)"
        class="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer bg-white"
      >
        <svg
          class="w-3.5 h-3.5 text-gray-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {{ t(`post_property.preview.${btn.key}`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseImage from "~/components/ui/BaseImage.vue";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyRuleOptions } from "~/features/browse-properties/composable/usePropertyRuleOptions";

const { t } = useI18n();
const langKey = useLangKey();

const emit = defineEmits(["go-to"]);

const form = inject<any>("postPropertyForm", {});

const currentPhoto = ref(0)

const isBase64 = computed(() => {
  const photo = form.photos?.[currentPhoto.value]
  return photo?.startsWith('data:')
})

const currentPhotoSrc = computed(() => {
  const photo = form.photos?.[currentPhoto.value]
  if (isBase64.value) return photo
  return photo
})

const editButtons = [
  { step: 0, key: "edit_property_type" },
  { step: 1, key: "edit_basic_info" },
  { step: 2, key: "edit_location" },
  { step: 3, key: "edit_pricing" },
  { step: 4, key: "edit_amenities" },
  { step: 5, key: "edit_photos" },
];

const stayMap: Record<string, string> = {
  "1m": "Month-to-month",
  "3m": "Short-term",
  "6m": "Medium-term",
  "1y": "Standard lease",
  "2y": "Long-term",
};

const minStayLabel = computed(() => stayMap[form.minStay] || "—");

const { data: ruleOptions } = usePropertyRuleOptions();

const selectedRules = computed(() => {
  const keys = form.ruleKeys as number[] | undefined;
  if (!keys?.length || !ruleOptions.value?.length) return [];
  return ruleOptions.value
    .filter((opt: any) => keys.includes(opt.id))
    .map((opt: any) => ({
      id: opt.id,
      name: opt[langKey.value] || opt.nameEn,
      icon: opt.icon,
    }));
});
</script>
``