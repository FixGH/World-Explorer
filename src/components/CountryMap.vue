<template>
  <div class="country-map">
    <div ref="mapElement" class="map-canvas" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  latlng: {
    type: Array,
    required: true,
  },
  countryName: {
    type: String,
    default: 'Pays',
  },
})

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const mapElement = ref(null)
let map = null
let marker = null

function validCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])
}

function setView() {
  if (!map || !validCoordinates(props.latlng)) return

  const [lat, lng] = props.latlng
  map.setView([lat, lng], 5)

  if (marker) {
    marker.setLatLng([lat, lng]).bindPopup(props.countryName)
  } else {
    marker = L.marker([lat, lng]).addTo(map).bindPopup(props.countryName)
  }
}

function initializeMap() {
  if (!mapElement.value || map || !validCoordinates(props.latlng)) return

  map = L.map(mapElement.value, { zoomControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  setView()
  nextTick(() => map?.invalidateSize())
}

onMounted(() => {
  initializeMap()
})

watch(
  () => props.latlng,
  () => {
    if (!map) {
      initializeMap()
      return
    }
    setView()
  },
  { deep: true },
)

watch(
  () => props.countryName,
  () => {
    if (marker) {
      marker.bindPopup(props.countryName)
    }
  },
)

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>

<style scoped>
.country-map {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.map-canvas {
  width: 100%;
  height: 320px;
  border-radius: 12px;
}
</style>
