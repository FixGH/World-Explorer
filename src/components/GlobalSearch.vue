<template>
  <div class="global-search" @keydown="onKeydown">
    <v-text-field
      v-model="query"
      density="comfortable"
      variant="solo"
      hide-details
      rounded="lg"
      single-line
      placeholder="Rechercher un pays..."
      prepend-inner-icon="mdi-magnify"
      @focus="open = true"
      @keydown="onKeydown"
      @blur="onBlur"
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
              {{ item.code }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="!suggestions.length" disabled>
            <v-list-item-title class="text-body-2 text-medium-emphasis">
              Aucun résultat
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const store = useCountriesStore()
const router = useRouter()

const query = ref('')
const open = ref(false)
const activeIndex = ref(0)

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []

  return store.countrySearchItems
    .filter((item) => item.name.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q)
      const bStarts = b.name.toLowerCase().startsWith(q)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    })
    .slice(0, 5)
})

const showDropdown = computed(() => open.value && query.value.trim().length > 0)

function navigateTo(code) {
  if (!code) return
  router.push({ name: 'country-details', params: { code } })
  query.value = ''
  open.value = false
}

function onBlur() {
  // Laisser le temps au clic (mousedown.prevent) de déclencher la navigation.
  window.setTimeout(() => {
    open.value = false
  }, 120)
}

function onKeydown(e) {
  if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return
  if (!suggestions.value.length) {
    if (e.key === 'Escape') open.value = false
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
    open.value = true
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
    open.value = true
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    const targetIndex = Math.min(Math.max(activeIndex.value, 0), suggestions.value.length - 1)
    navigateTo(suggestions.value[targetIndex]?.code)
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
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

onBeforeUnmount(() => {
  open.value = false
})
</script>

<style scoped>
.global-search {
  position: relative;
  min-width: 260px;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 10;
  border-radius: 16px;
  overflow: hidden;
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

