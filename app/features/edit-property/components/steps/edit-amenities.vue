<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">{{ t("post_property.amenities.title") }}</h2>
      <p class="text-sm text-gray-500 mt-4">{{ t("post_property.amenities.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="amenity in amenities" :key="amenity.id">
        <div @click="toggleAmenity(amenity.id)" :class="form.amenities?.includes(amenity.id)
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          class="flex items-center justify-start gap-4 px-3 py-3 border rounded-lg transition cursor-pointer text-center">
          <BaseIconClient :name="amenity.icon" class="text-2xl mb-1" />
          <span class="text-sm font-medium">{{ t(`post_property.amenities.list.${amenity.code}`) || amenity.code }}</span>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-medium text-gray-800">{{ t("post_property.amenities.parking_options") }}</label>
        <button type="button" @click="showParkingOptions = !showParkingOptions" class="text-sm text-emerald-600 hover:underline">
          {{ showParkingOptions ? "- Hide" : "+ " + t("post_property.amenities.add_parking") }}
        </button>
      </div>
      <div v-if="showParkingOptions" class="grid grid-cols-3 gap-3">
        <div v-for="parking in parkingOptions" :key="parking.key">
          <div @click="toggleParking(parking.key)" :class="form.parkings?.includes(parking.key)
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
            class="flex items-center justify-start gap-3 px-3 py-3 border rounded-lg transition cursor-pointer text-center">
            <BaseIconClient :name="parking.icon" class="text-xl" />
            <span class="text-sm font-medium">{{ t(`post_property.amenities.parking_types.${parking.key}`) }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="form.parkings?.length" class="flex flex-wrap gap-2">
        <span v-for="pk in form.parkings" :key="pk" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">
          <BaseIconClient :name="parkingOptions.find((p) => p.key === pk)?.icon" />
          {{ t(`post_property.amenities.parking_types.${pk}`) }}
        </span>
      </div>
      <div v-else class="border border-gray-200 rounded-lg p-4 text-gray-400 text-sm text-center">
        {{ t("post_property.amenities.no_parking") }}
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-800 mb-2">{{ t("post_property.amenities.house_rules") }}</label>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <input type="checkbox" id="edit_pets_allowed" v-model="form.houseRules.petsAllowed" class="h-4 w-4 text-emerald-500 border-gray-300 rounded" />
          <label for="edit_pets_allowed" class="text-sm text-gray-700">{{ t("post_property.amenities.rules.pets_allowed") }}</label>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="edit_smoking_allowed" v-model="form.houseRules.smokingAllowed" class="h-4 w-4 text-emerald-500 border-gray-300 rounded" />
          <label for="edit_smoking_allowed" class="text-sm text-gray-700">{{ t("post_property.amenities.rules.smoking_allowed") }}</label>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="edit_guests_allowed" v-model="form.houseRules.guestsAllowed" class="h-4 w-4 text-emerald-500 border-gray-300 rounded" />
          <label for="edit_guests_allowed" class="text-sm text-gray-700">{{ t("post_property.amenities.rules.guests_allowed") }}</label>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="edit_parties_allowed" v-model="form.houseRules.partiesAllowed" class="h-4 w-4 text-emerald-500 border-gray-300 rounded" />
          <label for="edit_parties_allowed" class="text-sm text-gray-700">{{ t("post_property.amenities.rules.parties_allowed") }}</label>
        </div>
      </div>
    </div>

    <div v-if="form.parkings?.length" class="mb-6">
      <div v-for="pk in form.parkings" :key="pk" class="mb-4 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-sm font-medium text-gray-700">{{ t(`post_property.amenities.parking_types.${pk}`) }}</span>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{{ t("post_property.amenities.slots") }}</label>
            <input v-model="form.parkingDetails[pk].slots" type="number" min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition"
              :placeholder="t('post_property.amenities.slots_placeholder')" />
          </div>
          <div class="col-span-2 flex items-center justify-end gap-3">
            <label class="text-sm font-medium text-gray-800">{{ t("post_property.amenities.free_parking") }}</label>
            <button type="button" @click="form.parkingDetails[pk].isFree = !form.parkingDetails[pk].isFree"
              :class="form.parkingDetails[pk]?.isFree ? 'bg-emerald-500' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
              <span :class="form.parkingDetails[pk]?.isFree ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
        </div>
        <div v-if="!form.parkingDetails[pk]?.isFree" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{{ t("post_property.amenities.price_per_month") }} ($)</label>
            <input v-model="form.parkingDetails[pk].price" type="number" min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition"
              :placeholder="t('post_property.amenities.price_placeholder')" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-800 mb-1.5">{{ t("post_property.amenities.additional_notes") }}</label>
      <textarea v-model="form.additionalNotes" rows="3"
        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition resize-none"
        placeholder="Any other rules, expectations, or information renters should know..."></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import { usePropertyAmenityOptions } from "~/features/browse-properties/composable/usePropertyAmenityOptions"

const props = defineProps<{ form: any; formErrors: any }>()
const { t } = useI18n()

if (!props.form.parkingDetails) props.form.parkingDetails = {}

const { data: amenityOptions } = usePropertyAmenityOptions()

const amenities = computed(() =>
  (amenityOptions.value ?? []).map((item: any) => ({
    id: item.id,
    code: item.code || item.key,
    icon: item.icon || "sparkles",
  })),
)

const parkingOptions = [
  { key: "BIKE", icon: "bike", label: "bike" },
  { key: "MOTORBIKE", icon: "motorcycle", label: "motorbike" },
  { key: "CAR", icon: "car", label: "car" },
  { key: "TUK_TUK", icon: "car", label: "tuk_tuk" },
]

const showParkingOptions = ref(!!props.form.parkings?.length)

function toggleAmenity(id: number) {
  if (!props.form.amenities) props.form.amenities = []
  const idx = props.form.amenities.indexOf(id)
  if (idx > -1) props.form.amenities.splice(idx, 1)
  else props.form.amenities.push(id)
  props.formErrors.amenities = ""
}

function toggleParking(key: string) {
  if (!props.form.parkings) props.form.parkings = []
  if (!props.form.parkingDetails) props.form.parkingDetails = {}
  const idx = props.form.parkings.indexOf(key)
  if (idx > -1) {
    props.form.parkings.splice(idx, 1)
  } else {
    props.form.parkings.push(key)
    props.form.parkingDetails[key] = { slots: 1, isFree: true }
  }
}
</script>
