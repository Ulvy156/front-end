<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.amenities.title") }}
        <span class="text-red-500">*</span>
      </h2>
      <p class="text-sm text-gray-500 mt-4">
        {{ t("post_property.amenities.subtitle") }}
      </p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Amenities -->
    <el-form-item prop="amenities">
      <div class="flex flex-wrap gap-2 mb-6 w-full">
        <button
          v-for="amenity in amenities"
          :key="amenity.id"
          type="button"
          @click="toggleAmenity(amenity.id)"
          :class="form.amenities?.includes(amenity.id)
            ? 'border-(--nav-active-item) bg-emerald-50 text-(--nav-active-item)'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          class="flex items-center gap-1.5 px-3.5 py-2.5 border rounded-full text-[13px] font-semibold transition cursor-pointer"
        >
          <BaseIconClient :name="amenity.icon" :size="13" />
          {{ amenity.name }}
        </button>
      </div>
    </el-form-item>

    <!-- Parking Options -->
    <div class="border border-gray-200 rounded-[14px] mb-6 overflow-hidden">
      <div
        class="flex items-center justify-between px-4.5 py-4 cursor-pointer"
        @click="accordionOpen = !accordionOpen"
      >
        <div class="flex items-center gap-2.5">
          <span class="text-[14.5px] font-bold text-gray-900">{{ t("post_property.amenities.parking_options") }}</span>
          <span class="text-[11.5px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ t("post_property.optional") }}</span>
        </div>
        <BaseIconClient
          name="chevron-down"
          :size="16"
          class="text-gray-500 transition-transform"
          :class="accordionOpen ? 'rotate-180' : ''"
        />
      </div>

      <div v-if="accordionOpen" class="px-4.5 pb-4.5">
        <div class="flex items-center justify-between py-3 border-t border-gray-100 mb-1.5">
          <span class="text-[13.5px] text-gray-700">{{ t("post_property.amenities.offer_parking") }}</span>
          <button
            type="button"
            @click="toggleParkingEnabled"
            :class="parkingEnabled ? 'bg-emerald-500' : 'bg-gray-300'"
            class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-none outline-none"
          >
            <span
              :class="parkingEnabled ? 'translate-x-5' : 'translate-x-0.5'"
              class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 block"
            ></span>
          </button>
        </div>

        <div v-if="parkingEnabled" class="flex flex-col gap-2.5 mt-2">
          <div
            v-for="parking in parkingOptions"
            :key="parking.key"
            class="bg-gray-50 border border-gray-100 rounded-xl p-3.5"
          >
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 min-w-20">
                <BaseIconClient :name="parking.icon" :size="17" class="text-gray-500" />
                <span class="text-[13.5px] font-semibold text-gray-900">{{ t(`post_property.amenities.parking_types.${parking.key}`) }}</span>
              </div>

              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  @click="decSlots(parking.key)"
                  class="w-7 h-7 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >−</button>
                <span class="min-w-4 text-center text-sm font-bold text-gray-900">{{ form.parkingDetails[parking.key]?.slots ?? 0 }}</span>
                <button
                  type="button"
                  @click="incSlots(parking.key)"
                  class="w-7 h-7 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >+</button>
                <span class="text-xs text-gray-400 lowercase">{{ t("post_property.amenities.slots") }}</span>
              </div>

              <div class="flex gap-1.5">
                <button
                  type="button"
                  @click="setParkingFree(parking.key, true)"
                  :class="form.parkingDetails[parking.key]?.isFree !== false
                    ? 'border-(--nav-active-item) bg-emerald-50 text-(--nav-active-item)'
                    : 'border-gray-200 text-gray-400'"
                  class="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer"
                >{{ t("post_property.amenities.free") }}</button>
                <button
                  type="button"
                  @click="setParkingFree(parking.key, false)"
                  :class="form.parkingDetails[parking.key]?.isFree === false
                    ? 'border-(--nav-active-item) bg-emerald-50 text-(--nav-active-item)'
                    : 'border-gray-200 text-gray-400'"
                  class="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer"
                >{{ t("post_property.amenities.priced") }}</button>
              </div>

              <div v-if="form.parkingDetails[parking.key]?.isFree === false" class="w-28">
                <BaseInput
                  :model-value="form.parkingDetails[parking.key].price"
                  type="number"
                  icon="dollar-sign"
                  :placeholder="t('post_property.amenities.price_placeholder')"
                  @update:model-value="(val: string) => form.parkingDetails[parking.key].price = val"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- House Rules -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-800 mb-3">{{
        t("post_property.amenities.house_rules")
      }}</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="rule in rules"
          :key="rule.id"
          type="button"
          @click="toggleRule(rule.id)"
          :class="form.ruleKeys?.includes(rule.id)
            ? 'border-(--nav-active-item) bg-emerald-50 text-(--nav-active-item)'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          class="flex items-center gap-1.5 px-3.5 py-2.5 border rounded-full text-[13px] font-semibold transition cursor-pointer"
        >
          <BaseIconClient v-if="form.ruleKeys?.includes(rule.id)" name="check" :size="13" />
          {{ rule.name }}
        </button>
      </div>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-800 mb-1.5">{{
        t("post_property.amenities.additional_notes")
      }}</label>
      <BaseInput
        :model-value="form.additionalNotes"
        type="textarea"
        :rows="3"
        :placeholder="t('post_property.amenities.additional_notes_placeholder')"
        @update:model-value="(val: string) => form.additionalNotes = val"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseInput from "~/components/ui/BaseInput.vue";
import { usePropertyAmenityOptions } from "~/features/browse-properties/composable/usePropertyAmenityOptions";
import { usePropertyRuleOptions } from "~/features/browse-properties/composable/usePropertyRuleOptions";
import { localizedName } from "~/utils/localizedName";

const { t } = useI18n();
const langKey = useLangKey();

const props = defineProps<{ form?: any }>();
const injected = inject<any>("postPropertyForm", {});
const form = props.form ?? injected;

if (!form.parkingDetails) form.parkingDetails = {};
if (!form.ruleKeys) form.ruleKeys = [];
if (!form.parkings) form.parkings = [];

const { data: amenityOptions } = usePropertyAmenityOptions();
const { data: ruleOptions } = usePropertyRuleOptions();

const amenities = computed(() =>
  amenityOptions.value.map((item: any) => ({
    id: item.id,
    name: localizedName(item, langKey.value),
    icon: item.icon || "sparkles",
  })),
);

const rules = computed(() =>
  ruleOptions.value.map((item: any) => ({
    id: item.id,
    name: localizedName(item, langKey.value),
    icon: item.icon || "scroll-text",
  })),
);

const parkingOptions = [
  { key: "BIKE", icon: "bike" },
  { key: "MOTORBIKE", icon: "motorcycle" },
  { key: "CAR", icon: "car" },
  { key: "TUK_TUK", icon: "car" },
];

const accordionOpen = ref(false);
const parkingEnabled = ref(!!form.parkings.length);

function toggleAmenity(id: number) {
  if (!form.amenities) form.amenities = [];
  const idx = form.amenities.indexOf(id);
  if (idx > -1) form.amenities.splice(idx, 1);
  else form.amenities.push(id);
}

function toggleRule(id: number) {
  if (!form.ruleKeys) form.ruleKeys = [];
  const idx = form.ruleKeys.indexOf(id);
  if (idx > -1) form.ruleKeys.splice(idx, 1);
  else form.ruleKeys.push(id);
}

function toggleParkingEnabled() {
  parkingEnabled.value = !parkingEnabled.value;
  if (parkingEnabled.value) {
    for (const p of parkingOptions) {
      if (!form.parkingDetails[p.key]) {
        form.parkingDetails[p.key] = { slots: 0, isFree: true, price: 0 };
      }
    }
  } else {
    form.parkings = [];
  }
}

function syncOffered(key: string) {
  const slots = form.parkingDetails[key]?.slots ?? 0;
  const idx = form.parkings.indexOf(key);
  if (slots > 0 && idx === -1) form.parkings.push(key);
  if (slots <= 0 && idx > -1) form.parkings.splice(idx, 1);
}

function incSlots(key: string) {
  if (!form.parkingDetails[key]) form.parkingDetails[key] = { slots: 0, isFree: true, price: 0 };
  form.parkingDetails[key].slots = (form.parkingDetails[key].slots ?? 0) + 1;
  syncOffered(key);
}

function decSlots(key: string) {
  if (!form.parkingDetails[key]) return;
  form.parkingDetails[key].slots = Math.max(0, (form.parkingDetails[key].slots ?? 0) - 1);
  syncOffered(key);
}

function setParkingFree(key: string, isFree: boolean) {
  if (!form.parkingDetails[key]) form.parkingDetails[key] = { slots: 0, isFree: true, price: 0 };
  form.parkingDetails[key].isFree = isFree;
}
</script>
