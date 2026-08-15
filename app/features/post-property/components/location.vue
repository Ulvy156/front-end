<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">
        {{ t("post_property.location.title") }}
      </h2>
      <p class="text-sm text-gray-500">{{ t("post_property.location.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Province / District -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.province") }}
          <span class="text-red-500">*</span>
        </label>
        <el-form-item prop="province">
          <BaseSelect
            :model-value="form.province"
            :options="provinceOptions"
            :placeholder="t('post_property.location.select_province')"
            @update:model-value="(val: string) => { form.province = val; onProvinceChange() }"
          />
        </el-form-item>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.district") }}
          <span class="text-red-500">*</span>
        </label>
        <el-form-item prop="districtId">
          <BaseSelect
            :model-value="form.districtId"
            :options="districtOptions"
            :disabled="!form.province"
            :placeholder="t('post_property.location.select_district')"
            @update:model-value="(val: string | number) => { form.districtId = Number(val); onDistrictChange() }"
          />
        </el-form-item>
      </div>
    </div>

    <!-- Street Address -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.location.street_address") }}
        <span class="text-red-500">*</span>
      </label>
      <el-form-item prop="streetAddress">
        <BaseInput
          :model-value="form.streetAddress"
          type="text"
          icon="map-pin"
          :placeholder="t('post_property.location.street_placeholder')"
          @update:model-value="(val: string) => { form.streetAddress = val }"
        />
      </el-form-item>
    </div>

    <!-- Map Picker -->
    <div class="mb-5">
      <label class="flex items-center gap-1.5 text-sm font-medium text-gray-800 mb-1.5">
        <BaseIconClient name="map-pin" :size="15" class="text-(--nav-active-item)" />
        {{ t("post_property.location.map_preview") }}
      </label>
      <p class="text-xs text-gray-400 mb-2">{{ t("post_property.location.map_click_hint") }}</p>
      <BaseMapClient
        v-model="mapCoords"
        height="300px"
        :zoom="13"
        :searchable="true"
        :center="selectedProvinceCoords ?? undefined"
        :bounds-center="selectedProvinceCoords"
        :bounds-radius-km="selectedProvinceCoords ? MAX_LOCATION_DISTANCE_KM : null"
      />
    </div>

    <!-- Lat / Lng -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
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
import { inject, ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import BaseToggle from "@/components/ui/BaseToggle.vue"
import BaseSelect from "@/components/ui/BaseSelect.vue"
import BaseInput from "@/components/ui/BaseInput.vue"
import BaseIconClient from "@/components/ui/BaseIcon.client.vue"
import BaseMapClient from "~/components/ui/BaseMap.client.vue"
import { useCambodiaLocations } from "@/composables/useCambodiaLocations"

const { t } = useI18n()
const { fetchProvinces, fetchDistrictsByProvinceId, getProvinceId, fetchProvinceCoordinates } = useCambodiaLocations()

// keep in sync with PropertyService.MAX_LOCATION_DISTANCE_KM on the back-end
const MAX_LOCATION_DISTANCE_KM = 60

const props = defineProps<{ form?: any }>()
const injected = inject<any>("postPropertyForm", {})
const form = props.form ?? injected

const selectedProvinceCoords = ref<{ lat: number; lng: number } | null>(null)

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

  if (form.province) {
    await loadProvinceCoordinates(form.province)

    // Edit mode hydrates `form.province`/`form.district` from the server but has
    // no district id to work with (the API only returns district names) — load
    // this province's districts eagerly and resolve districtId by name-match so
    // the district select is pre-populated and the "districtId required" rule
    // doesn't spuriously fail on an untouched location step.
    await loadDistricts(form.province)
    if (!form.districtId && form.district) {
      const match = currentDistricts.value.find(
        (d) => d.nameEn.toLowerCase() === form.district.toLowerCase()
      )
      if (match) form.districtId = match.id
    }
  }
})

async function loadProvinceCoordinates(provinceName: string) {
  if (!provinceName) {
    selectedProvinceCoords.value = null
    return
  }

  const province = provinces.value.find(
    (p) => p.nameEn.toLowerCase() === provinceName.toLowerCase()
  )
  const provinceId = province?.id ?? (await getProvinceId(provinceName))

  if (!provinceId) {
    selectedProvinceCoords.value = null
    return
  }

  const coords = await fetchProvinceCoordinates(provinceId)
  selectedProvinceCoords.value = coords ? { lat: coords.latitude, lng: coords.longitude } : null
}

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

    if (!provinceId) {
      currentDistricts.value = []
      return
    }

    const districts = await fetchDistrictsByProvinceId(provinceId)
    currentDistricts.value = districts
  } catch (error) {
    console.error('Failed to load districts:', error)
    currentDistricts.value = []
  }
}

async function onProvinceChange() {
  form.district = ''
  form.districtId = 0
  // reset the pin - a new province auto-pins its own center once coordinates load
  form.latitude = ''
  form.longitude = ''
  loadDistricts(form.province)
  await loadProvinceCoordinates(form.province)
}

function onDistrictChange() {
  const selected = currentDistricts.value.find(
    (d) => d.id === Number(form.districtId),
  )
  form.district = selected?.nameEn || ''
}




</script>