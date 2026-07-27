<template>
  <div class="space-y-2">
    <div v-if="!readonly" class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        @click="useMyLocation"
      >
        <BaseIconClient name="locate" :size="16" />
        {{ t('post_property.location.use_my_location') }}
      </button>
    </div>

    <div ref="mapEl" :style="{ height }" class="w-full rounded-lg border border-gray-200"></div>

    <div v-if="!readonly && outOfBounds" class="text-xs text-red-500">
      {{ t('post_property.location.out_of_bounds') }}
    </div>

    <div v-if="!readonly && currentPosition" class="text-xs text-gray-500">
      {{ t('post_property.location.pinned_at') }}:
      <b>{{ currentPosition.lat.toFixed(6) }}</b>,
      <b>{{ currentPosition.lng.toFixed(6) }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { haversineDistanceKm, type LatLng } from '~/utils/geo'

const props = withDefaults(defineProps<{
  modelValue?: LatLng | null
  center?: LatLng
  zoom?: number
  readonly?: boolean
  height?: string
  searchable?: boolean
  /** Restrict panning/selection to a radius (km) around `boundsCenter`. */
  boundsCenter?: LatLng | null
  boundsRadiusKm?: number | null
}>(), {
  modelValue: null,
  center: () => ({ lat: 11.5564, lng: 104.9282 }),
  zoom: 14,
  readonly: false,
  height: '400px',
  searchable: false,
  boundsCenter: null,
  boundsRadiusKm: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: LatLng): void
}>()

const { t } = useI18n()
const mapEl = ref<HTMLElement | null>(null)
const currentPosition = ref<LatLng | null>(props.modelValue ?? null)
const outOfBounds = ref(false)

let map: any = null
let marker: any = null

function isWithinBounds(latlng: LatLng): boolean {
  if (!props.boundsCenter || !props.boundsRadiusKm) return true
  return haversineDistanceKm(props.boundsCenter, latlng) <= props.boundsRadiusKm
}

function boundsToMaxBounds(center: LatLng, radiusKm: number): [[number, number], [number, number]] {
  const latDelta = radiusKm / 111
  const lngDelta = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180))
  return [
    [center.lng - lngDelta, center.lat - latDelta],
    [center.lng + lngDelta, center.lat + latDelta],
  ]
}

onMounted(async () => {
  const maptilersdk = await import('@maptiler/sdk')
  await import('@maptiler/sdk/dist/maptiler-sdk.css')

  maptilersdk.config.apiKey = useRuntimeConfig().public.maptilerKey as string

  const initialCenter = props.modelValue ?? props.center

  map = new maptilersdk.Map({
    container: mapEl.value!,
    style: maptilersdk.MapStyle.STREETS,
    center: [initialCenter.lng, initialCenter.lat],
    zoom: props.zoom,
    navigationControl: true,
    geolocateControl: false,
    ...(props.boundsCenter && props.boundsRadiusKm
      ? { maxBounds: boundsToMaxBounds(props.boundsCenter, props.boundsRadiusKm) }
      : {}),
  })

  map.on('load', () => {
    map.resize()

    if (props.modelValue) {
      addMarker(maptilersdk, props.modelValue)
    }

    if (!props.readonly) {
      map.on('click', (e: any) => {
        const val = { lat: e.lngLat.lat, lng: e.lngLat.lng }
        if (!isWithinBounds(val)) {
          outOfBounds.value = true
          return
        }
        addMarker(maptilersdk, val)
        emit('update:modelValue', val)
      })
    }

    if (props.searchable && !props.readonly) {
      const gc = new maptilersdk.GeocodingControl({
        collapsed: false,
      })
      map.addControl(gc, 'top-left')

      gc.on('pick', (e: any) => {
        if (!e?.center) return
        const val = { lat: e.center[1], lng: e.center[0] }
        if (!isWithinBounds(val)) {
          outOfBounds.value = true
          return
        }
        addMarker(maptilersdk, val)
        map.flyTo({ center: [val.lng, val.lat], zoom: 16 })
        emit('update:modelValue', val)
      })
    }
  })

  watch(() => props.modelValue, (newVal) => {
    if (!map) return

    if (!newVal) {
      if (marker) {
        marker.remove()
        marker = null
      }
      currentPosition.value = null
      return
    }

    const current = currentPosition.value
    if (current && current.lat === newVal.lat && current.lng === newVal.lng) return
    addMarker(maptilersdk, newVal)
    map.flyTo({ center: [newVal.lng, newVal.lat], zoom: map.getZoom() })
  })

  // bounds must be applied before flying to a new center, otherwise the camera
  // gets clamped by the still-stale maxBounds and lands away from the pin
  watch(
    [() => props.center, () => props.boundsCenter, () => props.boundsRadiusKm],
    ([newCenter, newBoundsCenter, newBoundsRadius]) => {
      if (!map) return

      map.setMaxBounds(
        newBoundsCenter && newBoundsRadius
          ? boundsToMaxBounds(newBoundsCenter, newBoundsRadius)
          : null,
      )

      // drop a default pin at `center` (e.g. province selected) as long as the user hasn't picked their own spot yet
      if (props.modelValue || currentPosition.value) return
      map.flyTo({ center: [newCenter.lng, newCenter.lat], zoom: props.zoom })
      if (!props.readonly) {
        addMarker(maptilersdk, newCenter)
        emit('update:modelValue', newCenter)
      }
    },
  )
})

function addMarker(sdk: any, latlng: LatLng) {
  outOfBounds.value = false

  if (marker) marker.remove()

  marker = new sdk.Marker({
    draggable: !props.readonly,
    color: '#10b981',
  })
    .setLngLat([latlng.lng, latlng.lat])
    .addTo(map)

  currentPosition.value = latlng

  if (!props.readonly) {
    marker.on('dragend', () => {
      const pos = marker.getLngLat()
      const val = { lat: pos.lat, lng: pos.lng }

      if (!isWithinBounds(val)) {
        outOfBounds.value = true
        // snap the marker back to the last valid position
        marker.setLngLat([currentPosition.value!.lng, currentPosition.value!.lat])
        return
      }

      currentPosition.value = val
      emit('update:modelValue', val)
    })
  }
}

function useMyLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const val = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    if (!map) return
    if (!isWithinBounds(val)) {
      outOfBounds.value = true
      return
    }
    const sdk = await import('@maptiler/sdk')
    addMarker(sdk, val)
    map.flyTo({ center: [val.lng, val.lat], zoom: 16 })
    emit('update:modelValue', val)
  })
}

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
