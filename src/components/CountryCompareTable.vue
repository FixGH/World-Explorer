<template>
  <v-card class="compare-table-card" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
      <span>Comparaison détaillée</span>
      <v-chip size="small" variant="tonal" color="primary">
        Mise en évidence des écarts
      </v-chip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-table density="comfortable" class="compare-table">
        <thead>
          <tr>
            <th class="text-left">Champ</th>
            <th class="text-left">{{ leftTitle }}</th>
            <th class="text-left">{{ rightTitle }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Drapeau</strong></td>
            <td>
              <v-img
                v-if="left"
                :src="leftFlagSrc"
                :alt="left.name?.common"
                height="56"
                width="88"
                cover
              >
                <template #error>
                  <v-sheet height="56" width="88" class="d-flex align-center justify-center">
                    <v-icon icon="mdi-flag-outline" />
                  </v-sheet>
                </template>
              </v-img>
              <span v-else class="text-medium-emphasis">Non disponible</span>
            </td>
            <td>
              <v-img
                v-if="right"
                :src="rightFlagSrc"
                :alt="right.name?.common"
                height="56"
                width="88"
                cover
              >
                <template #error>
                  <v-sheet height="56" width="88" class="d-flex align-center justify-center">
                    <v-icon icon="mdi-flag-outline" />
                  </v-sheet>
                </template>
              </v-img>
              <span v-else class="text-medium-emphasis">Non disponible</span>
            </td>
          </tr>

          <tr>
            <td><strong>Nom commun</strong></td>
            <td>{{ left?.name?.common || fallback }}</td>
            <td>{{ right?.name?.common || fallback }}</td>
          </tr>
          <tr>
            <td><strong>Capitale</strong></td>
            <td>{{ left?.capital?.[0] || fallback }}</td>
            <td>{{ right?.capital?.[0] || fallback }}</td>
          </tr>
          <tr>
            <td><strong>Région</strong></td>
            <td>{{ leftRegionLabel }}</td>
            <td>{{ rightRegionLabel }}</td>
          </tr>
          <tr>
            <td><strong>Sous-région</strong></td>
            <td>{{ left?.subregion || fallback }}</td>
            <td>{{ right?.subregion || fallback }}</td>
          </tr>
          <tr>
            <td><strong>Continents</strong></td>
            <td>{{ leftContinents }}</td>
            <td>{{ rightContinents }}</td>
          </tr>
          <tr>
            <td><strong>Langues</strong></td>
            <td>{{ leftLanguages }}</td>
            <td>{{ rightLanguages }}</td>
          </tr>
          <tr>
            <td><strong>Monnaies</strong></td>
            <td>{{ leftCurrencies }}</td>
            <td>{{ rightCurrencies }}</td>
          </tr>
          <tr class="metric-row">
            <td><strong>Population</strong></td>
            <td :class="cellClass('population', 'left')">
              <div class="metric-cell">
                <span>{{ leftPopulation }}</span>
                <v-chip v-if="winnerFor('population') === 'left'" size="x-small" color="success" variant="tonal" prepend-icon="mdi-trending-up">
                  Plus peuplé
                </v-chip>
              </div>
            </td>
            <td :class="cellClass('population', 'right')">
              <div class="metric-cell">
                <span>{{ rightPopulation }}</span>
                <v-chip v-if="winnerFor('population') === 'right'" size="x-small" color="success" variant="tonal" prepend-icon="mdi-trending-up">
                  Plus peuplé
                </v-chip>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td><strong>Superficie</strong></td>
            <td :class="cellClass('area', 'left')">
              <div class="metric-cell">
                <span>{{ leftArea }}</span>
                <v-chip v-if="winnerFor('area') === 'left'" size="x-small" color="secondary" variant="tonal" prepend-icon="mdi-arrow-expand-all">
                  Plus vaste
                </v-chip>
              </div>
            </td>
            <td :class="cellClass('area', 'right')">
              <div class="metric-cell">
                <span>{{ rightArea }}</span>
                <v-chip v-if="winnerFor('area') === 'right'" size="x-small" color="secondary" variant="tonal" prepend-icon="mdi-arrow-expand-all">
                  Plus vaste
                </v-chip>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td><strong>Densité de population</strong></td>
            <td :class="cellClass('density', 'left')">
              <div class="metric-cell">
                <span>{{ leftDensity }}</span>
                <v-chip v-if="winnerFor('density') === 'left'" size="x-small" color="info" variant="tonal" prepend-icon="mdi-speedometer">
                  Plus dense
                </v-chip>
              </div>
            </td>
            <td :class="cellClass('density', 'right')">
              <div class="metric-cell">
                <span>{{ rightDensity }}</span>
                <v-chip v-if="winnerFor('density') === 'right'" size="x-small" color="info" variant="tonal" prepend-icon="mdi-speedometer">
                  Plus dense
                </v-chip>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td><strong>Frontières terrestres</strong></td>
            <td :class="cellClass('borders', 'left')">
              <div class="metric-cell">
                <span>{{ leftBorders }}</span>
                <v-chip v-if="winnerFor('borders') === 'left'" size="x-small" color="warning" variant="tonal" prepend-icon="mdi-transit-connection-variant">
                  Plus frontalier
                </v-chip>
              </div>
            </td>
            <td :class="cellClass('borders', 'right')">
              <div class="metric-cell">
                <span>{{ rightBorders }}</span>
                <v-chip v-if="winnerFor('borders') === 'right'" size="x-small" color="warning" variant="tonal" prepend-icon="mdi-transit-connection-variant">
                  Plus frontalier
                </v-chip>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Statut politique</strong></td>
            <td>{{ independentLabel(left?.independent) }}</td>
            <td>{{ independentLabel(right?.independent) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const props = defineProps({
  left: {
    type: Object,
    default: null,
  },
  right: {
    type: Object,
    default: null,
  },
})

const leftTitle = computed(() => props.left?.name?.common || 'Pays A')
const rightTitle = computed(() => props.right?.name?.common || 'Pays B')
const fallback = 'Non disponible'

const leftFlagSrc = computed(() => getCountryFlagSrc(props.left))
const rightFlagSrc = computed(() => getCountryFlagSrc(props.right))
const regionMap = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

const leftPopulation = computed(() => (props.left?.population ? `${props.left.population.toLocaleString('fr-FR')} habitants` : fallback))
const rightPopulation = computed(() => (props.right?.population ? `${props.right.population.toLocaleString('fr-FR')} habitants` : fallback))
const leftArea = computed(() => (Number.isFinite(props.left?.area) ? `${props.left.area.toLocaleString('fr-FR')} km²` : fallback))
const rightArea = computed(() => (Number.isFinite(props.right?.area) ? `${props.right.area.toLocaleString('fr-FR')} km²` : fallback))
const leftBorders = computed(() => {
  if (!Array.isArray(props.left?.borders)) return fallback
  return `${props.left.borders.length.toLocaleString('fr-FR')} frontière(s)`
})
const rightBorders = computed(() => {
  if (!Array.isArray(props.right?.borders)) return fallback
  return `${props.right.borders.length.toLocaleString('fr-FR')} frontière(s)`
})
const leftRegionLabel = computed(() => regionMap[props.left?.region] || props.left?.region || fallback)
const rightRegionLabel = computed(() => regionMap[props.right?.region] || props.right?.region || fallback)
const leftDensity = computed(() => formatDensity(props.left))
const rightDensity = computed(() => formatDensity(props.right))
const leftContinents = computed(() => joinValues(props.left?.continents))
const rightContinents = computed(() => joinValues(props.right?.continents))
const leftLanguages = computed(() => {
  const languages = props.left?.languages
  return languages ? joinValues(Object.values(languages)) : fallback
})
const rightLanguages = computed(() => {
  const languages = props.right?.languages
  return languages ? joinValues(Object.values(languages)) : fallback
})
const leftCurrencies = computed(() => formatCurrencies(props.left?.currencies))
const rightCurrencies = computed(() => formatCurrencies(props.right?.currencies))

function getMetricValue(metric, side) {
  const item = side === 'left' ? props.left : props.right
  if (!item) return null
  if (metric === 'population') return Number(item.population)
  if (metric === 'area') return Number(item.area)
  if (metric === 'borders') return Array.isArray(item.borders) ? Number(item.borders.length) : null
  if (metric === 'density') return getDensityValue(item)
  return null
}

function winnerFor(metric) {
  const leftValue = getMetricValue(metric, 'left')
  const rightValue = getMetricValue(metric, 'right')
  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue) || leftValue === rightValue) return null
  return leftValue > rightValue ? 'left' : 'right'
}

function cellClass(metric, side) {
  return winnerFor(metric) === side ? 'metric-winner' : ''
}

function independentLabel(value) {
  if (value === true) return 'Pays indépendant'
  if (value === false) return 'Territoire non indépendant'
  return fallback
}

function getDensityValue(item) {
  const population = Number(item?.population)
  const area = Number(item?.area)
  if (!Number.isFinite(population) || !Number.isFinite(area) || area <= 0) return null
  return population / area
}

function formatDensity(item) {
  const density = getDensityValue(item)
  if (!Number.isFinite(density)) return fallback
  return `${density.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} hab./km²`
}

function joinValues(values) {
  if (!Array.isArray(values) || values.length === 0) return fallback
  return values.join(', ')
}

function formatCurrencies(currencies) {
  if (!currencies || typeof currencies !== 'object') return fallback
  const entries = Object.values(currencies)
    .map((currency) => {
      const name = currency?.name || ''
      const symbol = currency?.symbol ? ` (${currency.symbol})` : ''
      return `${name}${symbol}`.trim()
    })
    .filter(Boolean)
  return entries.length ? entries.join(', ') : fallback
}
</script>

<style scoped>
.compare-table-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.compare-table :deep(table) {
  width: 100%;
  min-width: 520px;
}

.compare-table :deep(th) {
  font-weight: 700;
  color: rgba(228, 248, 248, 0.86);
}

.compare-table :deep(td) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.metric-row td {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.metric-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric-winner {
  background: rgba(var(--v-theme-primary), 0.12);
}

@media (max-width: 860px) {
  .metric-cell {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
