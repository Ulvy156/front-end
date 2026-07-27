<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">{{ t("post_property.location.title") }}</h2>
      <p class="text-sm text-gray-500">{{ t("post_property.location.subtitle") }}</p>
    </div>

    <hr class="border-gray-200 mb-5" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">
          {{ t("post_property.location.province") }}
          <span class="text-red-500">*</span>
          <span v-if="formErrors.province" class="text-red-500 text-xs font-normal ml-1">{{ formErrors.province }}</span>
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
          <span v-if="formErrors.district" class="text-red-500 text-xs font-normal ml-1">{{ formErrors.district }}</span>
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

    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-800 mb-1.5">
        {{ t("post_property.location.street_address") }}
        <span class="text-red-500">*</span>
        <span v-if="formErrors.streetAddress" class="text-red-500 text-xs font-normal ml-1">{{ formErrors.streetAddress }}</span>
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

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">{{ t("post_property.location.latitude") }} ({{ t("post_property.optional") }})</label>
        <BaseInput :model-value="form.latitude" type="number" placeholder="e.g., 11.5564" @update:model-value="(val: string) => form.latitude = val" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-1.5">{{ t("post_property.location.longitude") }} ({{ t("post_property.optional") }})</label>
        <BaseInput :model-value="form.longitude" type="number" placeholder="e.g., 104.9282" @update:model-value="(val: string) => form.longitude = val" />
      </div>
    </div>

    <BaseToggle v-model="form.hideAddress" :label="t('post_property.location.hide_address')" :description="t('post_property.location.hide_address_desc')" class="mb-5" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import BaseToggle from "@/components/ui/BaseToggle.vue"
import BaseSelect from "@/components/ui/BaseSelect.vue"
import BaseInput from "@/components/ui/BaseInput.vue"
import BaseMapClient from "~/components/ui/BaseMap.client.vue"
import { useCambodiaLocations } from "@/composables/useCambodiaLocations"

const props = defineProps<{ form: any; formErrors: any }>()

const mapCoords = computed({
  get() {
    if (props.form.latitude != null && props.form.longitude != null && props.form.latitude !== '' && props.form.longitude !== '') {
      return { lat: Number(props.form.latitude), lng: Number(props.form.longitude) }
    }
    return null
  },
  set(val: { lat: number; lng: number } | null) {
    if (val) {
      props.form.latitude = val.lat
      props.form.longitude = val.lng
    }
  },
})

const { t } = useI18n()
const { fetchProvinces, fetchDistrictsByProvinceId, getProvinceId } = useCambodiaLocations()

interface LocationOption { id: number; nameEn: string; nameKh?: string }

const provinces = ref<LocationOption[]>([])
const currentDistricts = ref<LocationOption[]>([])
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
  provinces.value = data.map((p: any) => ({ id: p.id, nameEn: p.nameEn, nameKh: p.nameKh }))

  data.forEach((p: any) => {
    if (p.districts?.length && p.id) {
      provinceDistrictsMap.value.set(
        p.id,
        p.districts.map((d: any) => ({ id: d.id, nameEn: d.nameEn, nameKh: d.nameKh }))
      )
    }
  })

  if (props.form.province) {
    await loadDistricts(props.form.province)
  }
})

async function loadDistricts(provinceName: string) {
  if (!provinceName) { currentDistricts.value = []; return }

  const province = provinces.value.find(p => p.nameEn.toLowerCase() === provinceName.toLowerCase())
  let provinceId = province?.id ?? null
  if (!provinceId) provinceId = await getProvinceId(provinceName)
  if (!provinceId) { currentDistricts.value = []; return }

  if (provinceDistrictsMap.value.has(provinceId)) {
    currentDistricts.value = provinceDistrictsMap.value.get(provinceId) || []
  } else {
    currentDistricts.value = await fetchDistrictsByProvinceId(provinceId)
  console.log(provinceId);

  }
}

function onProvinceChange() {
  props.form.district = ''
  props.form.districtId = 0
  props.formErrors.province = ''
  props.formErrors.district = ''
  loadDistricts(props.form.province)
  
}

function onDistrictChange() {
  const selected = currentDistricts.value.find(d => d.id === Number(props.form.districtId))
  props.form.district = selected?.nameEn || ''
  props.formErrors.district = ''
}
</script>
