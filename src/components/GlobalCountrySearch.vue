<template>
  <div class="global-country-search">
    <v-autocomplete
      v-model="selectedCode"
      :items="countryItems"
      :loading="store.loading"
      item-title="title"
      item-value="value"
      density="compact"
      variant="solo"
      hide-details
      rounded="lg"
      clearable
      menu-icon=""
      placeholder="Rechercher un pays..."
      prepend-inner-icon="mdi-magnify"
      no-data-text="Aucun pays trouvé"
      @update:model-value="onSelect"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const store = useCountriesStore()
const router = useRouter()
const selectedCode = ref(null)

const countryItems = computed(() => {
  return store.countries.map((c) => ({
    title: `${c.name?.common || 'Sans nom'} (${c.cca3})`,
    value: c.cca3,
  }))
})

function onSelect(code) {
  if (!code) return
  router.push({ name: 'country-details', params: { code } })
  selectedCode.value = null
}

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
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
</style>
