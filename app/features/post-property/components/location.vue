<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.location.title") }}
      </h2>
      <p class="text-sm text-gray-500">{{ t("post_property.location.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Province / District -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.province") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.province" class="text-red-500 text-xs font-normal ml-1">
             {{ formErrors.province }}
          </span>
        </label>
        <select
          v-model="form.province"
          @change="onProvinceChange"
          :class="formErrors.province
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
          class="w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition bg-white text-gray-700"
        >
          <option value="">{{ t("post_property.location.select_province") }}</option>
          <option
            v-for="p in provinces"
            :key="p.id"
            :value="p.nameEn"
          >
            {{ p.nameKh ? `${p.nameKh} (${p.nameEn})` : p.nameEn }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.district") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.district" class="text-red-500 text-xs font-normal ml-1">
             {{ formErrors.district }}
          </span>
        </label>
        <select
          v-model.number="form.districtId"
          :disabled="!form.province"
          @change="onDistrictChange"
          :class="formErrors.district
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
          class="w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="0">{{ t("post_property.location.select_district") }}</option>
          <option
            v-for="d in currentDistricts"
            :key="d.id"
            :value="d.id"
          >
            {{ d.nameKh ? `${d.nameKh} (${d.nameEn})` : d.nameEn }}
          </option>
        </select>
      </div>
    </div>

    <!-- Street Address -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.location.street_address") }}
        <span class="text-red-500">*</span>
        <span v-if="formErrors.streetAddress" class="text-red-500 text-xs font-normal ml-1">
         {{ formErrors.streetAddress }}
        </span>
      </label>
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <input
          v-model="form.streetAddress"
          type="text"
          :placeholder="t('post_property.location.street_placeholder')"
          :class="formErrors.streetAddress
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
          class="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition"
          @input="formErrors.streetAddress = ''; console.log('Street address input:', form.streetAddress)"
        />
      </div>
    </div>

     <!-- Google Maps Link -->
     <div class="mb-5">
       <label class="block text-sm font-medium text-gray-800 mb-1.5">
         {{ t("post_property.location.maps_link") }} 
         <span v-if="formErrors.mapsLink" class="text-red-500 text-xs font-normal ml-1">
            {{ formErrors.mapsLink }}
         </span>
       </label>
       <div class="relative">
         <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
           <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
         </svg>
         <input
           v-model="form.mapsLink"
           type="url"
           placeholder="https://maps.google.com/..."
           :class="formErrors.mapsLink
             ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
             : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/15'"
           class="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-3 transition"
           @input="console.log('Maps link input:', form.mapsLink); formErrors.mapsLink = ''"
         />
       </div>
       <p class="text-xs text-gray-400 mt-1">{{ t("post_property.location.maps_hint") }}</p>
     </div>

    <!-- Map Picker -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.location.map_preview") }}
      </label>
      <p class="text-xs text-gray-400 mb-2">{{ t("post_property.location.map_click_hint") }}</p>
      <BaseMapClient
        v-model="mapCoords"
        height="300px"
        :zoom="13"
        :searchable="true"
      />
    </div>

    <!-- Lat / Lng -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.latitude") }} ({{ t("post_property.optional") }})
        </label>
        <input
          v-model="form.latitude"
          type="number"
          step="any"
          placeholder="e.g., 11.5564"
          class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.longitude") }} ({{ t("post_property.optional") }})
        </label>
        <input
          v-model="form.longitude"
          type="number"
          step="any"
          placeholder="e.g., 104.9282"
          class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
        />
      </div>
    </div>

    <!-- Hide Exact Address Toggle -->
    <BaseToggle
      v-model="form.hideAddress"
      :label="t('post_property.location.hide_address')"
      :description="t('post_property.location.hide_address_desc')"
      class="mb-5"
    />

  </div>
</template>
  
<script setup lang="ts">
import { inject, watch, ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import BaseToggle from "@/components/ui/BaseToggle.vue"
import BaseMapClient from "~/components/ui/BaseMap.client.vue"
import { useCambodiaLocations } from "@/composables/useCambodiaLocations"

const { t } = useI18n()
const { fetchProvinces, fetchDistrictsByProvinceId, getProvinceId } = useCambodiaLocations()

const form = inject<any>("postPropertyForm", {})
const formErrors = inject<any>("formErrors", {})

const mapCoords = computed({
  get() {
    if (form.latitude != null && form.longitude != null && form.latitude !== '' && form.longitude !== '') {
      return { lat: Number(form.latitude), lng: Number(form.longitude) }
    }
    return null
  },
  set(val: { lat: number; lng: number } | null) {
    if (val) {
      form.latitude = val.lat
      form.longitude = val.lng
    }
  },
})

interface LocationOption {
  id: number
  nameEn: string
  nameKh?: string
}

const provinces = ref<LocationOption[]>([])
const currentDistricts = ref<LocationOption[]>([])
const provinceIdToName = ref<Map<number, string>>(new Map())
const provinceDistrictsMap = ref<Map<number, LocationOption[]>>(new Map())

onMounted(async () => {
  const data = await fetchProvinces()
  provinces.value = data.map((p) => ({ id: p.id, nameEn: p.nameEn, nameKh: p.nameKh }))
  
  // Cache province IDs and districts from response
  data.forEach((p) => {
    if (p.id) {
      provinceIdToName.value.set(p.id, p.nameEn)
    }
    if (p.districts && p.districts.length > 0 && p.id) {
      provinceDistrictsMap.value.set(
        p.id,
        p.districts.map((d) => ({ id: d.id, nameEn: d.nameEn, nameKh: d.nameKh }))
      )
    }
  })
})

async function loadDistricts(newProvince: string) {
  try {
    if (!newProvince) {
      currentDistricts.value = []
      return
    }

    const province = provinces.value.find(
      (p) => p.nameEn.toLowerCase() === newProvince.toLowerCase()
    )
    let provinceId = province?.id ?? null

    if (!provinceId) {
      provinceId = await getProvinceId(newProvince)
    }

    console.log('Province selected:', newProvince)
    console.log('Resolved province ID:', provinceId)

    if (!provinceId) {
      currentDistricts.value = []
      return
    }

    if (provinceDistrictsMap.value.has(provinceId)) {
      currentDistricts.value = provinceDistrictsMap.value.get(provinceId) || []
      console.log('Districts from cache:', currentDistricts.value)
      return
    }

    const districts = await fetchDistrictsByProvinceId(provinceId)
    currentDistricts.value = districts
    console.log('Districts fetched:', districts)
  } catch (error) {
    console.error('Failed to load districts:', error)
    currentDistricts.value = []
  }
}

function onProvinceChange() {
  form.district = ''
  form.districtId = 0
  formErrors.province = ''
  formErrors.district = ''
  console.log('Province selected:', form.province)
  loadDistricts(form.province)
}

function onDistrictChange() {
  const selected = currentDistricts.value.find(
    (d) => d.id === Number(form.districtId),
  )
  form.district = selected?.nameEn || ''
  formErrors.district = ''
  console.log('District selected:', form.districtId, form.district)
}




</script>