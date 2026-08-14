<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
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

    <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start">
      <!-- Listing Card -->
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <!-- Photo -->
        <div class="relative">
          <div class="w-full overflow-hidden rounded-t-xl h-56 sm:h-72 md:h-96">

            <img
              v-if="form.photos && form.photos.length"
              :src="currentPhotoSrc"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="text-center">
                <BaseIconClient name="image" :size="40" class="text-gray-300 mx-auto mb-2" />
                <p class="text-xs text-gray-400">
                  {{ t("post_property.preview.no_photos") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Badges + Edit photos -->
          <div class="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
            <div class="flex flex-wrap gap-1.5 min-w-0">
              <span
                v-if="form.propertyType"
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm truncate max-w-40"
              >
                {{ propertyTypeLabel }}
              </span>
              <span
                v-if="form.fullyFurnished"
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm"
              >
                {{ t("post_property.preview.furnished") }}
              </span>
            </div>

            <button
              type="button"
              @click="$emit('go-to', 5)"
              class="flex items-center gap-1.5 shrink-0 bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white transition cursor-pointer border-none"
            >
              <BaseIconClient name="pencil" :size="14" />
              {{ t("post_property.preview.edit_photos") }}
            </button>
          </div>

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
          <div class="flex items-start justify-between gap-3 mb-1">
            <div class="flex items-center gap-2 min-w-0">
              <h4 class="text-base font-medium text-gray-900 truncate">
                {{ form.propertyTitle || t("post_property.preview.untitled") }}
              </h4>
              <button type="button" class="edit-link shrink-0" @click="$emit('go-to', 1)">{{ t('post_property.preview.edit') }}</button>
            </div>
            <div class="text-right shrink-0 ml-3">
              <span class="text-lg font-medium text-emerald-600"
                >${{ Number(form.rent || 0).toLocaleString() }}</span
              >
              <span class="text-xs text-gray-400 block">/month</span>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-1 text-xs text-gray-500 min-w-0">
              <BaseIconClient name="map-pin" :size="14" class="text-gray-400 shrink-0" />
              <span class="truncate">
                {{
                  [form.district, form.province].filter(Boolean).join(", ") ||
                  t("post_property.preview.no_location")
                }}
              </span>
            </div>
            <button type="button" class="edit-link shrink-0" @click="$emit('go-to', 2)">{{ t('post_property.preview.edit') }}</button>
          </div>

          <!-- Stats row -->
          <div
            class="flex items-center gap-4 text-xs text-gray-600 pb-3 border-b border-gray-100 mb-3"
          >
            <span class="flex items-center gap-1">
              <BaseIconClient name="bed-double" :size="14" class="text-gray-400" />
              {{ form.bedrooms || 0 }} {{ t("post_property.preview.bed") }}
            </span>
            <span class="flex items-center gap-1">
              <BaseIconClient name="bath" :size="14" class="text-gray-400" />
              {{ form.bathrooms || 0 }} {{ t("post_property.preview.bath") }}
            </span>
            <span class="flex items-center gap-1">
              <BaseIconClient name="expand" :size="14" class="text-gray-400" />
              {{ form.size || 0 }} m²
            </span>
            <span v-if="form.availableFrom" class="flex items-center gap-1">
              <BaseIconClient name="calendar" :size="14" class="text-gray-400" />
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

          <!-- Amenities -->
          <div v-if="selectedAmenities.length" class="mb-3">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-medium text-gray-700">
                {{ t("post_property.preview.amenities") }}
              </p>
              <button type="button" class="edit-link" @click="$emit('go-to', 4)">{{ t('post_property.preview.edit') }}</button>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="a in selectedAmenities"
                :key="a"
                class="text-xs text-(--nav-active-item) bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1"
              >
                {{ a }}
              </span>
            </div>
          </div>

          <!-- House Rules -->
          <div v-if="selectedRules.length" class="mb-1">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-medium text-gray-700">
                {{ t("post_property.preview.house_rules") }}
              </p>
              <button type="button" class="edit-link" @click="$emit('go-to', 4)">{{ t('post_property.preview.edit') }}</button>
            </div>
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
        </div>
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col gap-3.5">
        <!-- Pricing breakdown -->
        <div class="bg-white border border-gray-200 rounded-2xl p-4.5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-[13px] font-bold text-gray-900">
              {{ t("post_property.preview.pricing_details") }}
            </p>
            <button type="button" class="edit-link" @click="$emit('go-to', 3)">{{ t('post_property.preview.edit') }}</button>
          </div>
          <div class="flex justify-between text-[13px] text-gray-700 mb-2">
            <span>{{ t("post_property.pricing.monthly_rent") }}</span>
            <span class="font-medium">${{ Number(form.rent || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-[13px] text-gray-700 mb-2">
            <span>{{ t("post_property.pricing.security_deposit") }}</span>
            <span class="font-medium">${{ Number(form.deposit || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-[13px] text-gray-700 mb-2">
            <span>{{ t("post_property.preview.min_stay") }}</span>
            <span class="font-medium">{{ minStayLabel }}</span>
          </div>
          <template v-if="form.openTime && form.closeTime">
            <div class="flex justify-between text-[13px] text-gray-700 mb-2">
              <span>{{ t("post_property.preview.operating_hours") }}</span>
              <span class="font-medium">{{ form.openTime }} - {{ form.closeTime }}</span>
            </div>
          </template>
          <div class="h-px bg-gray-100 my-2.5"></div>
          <div class="flex justify-between text-[15px] font-bold text-(--nav-active-item)">
            <span>{{ t("post_property.pricing.monthly_rent") }} + {{ t("post_property.pricing.security_deposit") }}</span>
            <span>${{ (Number(form.rent || 0) + Number(form.deposit || 0)).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>{{ t("post_property.preview.status") }}</span>
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
          </div>
        </div>

        <!-- Ready to publish checklist -->
        <div class="bg-white border border-gray-200 rounded-2xl p-4.5">
          <p class="text-[13px] font-bold text-gray-900 mb-3">
            {{ t("post_property.preview.ready_to_publish") }}
          </p>
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full shrink-0" :class="checklist.title ? 'bg-(--nav-active-item)' : 'bg-gray-200'" />
              <span class="text-[13px] text-gray-700">{{ t("post_property.preview.checklist_title") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full shrink-0" :class="checklist.photos ? 'bg-(--nav-active-item)' : 'bg-gray-200'" />
              <span class="text-[13px] text-gray-700">{{ t("post_property.preview.checklist_photos") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full shrink-0" :class="checklist.location ? 'bg-(--nav-active-item)' : 'bg-gray-200'" />
              <span class="text-[13px] text-gray-700">{{ t("post_property.preview.checklist_location") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full shrink-0" :class="checklist.price ? 'bg-(--nav-active-item)' : 'bg-gray-200'" />
              <span class="text-[13px] text-gray-700">{{ t("post_property.preview.checklist_price") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { usePropertyAmenityOptions } from "~/features/browse-properties/composable/usePropertyAmenityOptions";
import { usePropertyRuleOptions } from "~/features/browse-properties/composable/usePropertyRuleOptions";
import { propertyTypes } from "~/config/property-types";

const { t } = useI18n();
const langKey = useLangKey();

const emit = defineEmits(["go-to"]);

const form = inject<any>("postPropertyForm", {});

const currentPhoto = ref(0)

const currentPhotoSrc = computed(() => form.photos?.[currentPhoto.value])

const stayMap: Record<string, string> = {
  "1m": "Month-to-month",
  "3m": "Short-term",
  "6m": "Medium-term",
  "1y": "Standard lease",
  "2y": "Long-term",
};

const minStayLabel = computed(() => stayMap[form.minStay] || "—");

const propertyTypeLabel = computed(() => {
  const match = propertyTypes.find((item) => item.value === form.propertyType);
  if (!match) return form.propertyType;
  return langKey.value === "nameEn" ? match.label : match.sub;
});

const { data: amenityOptions } = usePropertyAmenityOptions();
const { data: ruleOptions } = usePropertyRuleOptions();

const selectedAmenities = computed(() => {
  const ids = form.amenities as number[] | undefined;
  if (!ids?.length || !amenityOptions.value?.length) return [];
  return amenityOptions.value
    .filter((opt: any) => ids.includes(opt.id))
    .map((opt: any) => {
      const code = opt.code || opt.key;
      return t(`post_property.amenities.list.${code}`) || code;
    });
});

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

const checklist = computed(() => ({
  title: !!form.propertyTitle?.trim(),
  photos: (form.photos?.length ?? 0) >= 3,
  location: !!(form.province && form.districtId && form.streetAddress?.trim()),
  price: Number(form.rent) > 0,
}));
</script>

<style scoped>
.edit-link {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--nav-active-item);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
</style>
