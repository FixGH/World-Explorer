<template>
  <v-container class="py-6">
    <div class="my-4">
      <h1 class="text-h4">Statistiques</h1>
      <p class="text-medium-emphasis mt-1">
        Analyse globale des pays et classements clés.
      </p>
    </div>

    <v-alert v-if="store.loading" type="info" variant="tonal" class="mb-4">
      Chargement des statistiques...
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <template v-else>
      <StatsSummaryCards :items="summaryItems" />

      <v-row>
        <v-col cols="12" md="4">
          <TopCountriesList
            title="Top 10 des pays les plus peuplés"
            :items="store.topPopulatedCountries"
            :value-accessor="populationValue"
            :formatter="populationFormatter"
          />
        </v-col>

        <v-col cols="12" md="4">
          <TopCountriesList
            title="Top 10 des pays les plus grands"
            :items="store.topLargestCountries"
            :value-accessor="areaValue"
            :formatter="areaFormatter"
          />
        </v-col>

        <v-col cols="12" md="4">
          <TopCountriesList
            title="Top 10 des pays les plus frontaliers"
            :items="store.topBorderCountries"
            :value-accessor="bordersValue"
            :formatter="bordersFormatter"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import StatsSummaryCards from '@/components/StatsSummaryCards.vue'
import TopCountriesList from '@/components/TopCountriesList.vue'

const store = useCountriesStore()

const summaryItems = computed(() => [
  {
    label: 'Nombre total de pays',
    value: store.totalCountries.toLocaleString('fr-FR'),
    icon: 'mdi-earth',
  },
  {
    label: 'Régions représentées',
    value: store.totalRegions.toLocaleString('fr-FR'),
    icon: 'mdi-map',
  },
  {
    label: 'Population totale cumulée',
    value: store.totalPopulation.toLocaleString('fr-FR'),
    icon: 'mdi-account-group',
  },
  {
    label: 'Superficie totale cumulée',
    value: `${store.totalArea.toLocaleString('fr-FR')} km²`,
    icon: 'mdi-ruler-square',
  },
])

function populationValue(country) {
  return Number(country?.population || 0)
}

function areaValue(country) {
  return Number(country?.area || 0)
}

function bordersValue(country) {
  return Number(country?.borders?.length || 0)
}

function populationFormatter(value) {
  return `${value.toLocaleString('fr-FR')} habitants`
}

function areaFormatter(value) {
  return `${value.toLocaleString('fr-FR')} km²`
}

function bordersFormatter(value) {
  return `${value.toLocaleString('fr-FR')} frontière(s)`
}

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>
