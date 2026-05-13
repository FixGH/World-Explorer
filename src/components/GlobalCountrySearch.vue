<template>
  <div ref="searchRoot" class="global-country-search">
    <v-text-field
      v-model="query"
      density="compact"
      variant="solo"
      hide-details
      rounded="lg"
      single-line
      placeholder="Rechercher un pays..."
      prepend-inner-icon="mdi-magnify"
      @focus="open = hasQuery"
      @keydown="onKeydown"
    />

    <v-expand-transition>
      <v-sheet v-if="showDropdown" class="search-dropdown" elevation="6">
        <v-list density="compact" class="py-1">
          <v-list-item
            v-for="(item, index) in suggestions"
            :key="item.code"
            :class="{ 'search-item--active': index === activeIndex }"
            rounded="lg"
            class="search-item"
            @mouseenter="activeIndex = index"
            @mousedown.prevent="selectCountry(item.code)"
          >
            <template #prepend>
              <v-avatar size="28" rounded="lg" class="flag-avatar">
                <v-img v-if="item.flagSrc" :src="item.flagSrc" :alt="item.name" cover>
                  <template #error>
                    <v-icon icon="mdi-flag-outline" />
                  </template>
                </v-img>
                <v-icon v-else icon="mdi-flag-outline" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption text-medium-emphasis">
              {{ item.region || 'Région non disponible' }} - {{ item.code }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="hasMoreResults" disabled>
            <v-list-item-title class="text-caption text-medium-emphasis">
              Affinez votre recherche pour voir plus de résultats
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-if="!suggestions.length" disabled>
            <v-list-item-title class="text-body-2 text-medium-emphasis">
              Aucun pays trouvé
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const MAX_RESULTS = 15

const store = useCountriesStore()
const router = useRouter()
const searchRoot = ref(null)
const query = ref('')
const open = ref(false)
const activeIndex = ref(0)

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

const hasQuery = computed(() => Boolean(query.value.trim()))
const matchedCountries = computed(() => {
  const q = normalizeText(query.value)
  if (!q) return []

  return store.countrySearchItems
    .filter((item) => normalizeText(item.name).startsWith(q))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
})

const suggestions = computed(() => matchedCountries.value.slice(0, MAX_RESULTS))
const hasMoreResults = computed(() => matchedCountries.value.length > MAX_RESULTS)
const showDropdown = computed(() => open.value && hasQuery.value)

function closeDropdown() {
  open.value = false
}

function selectCountry(code) {
  if (!code) return
  router.push({ name: 'country-details', params: { code } })
  query.value = ''
  closeDropdown()
}

function onKeydown(event) {
  if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown()
    return
  }

  if (!showDropdown.value || !suggestions.value.length) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    selectCountry(suggestions.value[activeIndex.value]?.code)
  }
}

function onOutsidePointerDown(event) {
  if (!searchRoot.value) return
  if (!searchRoot.value.contains(event.target)) {
    closeDropdown()
  }
}

watch(
  () => query.value,
  (value) => {
    open.value = Boolean(value.trim())
  },
)

watch(
  () => suggestions.value.length,
  () => {
    activeIndex.value = 0
  },
)

onMounted(() => {
  if (!store.countries.length && !store.loading && !store.error) {
    store.fetchCountries()
  }
  window.addEventListener('pointerdown', onOutsidePointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onOutsidePointerDown)
})
</script>

<style scoped>
.global-country-search {
  position: relative;
  width: 100%;
  min-width: 0;
  max-width: 420px;
}

.global-country-search :deep(.v-field) {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(5, 17, 20, 0.4);
  backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(7, 16, 20, 0.95);
  backdrop-filter: blur(10px);
}

.search-item {
  cursor: pointer;
}

.search-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}

.search-item--active {
  background: rgba(var(--v-theme-primary), 0.14);
}

.flag-avatar {
  overflow: hidden;
}
</style>
