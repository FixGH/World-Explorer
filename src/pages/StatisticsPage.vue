<template>
  <v-container class="py-6 py-md-8 statistics-page">
    <!-- Hero -->
    <section class="stats-hero" aria-labelledby="stats-hero-title">
      <div class="stats-hero__aurora" aria-hidden="true" />
      <div class="stats-hero__mesh" aria-hidden="true" />
      <div class="stats-hero__particles" aria-hidden="true">
        <span v-for="i in 10" :key="i" class="stats-hero__dot" />
      </div>
      <div class="stats-hero__layout">
        <div class="stats-hero__copy">
          <p class="stats-hero__eyebrow">World Explorer</p>
          <h1 id="stats-hero-title" class="stats-hero__title">Statistiques mondiales</h1>
          <p class="stats-hero__lead">
            Panorama analytique de la planète : volumes globaux, records, répartitions régionales et classements.
          </p>
        </div>
        <div class="stats-hero__globe" aria-hidden="true">
          <div class="stats-hero__globe-ring" />
          <div class="stats-hero__globe-core">
            <v-icon icon="mdi-chart-bubble" size="112" class="stats-hero__globe-icon" />
          </div>
        </div>
      </div>
    </section>

    <v-alert v-if="store.loading" type="info" variant="tonal" rounded="xl" class="stats-alert mb-6">
      Chargement des statistiques…
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" rounded="xl" class="stats-alert mb-6">
      {{ store.error }}
    </v-alert>

    <template v-else>
      <!-- Vue d'ensemble -->
      <section class="stats-section">
        <header class="stats-section-header">
          <h2 class="stats-heading">
            <span class="stats-heading-icon" aria-hidden="true" />
            Vue d’ensemble
          </h2>
        </header>
        <div class="stats-kpi-shell stats-kpi-shell--overview">
          <StatsSummaryCards :items="summaryItems" :md="3" margin-bottom="mb-0" />
        </div>
      </section>

      <!-- Records mondiaux -->
      <section class="stats-section stats-section--featured">
        <header class="stats-section-header">
          <h2 class="stats-heading">
            <span class="stats-heading-icon" aria-hidden="true" />
            Records mondiaux
          </h2>
          <p class="stats-section-desc">
            Les extrêmes qui structurent votre atlas — population, superficie, frontières et densité.
          </p>
        </header>
        <div class="stats-records-grid">
          <component
            v-for="rec in worldRecords"
            :key="rec.key"
            :is="rec.to ? 'RouterLink' : 'div'"
            v-bind="rec.to ? { to: rec.to } : {}"
            class="stat-record-tile"
            :class="{ 'stat-record-tile--disabled': !rec.to }"
          >
            <div class="stat-record-tile__glow" aria-hidden="true" />
            <v-avatar size="60" rounded="lg" class="stat-record-tile__flag">
              <v-img v-if="rec.country" :src="flagSrc(rec.country)" :alt="rec.name || ''" cover>
                <template #error>
                  <v-sheet class="stat-record-fallback d-flex align-center justify-center fill-height">
                    <v-icon icon="mdi-flag-outline" size="28" />
                  </v-sheet>
                </template>
              </v-img>
              <v-icon v-else icon="mdi-earth-off" size="30" />
            </v-avatar>
            <div class="stat-record-tile__body">
              <span class="stat-record-tile__kicker">{{ rec.kicker }}</span>
              <span class="stat-record-tile__name">{{ rec.name }}</span>
              <span class="stat-record-tile__metric">{{ rec.metric }}</span>
            </div>
            <v-icon v-if="rec.to" icon="mdi-chevron-right" class="stat-record-tile__chev" aria-hidden="true" />
          </component>
        </div>
      </section>

      <!-- Analyse : régions + indicateurs -->
      <v-row class="stats-analysis-row" align="stretch">
        <v-col cols="12" lg="7" class="stats-analysis-col">
          <section class="stats-section stats-section--inset stats-section--panel">
            <header class="stats-section-header">
              <h2 class="stats-heading">
                <span class="stats-heading-icon" aria-hidden="true" />
                Répartition par région
              </h2>
              <p class="stats-section-desc">Distribution des pays par grande zone géographique.</p>
            </header>
            <v-card class="stats-panel region-panel" rounded="xl">
              <v-card-text class="region-panel__body">
                <v-list class="region-list py-0">
                  <v-list-item
                    v-for="region in regionalItems"
                    :key="region.label"
                    class="region-item rounded-xl"
                  >
                    <div class="region-item-inner">
                      <div class="region-item-icon" aria-hidden="true">
                        <v-icon :icon="regionIcon(region.key)" size="24" />
                      </div>
                      <div class="region-item-text">
                        <span class="region-name">{{ region.label }}</span>
                        <span class="region-count">
                          {{ formatIntFr(region.count) }} pays · {{ regionShareLabel(region.count) }}
                        </span>
                      </div>
                      <div class="region-progress">
                        <div class="region-progress-track">
                          <div
                            class="region-progress-fill"
                            :style="{ width: `${regionProgress(region.count)}%` }"
                          />
                        </div>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </section>
        </v-col>

        <v-col cols="12" lg="5" class="stats-analysis-col">
          <section v-if="keyIndicatorItems.length" class="stats-section stats-section--inset stats-section--panel">
            <header class="stats-section-header">
              <h2 class="stats-heading">
                <span class="stats-heading-icon" aria-hidden="true" />
                Indicateurs clés
              </h2>
              <p class="stats-section-desc">Moyennes et signaux complémentaires issus des données.</p>
            </header>
            <div class="stats-kpi-shell stats-kpi-shell--compact stats-kpi-shell--stacked">
              <StatsSummaryCards :items="keyIndicatorItems" :md="12" margin-bottom="mb-0" />
            </div>
          </section>
        </v-col>
      </v-row>

      <!-- Classements -->
      <section class="stats-section stats-section--rankings">
        <header class="stats-section-header">
          <h2 class="stats-heading">
            <span class="stats-heading-icon" aria-hidden="true" />
            Classements
          </h2>
          <p class="stats-section-desc">
            Top 10 par population, superficie, frontières et pays les moins peuplés.
          </p>
        </header>

        <v-row class="rankings-row" align="stretch">
          <v-col cols="12" md="6" class="ranking-col">
            <TopCountriesList
              title="Les plus peuplés"
              :items="store.topPopulatedCountries"
              :value-accessor="populationValue"
              :formatter="populationFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" class="ranking-col">
            <TopCountriesList
              title="Les plus grands"
              :items="store.topLargestCountries"
              :value-accessor="areaValue"
              :formatter="areaFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" class="ranking-col">
            <TopCountriesList
              title="Les plus frontaliers"
              :items="store.topBorderCountries"
              :value-accessor="bordersValue"
              :formatter="bordersFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" class="ranking-col">
            <TopCountriesList
              title="Les moins peuplés"
              :items="topLeastPopulated"
              :value-accessor="populationValue"
              :formatter="populationFormatter"
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
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const store = useCountriesStore()

const regionLabels = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

function formatIntFr(n) {
  return Math.round(Number(n)).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

function formatDecimalFr(n, minD = 0, maxD = 2) {
  return Number(n).toLocaleString('fr-FR', {
    minimumFractionDigits: minD,
    maximumFractionDigits: maxD,
  })
}

function flagSrc(country) {
  return getCountryFlagSrc(country)
}

function regionIcon(region) {
  const map = {
    Africa: 'mdi-island',
    Americas: 'mdi-weather-sunset',
    Asia: 'mdi-pine-tree',
    Europe: 'mdi-terrain',
    Oceania: 'mdi-waves',
    Antarctic: 'mdi-snowflake',
  }
  return map[region] || 'mdi-earth'
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
    icon: 'mdi-map-outline',
  },
  {
    label: 'Population totale cumulée',
    value: `${formatIntFr(store.totalPopulation)} habitants`,
    icon: 'mdi-account-group-outline',
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
      icon: 'mdi-ruler-square',
    },
  ]
})

const keyIndicatorItems = computed(() => [...insightItems.value, ...averageItems.value])

const regionalItems = computed(() => {
  return store.regionDistribution.map((item) => ({
    key: item.region,
    label: regionLabels[item.region] || item.region,
    count: item.count,
  }))
})

const topLeastPopulated = computed(() => {
  return [...store.countries]
    .filter((c) => Number.isFinite(c?.population))
    .sort((a, b) => (a.population || 0) - (b.population || 0))
    .slice(0, 10)
})

const worldRecords = computed(() => {
  const to = (c) => (c?.cca3 ? { name: 'country-details', params: { code: c.cca3 } } : undefined)
  const list = []

  const mp = store.mostPopulatedCountry
  list.push({
    key: 'pop',
    kicker: 'Plus peuplé',
    country: mp,
    name: mp?.name?.common || '—',
    metric: mp ? populationFormatter(populationValue(mp)) : '—',
    to: to(mp),
  })

  const lg = store.largestCountry
  list.push({
    key: 'area',
    kicker: 'Plus vaste',
    country: lg,
    name: lg?.name?.common || '—',
    metric: lg ? areaFormatter(areaValue(lg)) : '—',
    to: to(lg),
  })

  const br = store.mostBorderedCountry
  list.push({
    key: 'borders',
    kicker: 'Plus de frontières',
    country: br,
    name: br?.name?.common || '—',
    metric: br ? bordersFormatter(bordersValue(br)) : '—',
    to: to(br),
  })

  const dn = store.mostDenseCountry
  list.push({
    key: 'dense',
    kicker: 'Plus dense',
    country: dn,
    name: dn?.name?.common || '—',
    metric: dn ? densityFormatter(dn) : '—',
    to: to(dn),
  })

  return list
})

function regionShareLabel(count) {
  const total = store.totalCountries
  if (!total) return '—'
  const pct = (count / total) * 100
  return `${formatDecimalFr(pct, 0, 1)} %`
}

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

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.statistics-page {
  --stats-section-gap: clamp(40px, 5vw, 64px);
  --stats-block-gap: 20px;
  --stats-card-gap: 20px;
  --stats-card-pad: clamp(20px, 2.5vw, 28px);
  --stats-shadow-soft: 0 8px 28px rgba(0, 0, 0, 0.22);
  --stats-shadow-lift: 0 14px 36px rgba(0, 0, 0, 0.28);

  max-width: min(100%, 1420px) !important;
  padding-inline: clamp(12px, 2vw, 20px) !important;
}

/* --- Hero --- */
.stats-hero {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: clamp(26px, 4.5vw, 48px) clamp(20px, 3.5vw, 40px);
  margin-bottom: var(--stats-section-gap);
  min-height: min(320px, 52vw);
  display: flex;
  align-items: center;
  background: linear-gradient(165deg, rgba(12, 32, 38, 0.95), rgba(6, 14, 18, 0.98));
  box-shadow: var(--stats-shadow-lift);
  isolation: isolate;
}

.stats-hero__aurora {
  position: absolute;
  inset: -45%;
  pointer-events: none;
  background: radial-gradient(circle at 22% 35%, rgba(124, 243, 232, 0.28), transparent 42%),
    radial-gradient(circle at 88% 28%, rgba(54, 168, 255, 0.22), transparent 38%);
  animation: stats-aurora 16s ease-in-out infinite alternate;
}

@keyframes stats-aurora {
  0% {
    transform: translate(-3%, -1%) scale(1);
  }
  100% {
    transform: translate(4%, 2%) scale(1.06);
  }
}

.stats-hero__mesh {
  position: absolute;
  inset: 0;
  opacity: 0.28;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 35%, black 15%, transparent 72%);
}

.stats-hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.stats-hero__dot {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(200, 255, 252, 0.55);
  box-shadow: 0 0 10px rgba(124, 243, 232, 0.55);
  animation: stats-twinkle 4.2s ease-in-out infinite;
}

.stats-hero__dot:nth-child(1) {
  top: 14%;
  left: 10%;
  animation-delay: 0s;
}
.stats-hero__dot:nth-child(2) {
  top: 22%;
  left: 24%;
  animation-delay: 0.5s;
}
.stats-hero__dot:nth-child(3) {
  top: 10%;
  left: 42%;
  animation-delay: 1s;
}
.stats-hero__dot:nth-child(4) {
  top: 30%;
  left: 58%;
  animation-delay: 0.3s;
}
.stats-hero__dot:nth-child(5) {
  top: 18%;
  left: 78%;
  animation-delay: 1.4s;
}
.stats-hero__dot:nth-child(6) {
  top: 48%;
  left: 8%;
  animation-delay: 0.8s;
}
.stats-hero__dot:nth-child(7) {
  top: 42%;
  left: 32%;
  animation-delay: 2s;
}
.stats-hero__dot:nth-child(8) {
  top: 52%;
  left: 52%;
  animation-delay: 0.2s;
}
.stats-hero__dot:nth-child(9) {
  top: 38%;
  left: 88%;
  animation-delay: 1.8s;
}
.stats-hero__dot:nth-child(10) {
  top: 68%;
  left: 18%;
  animation-delay: 1.1s;
}
@keyframes stats-twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.stats-hero__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(180px, 0.5fr);
  gap: clamp(16px, 3vw, 36px);
  align-items: center;
  width: 100%;
}

.stats-hero__eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 236, 232, 0.88);
  margin: 0 0 12px;
}

.stats-hero__title {
  margin: 0 0 14px;
  font-size: clamp(1.85rem, 1.2rem + 2.2vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: rgba(248, 255, 255, 0.98);
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
}

.stats-hero__lead {
  margin: 0;
  max-width: 36rem;
  font-size: clamp(0.98rem, 0.92rem + 0.2vw, 1.12rem);
  line-height: 1.65;
  color: rgba(198, 228, 228, 0.9);
  font-weight: 500;
}

.stats-hero__globe {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.stats-hero__globe-ring {
  position: absolute;
  width: min(220px, 40vw);
  height: min(220px, 40vw);
  border-radius: 50%;
  border: 1px solid rgba(124, 243, 232, 0.2);
  animation: stats-ring 5s ease-in-out infinite;
}

@keyframes stats-ring {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}

.stats-hero__globe-core {
  position: relative;
  width: min(160px, 34vw);
  height: min(160px, 34vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.18), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(23, 215, 209, 0.35), rgba(8, 22, 28, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  animation: stats-globe-float 5.5s ease-in-out infinite;
}

@keyframes stats-globe-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.stats-hero__globe-icon {
  color: rgba(236, 255, 252, 0.95);
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35));
}

.stats-alert {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
}

/* --- KPI shells (StatsSummaryCards) --- */
.stats-kpi-shell :deep(.v-row) {
  margin: 0;
  row-gap: var(--stats-card-gap);
}

.stats-kpi-shell :deep(.v-col) {
  padding-top: calc(var(--stats-card-gap) / 2);
  padding-bottom: calc(var(--stats-card-gap) / 2);
}

.stats-kpi-shell :deep(.summary-card) {
  border-radius: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.06), rgba(6, 16, 22, 0.9));
  box-shadow: var(--stats-shadow-soft);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.stats-kpi-shell :deep(.summary-card:hover) {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.28);
  box-shadow: var(--stats-shadow-lift);
}

.stats-kpi-shell :deep(.v-card-text) {
  padding: var(--stats-card-pad) !important;
}

.stats-kpi-shell--compact :deep(.summary-card) {
  min-height: 116px;
}

.stats-kpi-shell--compact :deep(.summary-label) {
  margin-bottom: 10px !important;
}

.stats-kpi-shell--compact :deep(.summary-headline) {
  font-size: 1.05rem;
  line-height: 1.4;
}

.stats-kpi-shell--compact :deep(.summary-detail) {
  margin-top: 8px !important;
}

.stats-kpi-shell--compact :deep(.summary-icon-wrap) {
  width: 44px;
  height: 44px;
  margin-top: 2px;
}

.stats-kpi-shell--stacked {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
}

.stats-kpi-shell :deep(.summary-icon-wrap) {
  transition: transform 0.25s ease;
}

.stats-kpi-shell :deep(.summary-card:hover .summary-icon-wrap) {
  transform: scale(1.06) rotate(-2deg);
}

.stats-kpi-shell :deep(.summary-value),
.stats-kpi-shell :deep(.summary-headline) {
  font-variant-numeric: tabular-nums;
}

/* --- Record tiles --- */
.stats-records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--stats-card-gap);
}

.stat-record-tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  height: 100%;
  min-height: 132px;
  padding: 20px 22px;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.07), rgba(6, 16, 22, 0.94));
  box-shadow: var(--stats-shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-record-tile--disabled {
  cursor: default;
  opacity: 0.75;
}

.stat-record-tile:not(.stat-record-tile--disabled):hover {
  transform: translateY(-3px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow: var(--stats-shadow-lift);
}

.stat-record-tile__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  background: radial-gradient(circle at 20% 20%, rgba(124, 243, 232, 0.18), transparent 55%);
}

.stat-record-tile:hover .stat-record-tile__glow {
  opacity: 1;
}

.stat-record-tile__flag {
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
}

.stat-record-fallback {
  background: linear-gradient(145deg, rgba(14, 26, 32, 0.95), rgba(22, 40, 48, 0.88));
}

.stat-record-tile__body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-record-tile__kicker {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(140, 200, 200, 0.85);
}

.stat-record-tile__name {
  font-size: 1.12rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
  line-height: 1.25;
}

.stat-record-tile__metric {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(124, 243, 232, 0.88);
  font-variant-numeric: tabular-nums;
}

.stat-record-tile__chev {
  flex-shrink: 0;
  color: rgba(124, 243, 232, 0.55);
  transition: transform 0.22s ease, color 0.22s ease;
}

.stat-record-tile:hover .stat-record-tile__chev {
  transform: translateX(3px);
  color: rgba(124, 243, 232, 0.95);
}

/* --- Section chrome --- */
.stats-section {
  margin-bottom: var(--stats-section-gap);
  position: relative;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: calc(var(--stats-section-gap) * -0.5);
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(124, 243, 232, 0.12) 20%,
    rgba(124, 243, 232, 0.12) 80%,
    transparent
  );
  pointer-events: none;
}

.stats-section:first-of-type::before,
.stats-hero + .stats-section::before,
.stats-alert + .stats-section::before {
  display: none;
}

.stats-section--rankings {
  margin-bottom: clamp(24px, 3vw, 40px);
}

.stats-section--rankings::before {
  top: calc(var(--stats-section-gap) * -0.45);
}

.stats-section-header {
  margin-bottom: var(--stats-block-gap);
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.stats-section-header::after {
  content: '';
  display: block;
  width: 48px;
  height: 2px;
  margin-top: 12px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), transparent);
  opacity: 0.65;
}

.stats-heading {
  margin: 0 0 8px;
  font-size: clamp(1.05rem, 0.95rem + 0.35vw, 1.28rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(240, 255, 255, 0.96);
  display: flex;
  align-items: center;
  gap: 14px;
}

.stats-heading-icon {
  width: 3px;
  height: 28px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgb(var(--v-theme-primary)), rgba(124, 243, 232, 0.2));
  box-shadow: 0 0 16px rgba(23, 215, 209, 0.35);
  flex-shrink: 0;
}

.stats-section-desc {
  margin: 0;
  max-width: 40rem;
  line-height: 1.6;
  color: rgba(176, 208, 208, 0.82);
  font-size: 0.94rem;
  font-weight: 500;
}

.stats-analysis-row {
  margin-bottom: var(--stats-section-gap);
  row-gap: var(--stats-section-gap);
  position: relative;
}

.stats-analysis-row::before {
  content: '';
  position: absolute;
  top: calc(var(--stats-section-gap) * -0.5);
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(124, 243, 232, 0.12) 20%,
    rgba(124, 243, 232, 0.12) 80%,
    transparent
  );
  pointer-events: none;
}

.stats-analysis-col {
  display: flex;
  flex-direction: column;
}

.stats-section--inset {
  margin-bottom: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.stats-section--inset::before {
  display: none;
}

.stats-section--panel {
  min-height: 0;
}

.stats-section--inset .stats-section-header {
  margin-bottom: var(--stats-block-gap);
  flex-shrink: 0;
}

.stats-section--inset .stats-panel,
.stats-section--inset .stats-kpi-shell {
  flex: 1 1 auto;
}

/* --- Régions : barres custom animées --- */
.stats-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(6, 16, 22, 0.92));
  box-shadow: var(--stats-shadow-soft);
}

.region-panel {
  overflow: visible;
}

.region-panel__body {
  padding: var(--stats-card-pad) !important;
}

.region-list {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.region-list :deep(.v-list-item) {
  padding-inline: 16px !important;
  min-height: 0 !important;
}

.region-item {
  min-height: 84px !important;
  margin-bottom: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(0, 0, 0, 0.1);
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.region-item:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.05);
  box-shadow: none;
}

.region-item-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  padding: 14px 0;
}

.region-item-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(124, 243, 232, 0.18);
}

.region-item-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.region-name {
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.region-count {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(176, 208, 208, 0.78);
  font-variant-numeric: tabular-nums;
}

.region-progress {
  flex: 0 0 min(220px, 38%);
}

.region-progress-track {
  height: 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
}

.region-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(23, 215, 209, 0.75), rgba(124, 243, 232, 0.92));
  box-shadow: 0 0 20px rgba(23, 215, 209, 0.28);
  transition: width 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.region-progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.18) 50%, transparent 100%);
  animation: stats-shimmer 3.5s ease-in-out infinite;
  opacity: 0.4;
}

@keyframes stats-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.rankings-row {
  margin: 0;
  row-gap: var(--stats-card-gap);
}

.rankings-row :deep(.v-col) {
  padding-top: calc(var(--stats-card-gap) / 2);
  padding-bottom: calc(var(--stats-card-gap) / 2);
}

.ranking-col {
  display: flex;
  align-items: stretch;
}

.ranking-col > * {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

@media (max-width: 1279px) {
  .region-item-inner {
    flex-wrap: wrap;
  }

  .region-progress {
    flex: 1 1 100%;
    max-width: 100%;
    margin-top: 4px;
  }
}

@media (max-width: 959px) {
  .stats-hero__layout {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-hero__lead {
    margin-left: auto;
    margin-right: auto;
  }

  .stats-hero__globe {
    order: -1;
    min-height: 180px;
  }
}

@media (max-width: 600px) {
  .statistics-page {
    --stats-section-gap: 36px;
    --stats-card-gap: 16px;
    --stats-card-pad: 18px;
  }

  .region-item {
    min-height: 0 !important;
  }

  .region-item-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 12px 0;
  }

  .region-progress {
    flex: 1 1 auto;
    max-width: 100%;
    margin-top: 0;
  }

  .stat-record-tile {
    min-height: 120px;
    padding: 18px;
  }
}
</style>
