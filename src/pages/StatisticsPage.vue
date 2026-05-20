<template>
  <v-container class="py-6 py-md-8 statistics-page">
    <!-- Hero -->
    <section class="stats-hero" aria-labelledby="stats-hero-title">
      <div class="stats-hero__aurora" aria-hidden="true" />
      <div class="stats-hero__mesh" aria-hidden="true" />
      <div class="stats-hero__particles" aria-hidden="true">
        <span v-for="i in 18" :key="i" class="stats-hero__dot" />
      </div>
      <div class="stats-hero__layout">
        <div class="stats-hero__copy">
          <p class="stats-hero__eyebrow">World Explorer</p>
          <h1 id="stats-hero-title" class="stats-hero__title">Statistiques mondiales</h1>
          <p class="stats-hero__lead">
            Un panorama vivant de la planète : volumes, records, répartitions et curiosités géographiques — le tout
            calculé sur votre jeu de données actuel.
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
      <section class="stats-section stats-section--major mb-8 mb-md-10">
        <h2 class="stats-heading mb-6">
          <span class="stats-heading-icon" aria-hidden="true" />
          Vue d’ensemble
        </h2>
        <div class="stats-kpi-shell">
          <StatsSummaryCards :items="summaryItems" :md="3" margin-bottom="mb-0" />
        </div>
      </section>

      <!-- Records mondiaux -->
      <section class="stats-section stats-section--major mb-8 mb-md-10">
        <h2 class="stats-heading mb-2">
          <span class="stats-heading-icon" aria-hidden="true" />
          Records du monde
        </h2>
        <p class="stats-section-desc mb-6">
          Les extrêmes de votre atlas : population, superficie, frontières, densité et le pays le plus discret.
        </p>
        <v-row class="stats-records-row" align="stretch">
          <v-col v-for="rec in worldRecords" :key="rec.key" cols="12" sm="6" lg="4">
            <component
              :is="rec.to ? 'RouterLink' : 'div'"
              v-bind="rec.to ? { to: rec.to } : {}"
              class="stat-record-tile"
              :class="{ 'stat-record-tile--disabled': !rec.to }"
            >
              <div class="stat-record-tile__glow" aria-hidden="true" />
              <v-avatar size="52" rounded="lg" class="stat-record-tile__flag">
                <v-img v-if="rec.country" :src="flagSrc(rec.country)" :alt="rec.name || ''" cover>
                  <template #error>
                    <v-sheet class="stat-record-fallback d-flex align-center justify-center fill-height">
                      <v-icon icon="mdi-flag-outline" size="26" />
                    </v-sheet>
                  </template>
                </v-img>
                <v-icon v-else icon="mdi-earth-off" size="28" />
              </v-avatar>
              <div class="stat-record-tile__body">
                <span class="stat-record-tile__kicker">{{ rec.kicker }}</span>
                <span class="stat-record-tile__name">{{ rec.name }}</span>
                <span class="stat-record-tile__metric">{{ rec.metric }}</span>
              </div>
              <v-icon v-if="rec.to" icon="mdi-chevron-right" class="stat-record-tile__chev" aria-hidden="true" />
            </component>
          </v-col>
        </v-row>
      </section>

      <!-- Indicateurs clés -->
      <section class="stats-section stats-section--major mb-8 mb-md-10">
        <h2 class="stats-heading mb-2">
          <span class="stats-heading-icon" aria-hidden="true" />
          Indicateurs clés
        </h2>
        <p class="stats-section-desc mb-6">
          Tendances, moyennes et signaux complémentaires pour compléter les records.
        </p>

        <h3 class="stats-subheading mb-4">Complémentaires</h3>
        <div v-if="insightItems.length" class="stats-kpi-shell stats-kpi-shell--insights mb-8">
          <StatsSummaryCards :items="insightItems" :md="4" margin-bottom="mb-0" />
        </div>

        <h3 class="stats-subheading mb-4">Moyennes</h3>
        <div v-if="averageItems.length" class="stats-kpi-shell stats-kpi-shell--avg mb-8">
          <StatsSummaryCards :items="averageItems" :md="6" margin-bottom="mb-0" />
        </div>
      </section>

      <!-- Population moyenne par région -->
      <section v-if="continentPopAverages.length" class="stats-section stats-section--major mb-8 mb-md-10">
        <h2 class="stats-heading mb-2">
          <span class="stats-heading-icon" aria-hidden="true" />
          Population moyenne par région
        </h2>
        <p class="stats-section-desc mb-6">
          Répartition démographique moyenne sur les pays présents dans chaque grande zone.
        </p>
        <v-row class="stats-mini-avg-row" align="stretch">
          <v-col v-for="row in continentPopAverages" :key="row.region" cols="12" sm="6" md="4" lg="4">
            <v-card class="stats-mini-avg" rounded="xl" variant="flat">
              <v-card-text class="pa-5">
                <div class="stats-mini-avg__icon">
                  <v-icon :icon="regionIcon(row.region)" size="26" />
                </div>
                <div class="stats-mini-avg__label">{{ row.label }}</div>
                <div class="stats-mini-avg__value">{{ formatIntFr(Math.round(row.avg)) }}</div>
                <div class="stats-mini-avg__hint">habitants / pays (moy.)</div>
                <div class="stats-mini-avg__meta">{{ formatIntFr(row.countries) }} pays</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Répartition par région -->
      <section class="stats-section stats-section--major mb-8 mb-md-10">
        <h2 class="stats-heading mb-6">
          <span class="stats-heading-icon" aria-hidden="true" />
          Répartition par région
        </h2>
        <v-card class="stats-panel region-panel" rounded="xl">
          <v-card-text class="pa-4 pa-md-6">
            <v-list class="region-list py-0">
              <v-list-item
                v-for="region in regionalItems"
                :key="region.label"
                class="region-item rounded-xl mb-3 px-3 px-md-4"
              >
                <div class="region-item-inner">
                  <div class="region-item-icon" aria-hidden="true">
                    <v-icon :icon="regionIcon(region.key)" size="22" />
                  </div>
                  <div class="region-item-text">
                    <span class="region-name">{{ region.label }}</span>
                    <span class="region-count text-caption text-medium-emphasis">
                      {{ formatIntFr(region.count) }} pays
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

      <!-- Fait du monde -->
      <section class="stats-section mb-8 mb-md-10">
        <v-card class="stats-fact-card" rounded="xl" variant="flat">
          <v-card-text class="stats-fact-card__inner pa-6 pa-md-7 d-flex flex-wrap align-center ga-4">
            <div class="stats-fact-card__icon" aria-hidden="true">
              <v-icon icon="mdi-lightbulb-on-outline" size="32" />
            </div>
            <div class="stats-fact-card__copy flex-grow-1 min-width-0">
              <div class="stats-fact-card__kicker">Le saviez-vous ?</div>
              <p class="stats-fact-card__text mb-0">{{ worldFactLine }}</p>
            </div>
          </v-card-text>
        </v-card>
      </section>

      <!-- Classements -->
      <section class="stats-section mb-4">
        <h2 class="stats-heading mb-2">
          <span class="stats-heading-icon" aria-hidden="true" />
          Classements
        </h2>
        <p class="stats-section-desc mb-8">
          Top 10 par population, superficie, frontières — et les pays les plus discrets en nombre d’habitants.
        </p>

        <v-row class="rankings-row">
          <v-col cols="12" md="6" lg="3">
            <TopCountriesList
              title="Les plus peuplés"
              :items="store.topPopulatedCountries"
              :value-accessor="populationValue"
              :formatter="populationFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <TopCountriesList
              title="Les plus grands"
              :items="store.topLargestCountries"
              :value-accessor="areaValue"
              :formatter="areaFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <TopCountriesList
              title="Les plus frontaliers"
              :items="store.topBorderCountries"
              :value-accessor="bordersValue"
              :formatter="bordersFormatter"
            />
          </v-col>

          <v-col cols="12" md="6" lg="3">
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

const regionOrder = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']

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

const continentPopAverages = computed(() => {
  const sums = {}
  const counts = {}
  for (const c of store.countries) {
    const r = c?.region
    if (!r || !regionLabels[r]) continue
    sums[r] = (sums[r] || 0) + Number(c.population || 0)
    counts[r] = (counts[r] || 0) + 1
  }
  return regionOrder
    .map((region) => ({
      region,
      label: regionLabels[region],
      avg: counts[region] ? sums[region] / counts[region] : 0,
      countries: counts[region] || 0,
    }))
    .filter((row) => row.countries > 0)
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

  const lp = store.leastPopulatedCountry
  list.push({
    key: 'least',
    kicker: 'Moins peuplé',
    country: lp,
    name: lp?.name?.common || '—',
    metric: lp ? populationFormatter(populationValue(lp)) : '—',
    to: to(lp),
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

const worldFactLine = computed(() => {
  const n = store.totalCountries
  const p = store.totalPopulation
  const a = store.totalArea
  const idx = n % 4
  if (idx === 0) {
    return `Votre atlas compte ${formatIntFr(n)} pays pour une population cumulée d’environ ${formatIntFr(p)} habitants.`
  }
  if (idx === 1) {
    return `La superficie cumulée représente environ ${formatDecimalFr(a, 0, 0)} km² — l’équivalent de nombreuses terres émergées à explorer.`
  }
  if (idx === 2) {
    const lr = store.leadingRegionByCount
    if (lr) {
      return `La zone la plus fournie est ${regionLabels[lr.region] || lr.region}, avec ${formatIntFr(lr.count)} pays dans le jeu de données.`
    }
  }
  return 'Chaque indicateur se met à jour avec les pays chargés : comparez, ouvrez les fiches, et observez les extrêmes évoluer.'
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

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.statistics-page {
  max-width: min(100%, 1320px) !important;
}

/* --- Hero --- */
.stats-hero {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: clamp(26px, 4.5vw, 48px) clamp(20px, 3.5vw, 40px);
  margin-bottom: clamp(24px, 4vw, 40px);
  min-height: min(320px, 52vw);
  display: flex;
  align-items: center;
  background: linear-gradient(165deg, rgba(12, 32, 38, 0.95), rgba(6, 14, 18, 0.98));
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
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
.stats-hero__dot:nth-child(11) {
  top: 72%;
  left: 44%;
  animation-delay: 2.4s;
}
.stats-hero__dot:nth-child(12) {
  top: 62%;
  left: 72%;
  animation-delay: 0.6s;
}
.stats-hero__dot:nth-child(13) {
  top: 82%;
  left: 28%;
  animation-delay: 1.6s;
}
.stats-hero__dot:nth-child(14) {
  top: 8%;
  left: 92%;
  animation-delay: 2.2s;
}
.stats-hero__dot:nth-child(15) {
  top: 56%;
  left: 66%;
  animation-delay: 0.9s;
}
.stats-hero__dot:nth-child(16) {
  top: 26%;
  left: 6%;
  animation-delay: 1.2s;
}
.stats-hero__dot:nth-child(17) {
  top: 76%;
  left: 92%;
  animation-delay: 2.6s;
}
.stats-hero__dot:nth-child(18) {
  top: 88%;
  left: 58%;
  animation-delay: 0.4s;
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
.stats-kpi-shell :deep(.summary-card) {
  border-radius: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.06), rgba(6, 16, 22, 0.9));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.26);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.stats-kpi-shell :deep(.summary-card:hover) {
  transform: translateY(-5px);
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow:
    0 22px 52px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(124, 243, 232, 0.1) inset;
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
.stat-record-tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  min-height: 112px;
  padding: 16px 18px;
  border-radius: 18px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.055), rgba(6, 16, 22, 0.92));
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.stat-record-tile--disabled {
  cursor: default;
  opacity: 0.75;
}

.stat-record-tile:not(.stat-record-tile--disabled):hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.42);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.36),
    0 0 40px rgba(23, 215, 209, 0.1);
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
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  font-size: 1.05rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
  line-height: 1.25;
}

.stat-record-tile__metric {
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(200, 232, 230, 0.9);
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

.stats-records-row {
  row-gap: 16px;
}

/* --- Section chrome --- */
.stats-section--major {
  padding-bottom: 2px;
}

.stats-heading {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(228, 252, 252, 0.94);
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-heading-icon {
  width: 4px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgb(var(--v-theme-primary)), rgba(124, 243, 232, 0.35));
  flex-shrink: 0;
}

.stats-subheading {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(168, 210, 210, 0.82);
}

.stats-section-desc {
  max-width: 46rem;
  line-height: 1.55;
  color: rgba(186, 218, 218, 0.88);
  font-size: 0.95rem;
  font-weight: 500;
}

/* --- Mini moyennes continent --- */
.stats-mini-avg {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(6, 16, 22, 0.88));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
  transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
  height: 100%;
}

.stats-mini-avg:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.35);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
}

.stats-mini-avg__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(124, 243, 232, 0.2);
}

.stats-mini-avg__label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(170, 210, 210, 0.85);
  margin-bottom: 6px;
}

.stats-mini-avg__value {
  font-size: 1.35rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
  line-height: 1.2;
}

.stats-mini-avg__hint {
  font-size: 0.78rem;
  color: rgba(188, 218, 218, 0.8);
  margin-bottom: 8px;
}

.stats-mini-avg__meta {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(124, 243, 232, 0.75);
}

.stats-mini-avg-row {
  row-gap: 14px;
}

/* --- Régions : barres custom animées --- */
.stats-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(6, 16, 22, 0.92));
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
}

.region-panel {
  overflow: hidden;
}

.region-list {
  max-width: 100%;
}

.region-item {
  min-height: 64px !important;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.12);
  transition: border-color 0.22s ease, background-color 0.22s ease;
}

.region-item:hover {
  border-color: rgba(var(--v-theme-primary), 0.25);
  background: rgba(var(--v-theme-primary), 0.06);
}

.region-item-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 8px 0;
}

.region-item-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
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
  gap: 4px;
}

.region-name {
  font-weight: 700;
  font-size: 0.98rem;
}

.region-progress {
  flex: 0 0 min(200px, 36%);
}

.region-progress-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
}

.region-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(23, 215, 209, 0.85), rgba(124, 243, 232, 0.95));
  box-shadow: 0 0 18px rgba(23, 215, 209, 0.35);
  transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.region-progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%);
  animation: stats-shimmer 2.8s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes stats-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* --- Fait --- */
.stats-fact-card {
  border: 1px solid rgba(124, 243, 232, 0.18);
  background: linear-gradient(120deg, rgba(23, 215, 209, 0.1), rgba(6, 16, 22, 0.92));
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
}

.stats-fact-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(124, 243, 232, 0.22);
}

.stats-fact-card__kicker {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(186, 228, 226, 0.88);
  margin-bottom: 6px;
}

.stats-fact-card__text {
  font-size: 1.02rem;
  line-height: 1.55;
  color: rgba(220, 244, 244, 0.94);
  font-weight: 500;
}

.rankings-row {
  row-gap: 22px;
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
