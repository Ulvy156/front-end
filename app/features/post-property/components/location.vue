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
        <BaseSelect
          :model-value="form.province"
          :options="provinceOptions"
          :placeholder="t('post_property.location.select_province')"
          @update:model-value="(val: string) => { form.province = val; onProvinceChange() }"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.district") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.district" class="text-red-500 text-xs font-normal ml-1">
             {{ formErrors.district }}
          </span>
        </label>
        <BaseSelect
          :model-value="form.districtId"
          :options="districtOptions"
          :disabled="!form.province"
          :placeholder="t('post_property.location.select_district')"
          @update:model-value="(val: string | number) => { form.districtId = Number(val); onDistrictChange() }"
        />
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
      <BaseInput
        :model-value="form.streetAddress"
        type="text"
        icon="map-pin"
        :placeholder="t('post_property.location.street_placeholder')"
        @update:model-value="(val: string) => { form.streetAddress = val; formErrors.streetAddress = '' }"
      />
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
        <BaseInput
          :model-value="form.latitude"
          type="number"
          placeholder="e.g., 11.5564"
          @update:model-value="(val: string) => form.latitude = val"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.longitude") }} ({{ t("post_property.optional") }})
        </label>
        <BaseInput
          :model-value="form.longitude"
          type="number"
          placeholder="e.g., 104.9282"
          @update:model-value="(val: string) => form.longitude = val"
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
import BaseSelect from "@/components/ui/BaseSelect.vue"
import BaseInput from "@/components/ui/BaseInput.vue"
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

const provinceOptions = computed(() =>
  provinces.value.map((p) => ({
    label: p.nameKh ? `${p.nameKh} (${p.nameEn})` : p.nameEn,
    value: p.nameEn,
  }))
)

const districtOptions = computed(() =>
  currentDistricts.value.map((d) => ({
    label: d.nameKh ? `${d.nameKh} (${d.nameEn})` : d.nameEn,
    value: d.id,
  }))
)

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