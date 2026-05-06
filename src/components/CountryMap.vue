<template>
  <div class="country-map">
    <div ref="mapElement" class="map-canvas" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const mapMarkerIcon = L.divIcon({
  className: 'we-map-marker-wrap',
  html: '<span class="we-map-marker"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -18],
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
    marker = L.marker([lat, lng], { icon: mapMarkerIcon }).addTo(map).bindPopup(props.countryName)
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

.country-map :deep(.we-map-marker-wrap) {
  background: transparent;
  border: none;
}

.country-map :deep(.we-map-marker) {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(96, 243, 233, 1), rgba(var(--v-theme-primary), 0.95));
  border: 2px solid rgba(6, 20, 24, 0.72);
  box-shadow: 0 0 0 6px rgba(var(--v-theme-primary), 0.2);
}

.country-map :deep(.we-map-marker)::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 8px;
  height: 8px;
  background: rgba(var(--v-theme-primary), 0.9);
  border-radius: 0 0 2px 0;
  transform: translateX(-50%) rotate(45deg);
}
</style>
