<template>
  <v-container class="py-6">
    <v-card variant="tonal" rounded="lg" class="mb-5 stats-hero">
      <v-card-text class="py-5">
        <h1 class="text-h4 font-weight-bold">Statistiques</h1>
        <p class="text-medium-emphasis mt-2">
          Analyse globale des pays et classements clés.
        </p>
      </v-card-text>
    </v-card>

    <v-alert v-if="store.loading" type="info" variant="tonal" class="mb-4">
      Chargement des statistiques...
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <template v-else>
      <StatsSummaryCards :items="summaryItems" />

      <v-row class="mb-5">
        <v-col cols="12" md="6">
          <v-card class="h-100 stats-panel" rounded="lg">
            <v-card-title>Répartition par région</v-card-title>
            <v-divider />
            <v-list class="py-2">
              <v-list-item
                v-for="region in regionalItems"
                :key="region.label"
                :title="region.label"
                :subtitle="`${region.count.toLocaleString('fr-FR')} pays`"
              >
                <template #append>
                  <v-progress-linear
                    :model-value="regionProgress(region.count)"
                    color="primary"
                    bg-color="grey-darken-1"
                    height="10"
                    rounded
                    style="width: 155px"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="h-100 stats-panel" rounded="lg">
            <v-card-title>Records mondiaux</v-card-title>
            <v-divider />
            <v-list class="py-2">
              <v-list-item
                title="Pays le plus peuplé"
                :subtitle="recordSubtitle(store.mostPopulatedCountry, populationFormatter)"
                :to="recordTo(store.mostPopulatedCountry)"
                rounded="lg"
                class="record-item"
              />
              <v-list-item
                title="Pays le plus grand"
                :subtitle="recordSubtitle(store.largestCountry, areaFormatter)"
                :to="recordTo(store.largestCountry)"
                rounded="lg"
                class="record-item"
              />
              <v-list-item
                title="Pays avec le plus de frontières"
                :subtitle="recordSubtitle(store.mostBorderedCountry, bordersFormatter)"
                :to="recordTo(store.mostBorderedCountry)"
                rounded="lg"
                class="record-item"
              />
            </v-list>
          </v-card>
        </v-col>
      </v-row>

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

const regionLabels = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

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

const regionalItems = computed(() => {
  return store.regionDistribution.map((item) => ({
    label: regionLabels[item.region] || item.region,
    count: item.count,
  }))
})

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

function regionProgress(value) {
  const max = Math.max(...regionalItems.value.map((item) => item.count), 0)
  if (max <= 0) return 0
  return (value / max) * 100
}

function recordSubtitle(country, formatter) {
  if (!country) return 'Non disponible'
  const isBordersFormatter = formatter === bordersFormatter
  const numericValue = isBordersFormatter ? bordersValue(country) : formatter === areaFormatter ? areaValue(country) : populationValue(country)
  return `${country.name?.common || 'Non disponible'} - ${formatter(numericValue)}`
}

function recordTo(country) {
  if (!country?.cca3) return undefined
  return { name: 'country-details', params: { code: country.cca3 } }
}

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.stats-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, rgba(var(--v-theme-primary), 0.2), rgba(255, 255, 255, 0.03));
}

.stats-panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.record-item {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.record-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(2px);
}
</style>
