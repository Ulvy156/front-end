<template>
  <div class="space-y-2">
    <button
      class="px-3 py-2 rounded bg-black text-white"
      @click="useMyLocation"
    >
      📍 Use my location
    </button>

    <div ref="mapEl" class="h-[400px] w-full rounded-lg"></div>

    <div v-if="selected" class="text-sm">
      Selected:
      <b>{{ selected.lat.toFixed(6) }}</b>,
      <b>{{ selected.lng.toFixed(6) }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mapEl = ref<HTMLElement | null>(null)

const selected = ref<{ lat: number; lng: number } | null>(null)

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement

function waitForGoogleMaps(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.maps) {
      resolve()
      return
    }

    const interval = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(interval)
        resolve()
      }
    }, 50)
  })
}


onMounted(async () => {
  await waitForGoogleMaps() // ⬅️ THIS FIXES IT

  const center = { lat: 11.5564, lng: 104.9282 }

  map = new google.maps.Map(mapEl.value!, {
    center,
    zoom: 14,
    mapId: 'YOUR_MAP_ID',
  })

  const { AdvancedMarkerElement } =
    (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary

  marker = new AdvancedMarkerElement({
    map,
    position: center,
    gmpDraggable: true,
  })
})


function useMyLocation() {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    map.setCenter({ lat, lng })
    marker.position = { lat, lng }
    selected.value = { lat, lng }
  })
}
</script>
