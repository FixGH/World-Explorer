<template>
  <v-container class="py-6">
    <HomeHero />

    <v-divider class="my-6" />

    <div class="d-flex align-center justify-space-between mb-3">
      <h2 class="text-h5 font-weight-bold">Vue d'ensemble mondiale</h2>
    </div>
    <GlobalStatsCards :stats="stats" />

    <div class="d-flex align-center justify-space-between mb-3">
      <h2 class="text-h5 font-weight-bold">Ce que vous pouvez faire</h2>
    </div>
    <FeatureHighlights />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import HomeHero from '@/components/HomeHero.vue'
import GlobalStatsCards from '@/components/GlobalStatsCards.vue'
import FeatureHighlights from '@/components/FeatureHighlights.vue'

const store = useCountriesStore()

const stats = computed(() => [
  {
    label: 'Nombre total de pays',
    value: store.totalCountries.toLocaleString('fr-FR'),
    icon: 'mdi-flag',
  },
  {
    label: 'Régions représentées',
    value: store.totalRegions.toLocaleString('fr-FR'),
    icon: 'mdi-earth',
  },
  {
    label: 'Population totale',
    value: store.totalPopulation.toLocaleString('fr-FR'),
    icon: 'mdi-account-group',
  },
  {
    label: 'Pays favoris',
    value: store.favoritesCount.toLocaleString('fr-FR'),
    icon: 'mdi-heart',
  },
])

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>
