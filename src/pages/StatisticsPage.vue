<template>
  <v-container class="py-6 py-md-8 statistics-page">
    <v-card variant="tonal" rounded="lg" class="mb-8 stats-hero">
      <v-card-text class="py-6 px-5 px-md-8">
        <h1 class="text-h4 font-weight-bold mb-2">Statistiques</h1>
        <p class="text-body-1 text-medium-emphasis mb-0 stats-hero-lead">
          Synthèses et classements à partir des pays chargés (API REST Countries et éventuels pays locaux).
        </p>
      </v-card-text>
    </v-card>

    <v-alert v-if="store.loading" type="info" variant="tonal" rounded="lg" class="mb-6">
      Chargement des statistiques…
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" rounded="lg" class="mb-6">
      {{ store.error }}
    </v-alert>

    <template v-else>
      <!-- Vue d'ensemble -->
      <section class="stats-section stats-section--major mb-10 mb-md-12">
        <h2 class="stats-heading mb-6">
          <span class="stats-heading-icon" aria-hidden="true" />
          Vue d’ensemble
        </h2>
        <StatsSummaryCards :items="summaryItems" :md="3" margin-bottom="mb-0" />
      </section>

      <!-- Indicateurs clés -->
      <section class="stats-section stats-section--major mb-10 mb-md-12">
        <h2 class="stats-heading mb-2">
          <span class="stats-heading-icon" aria-hidden="true" />
          Indicateurs clés
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-6 stats-section-desc">
          Comparaisons utiles et records globaux sur le jeu de données actuel.
        </p>

        <h3 class="stats-subheading mb-4">Complémentaires</h3>
        <StatsSummaryCards
          v-if="insightItems.length"
          :items="insightItems"
          :md="4"
          margin-bottom="mb-6"
        />

        <h3 class="stats-subheading mb-4">Moyennes</h3>
        <StatsSummaryCards
          v-if="averageItems.length"
          :items="averageItems"
          :md="6"
          margin-bottom="mb-8"
        />

        <h3 class="stats-subheading mb-4">Records mondiaux</h3>
        <v-card class="stats-panel stats-records-card" rounded="lg">
          <v-list class="py-2 px-2 px-md-3">
            <v-list-item
              title="Pays le plus peuplé"
              :subtitle="recordSubtitle(store.mostPopulatedCountry, populationFormatter)"
              :to="recordTo(store.mostPopulatedCountry)"
              rounded="lg"
              class="record-item mb-2"
            />
            <v-list-item
              title="Pays le plus grand"
              :subtitle="recordSubtitle(store.largestCountry, areaFormatter)"
              :to="recordTo(store.largestCountry)"
              rounded="lg"
              class="record-item mb-2"
            />
            <v-list-item
              title="Pays avec le plus de frontières terrestres"
              :subtitle="recordSubtitle(store.mostBorderedCountry, bordersFormatter)"
              :to="recordTo(store.mostBorderedCountry)"
              rounded="lg"
              class="record-item"
            />
          </v-list>
        </v-card>
      </section>

      <!-- Répartition par région -->
      <section class="stats-section stats-section--major mb-10 mb-md-12">
        <h2 class="stats-heading mb-6">
          <span class="stats-heading-icon" aria-hidden="true" />
          Répartition par région
        </h2>
        <v-card class="stats-panel region-panel" rounded="lg">
          <v-card-text class="pa-2 pa-md-4">
            <v-list class="region-list py-0">
              <v-list-item
                v-for="region in regionalItems"
                :key="region.label"
                class="region-item rounded-xl mb-2 px-3 px-md-4"
              >
                <div class="region-item-inner">
                  <div class="region-item-text">
                    <span class="region-name">{{ region.label }}</span>
                    <span class="region-count text-caption text-medium-emphasis">
                      {{ formatIntFr(region.count) }} pays
                    </span>
                  </div>
                  <div class="region-progress">
                    <v-progress-linear
                      :model-value="regionProgress(region.count)"
                      color="primary"
                      bg-color="grey-darken-2"
                      height="10"
                      rounded
                    />
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </section>

      <!-- Classements -->
      <section class="stats-section mb-4">
        <h2 class="stats-heading mb-6">
          <span class="stats-heading-icon" aria-hidden="true" />
          Classements
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-8 stats-section-desc">
          Top 10 par population, superficie et nombre de frontières terrestres.
        </p>
        <v-row class="rankings-row">
          <v-col cols="12" lg="4">
            <TopCountriesList
              title="Les plus peuplés"
              :items="store.topPopulatedCountries"
              :value-accessor="populationValue"
              :formatter="populationFormatter"
            />
          </v-col>

          <v-col cols="12" lg="4">
            <TopCountriesList
              title="Les plus grands"
              :items="store.topLargestCountries"
              :value-accessor="areaValue"
              :formatter="areaFormatter"
            />
          </v-col>

          <v-col cols="12" lg="4">
            <TopCountriesList
              title="Les plus frontaliers"
              :items="store.topBorderCountries"
              :value-accessor="bordersValue"
              :formatter="bordersFormatter"
            />
          </v-col>
        </v-row>
      </section>
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

/** Entiers avec espaces insécables / groupement français */
function formatIntFr(n) {
  return Math.round(Number(n)).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

/** Nombres décimaux (ex. km² moyenne) */
function formatDecimalFr(n, minD = 0, maxD = 2) {
  return Number(n).toLocaleString('fr-FR', {
    minimumFractionDigits: minD,
    maximumFractionDigits: maxD,
  })
}

const summaryItems = computed(() => [
  {
    label: 'Nombre total de pays',
    value: formatIntFr(store.totalCountries),
    icon: 'mdi-earth',
  },
  {
    label: 'Régions représentées',
    value: formatIntFr(store.totalRegions),
    icon: 'mdi-map',
  },
  {
    label: 'Population totale cumulée',
    value: `${formatIntFr(store.totalPopulation)} habitants`,
    icon: 'mdi-account-group',
  },
  {
    label: 'Superficie totale cumulée',
    value: `${formatDecimalFr(store.totalArea, 0, 2)} km²`,
    icon: 'mdi-ruler-square',
  },
])

const insightItems = computed(() => {
  const items = []

  const lr = store.leadingRegionByCount
  if (lr) {
    items.push({
      label: 'Région la plus représentée',
      headline: regionLabels[lr.region] || lr.region,
      detail: `${formatIntFr(lr.count)} pays`,
      icon: 'mdi-map-marker-multiple-outline',
    })
  }

  const lp = store.leastPopulatedCountry
  if (lp) {
    items.push({
      label: 'Pays le moins peuplé',
      headline: lp.name?.common || 'Non disponible',
      detail: populationFormatter(populationValue(lp)),
      icon: 'mdi-account-arrow-down-outline',
    })
  }

  const dense = store.mostDenseCountry
  if (dense) {
    items.push({
      label: 'Plus forte densité démographique',
      headline: dense.name?.common || 'Non disponible',
      detail: densityFormatter(dense),
      icon: 'mdi-speedometer',
    })
  }

  return items
})

const averageItems = computed(() => {
  const ap = store.averagePopulationPerCountry
  const aa = store.averageAreaPerCountry
  if (ap == null || aa == null) return []
  return [
    {
      label: 'Population moyenne (par pays)',
      headline: formatIntFr(Math.round(ap)),
      detail: 'habitants',
      icon: 'mdi-chart-timeline-variant',
    },
    {
      label: 'Superficie moyenne (par pays)',
      headline: formatDecimalFr(aa, 2, 2),
      detail: 'km²',
      icon: 'mdi-ruler-square-outline',
    },
  ]
})

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
  return `${formatIntFr(value)} habitants`
}

function areaFormatter(value) {
  return `${formatDecimalFr(value, 0, 2)} km²`
}

function bordersFormatter(value) {
  return `${formatIntFr(value)} frontière(s)`
}

function densityFormatter(country) {
  const population = Number(country?.population)
  const area = Number(country?.area)
  if (!Number.isFinite(population) || !Number.isFinite(area) || area <= 0) return 'Non disponible'
  const d = population / area
  return `${formatDecimalFr(d, 2, 2)} hab./km²`
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
  return `${country.name?.common || 'Non disponible'} — ${formatter(numericValue)}`
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
.statistics-page {
  max-width: 100%;
}

.stats-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.16), rgba(255, 255, 255, 0.03));
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
}

.stats-hero-lead {
  max-width: 640px;
  line-height: 1.55;
}

.stats-section--major {
  padding-bottom: 4px;
}

.stats-heading {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: rgba(230, 252, 252, 0.92);
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-heading-icon {
  width: 4px;
  height: 22px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgb(var(--v-theme-primary)), rgba(124, 243, 232, 0.35));
  flex-shrink: 0;
}

.stats-subheading {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(168, 210, 210, 0.82);
}

.stats-section-desc {
  max-width: 720px;
  line-height: 1.5;
}

.stats-panel {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.02);
}

.stats-records-card :deep(.v-list-item-subtitle) {
  opacity: 0.95;
  white-space: normal;
  line-height: 1.45;
}

.region-panel {
  overflow: hidden;
}

.region-list {
  max-width: 100%;
}

.region-item {
  min-height: 56px !important;
}

.region-item-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  padding: 10px 0;
}

.region-item-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.region-name {
  font-weight: 600;
  font-size: 0.94rem;
}

.region-progress {
  flex: 0 0 min(160px, 38%);
}

.record-item {
  transition: background-color 0.18s ease;
  border: 1px solid transparent;
}

.record-item:hover {
  background: rgba(var(--v-theme-primary), 0.07);
  border-color: rgba(var(--v-theme-primary), 0.12);
}

.rankings-row {
  row-gap: 24px;
}

@media (max-width: 600px) {
  .region-item-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .region-progress {
    flex: 1 1 auto;
    max-width: 100%;
  }
}
</style>
