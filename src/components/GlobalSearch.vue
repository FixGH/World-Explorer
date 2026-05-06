<template>
  <div ref="searchRoot" class="global-search">
    <v-text-field
      v-model="query"
      density="comfortable"
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
            @mousedown.prevent="navigateTo(item.code)"
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

const MAX_SUGGESTIONS = 15

const store = useCountriesStore()
const router = useRouter()

const searchRoot = ref(null)
const query = ref('')
const open = ref(false)
const activeIndex = ref(0)
const hasQuery = computed(() => Boolean(query.value.trim()))

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const matchedResults = computed(() => {
  const normalizedQuery = normalizeSearchText(query.value.trim())
  if (!normalizedQuery) return []

  return store.countrySearchItems
    .filter((item) => normalizeSearchText(item.name).startsWith(normalizedQuery))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
})

const suggestions = computed(() => matchedResults.value.slice(0, MAX_SUGGESTIONS))
const showDropdown = computed(() => open.value && hasQuery.value)

function closeDropdown() {
  open.value = false
}

function navigateTo(code) {
  if (!code) return
  router.push({ name: 'country-details', params: { code } })
  query.value = ''
  closeDropdown()
}

function onKeydown(e) {
  if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeDropdown()
    return
  }

  if (!showDropdown.value || !suggestions.value.length) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    const targetIndex = Math.min(Math.max(activeIndex.value, 0), suggestions.value.length - 1)
    navigateTo(suggestions.value[targetIndex]?.code)
  }
}

function onDocumentPointerDown(event) {
  if (!searchRoot.value) return
  if (!searchRoot.value.contains(event.target)) {
    closeDropdown()
  }
}

watch(
  () => suggestions.value.length,
  () => {
    activeIndex.value = 0
  },
)

watch(
  () => query.value,
  (value) => {
    open.value = Boolean(value.trim())
  },
)

onMounted(() => {
  if (!store.countries.length && !store.loading && !store.error) {
    store.fetchCountries()
  }
  window.addEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() => {
  closeDropdown()
  window.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<style scoped>
.global-search {
  position: relative;
  min-width: 260px;
  width: 100%;
  max-width: 420px;
}

.global-search :deep(.v-field) {
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
  z-index: 10;
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

@media (max-width: 959px) {
  .global-search {
    max-width: none;
  }
}
</style>

