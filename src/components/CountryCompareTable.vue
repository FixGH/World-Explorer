<template>
  <v-card class="compare-table-card" rounded="lg" elevation="0">
    <v-card-title class="compare-table-title pa-5 pb-2">
      <div>
        <span class="text-h6 font-weight-bold d-block">Tableau comparatif</span>
        <span class="text-caption text-medium-emphasis">
          Les lignes en surbrillance indiquent la valeur la plus élevée pour les indicateurs numériques.
        </span>
      </div>
      <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-chart-box-outline" class="flex-shrink-0">
        Indicateurs clés
      </v-chip>
    </v-card-title>
    <v-divider class="opacity-25" />
    <v-card-text class="pa-0 compare-table-scroll-wrap">
      <v-table density="comfortable" class="compare-table">
        <thead>
          <tr>
            <th class="text-left compare-th-field">Critère</th>
            <th class="text-left compare-th-side compare-th-left">
              <span class="compare-th-label">{{ leftTitle }}</span>
            </th>
            <th class="text-left compare-th-side compare-th-right">
              <span class="compare-th-label">{{ rightTitle }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="compare-field-cell"><strong>Drapeau</strong></td>
            <td class="compare-val-cell compare-val-left">
              <div class="flag-cell">
                <v-img
                  v-if="left"
                  :src="leftFlagSrc"
                  :alt="left.name?.common"
                  height="56"
                  width="88"
                  cover
                  rounded="lg"
                  class="compare-flag-img"
                >
                  <template #error>
                    <v-sheet height="56" width="88" class="d-flex align-center justify-center rounded-lg">
                      <v-icon icon="mdi-flag-outline" />
                    </v-sheet>
                  </template>
                </v-img>
                <span v-else class="text-medium-emphasis">—</span>
              </div>
            </td>
            <td class="compare-val-cell compare-val-right">
              <div class="flag-cell">
                <v-img
                  v-if="right"
                  :src="rightFlagSrc"
                  :alt="right.name?.common"
                  height="56"
                  width="88"
                  cover
                  rounded="lg"
                  class="compare-flag-img"
                >
                  <template #error>
                    <v-sheet height="56" width="88" class="d-flex align-center justify-center rounded-lg">
                      <v-icon icon="mdi-flag-outline" />
                    </v-sheet>
                  </template>
                </v-img>
                <span v-else class="text-medium-emphasis">—</span>
              </div>
            </td>
          </tr>

          <tr>
            <td class="compare-field-cell"><strong>Nom commun</strong></td>
            <td class="compare-val-cell compare-val-left">{{ left?.name?.common || fallback }}</td>
            <td class="compare-val-cell compare-val-right">{{ right?.name?.common || fallback }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Capitale</strong></td>
            <td class="compare-val-cell compare-val-left">{{ left?.capital?.[0] || fallback }}</td>
            <td class="compare-val-cell compare-val-right">{{ right?.capital?.[0] || fallback }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Région</strong></td>
            <td class="compare-val-cell compare-val-left">{{ leftRegionLabel }}</td>
            <td class="compare-val-cell compare-val-right">{{ rightRegionLabel }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Sous-région</strong></td>
            <td class="compare-val-cell compare-val-left">{{ left?.subregion || fallback }}</td>
            <td class="compare-val-cell compare-val-right">{{ right?.subregion || fallback }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Continents</strong></td>
            <td class="compare-val-cell compare-val-left">{{ leftContinents }}</td>
            <td class="compare-val-cell compare-val-right">{{ rightContinents }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Langues</strong></td>
            <td class="compare-val-cell compare-val-left">{{ leftLanguages }}</td>
            <td class="compare-val-cell compare-val-right">{{ rightLanguages }}</td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Monnaies</strong></td>
            <td class="compare-val-cell compare-val-left">{{ leftCurrencies }}</td>
            <td class="compare-val-cell compare-val-right">{{ rightCurrencies }}</td>
          </tr>
          <tr class="metric-row">
            <td class="compare-field-cell"><strong>Population</strong></td>
            <td :class="['compare-val-cell', 'compare-val-left', cellClass('population', 'left')]">
              <div class="metric-cell">
                <span class="metric-value">{{ leftPopulation }}</span>
                <span v-if="winnerFor('population') === 'left'" class="winner-badge winner-badge--population">
                  <v-icon icon="mdi-account-multiple" size="14" class="mr-1" />
                  Population plus élevée
                </span>
              </div>
            </td>
            <td :class="['compare-val-cell', 'compare-val-right', cellClass('population', 'right')]">
              <div class="metric-cell">
                <span class="metric-value">{{ rightPopulation }}</span>
                <span v-if="winnerFor('population') === 'right'" class="winner-badge winner-badge--population">
                  <v-icon icon="mdi-account-multiple" size="14" class="mr-1" />
                  Population plus élevée
                </span>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td class="compare-field-cell"><strong>Superficie</strong></td>
            <td :class="['compare-val-cell', 'compare-val-left', cellClass('area', 'left')]">
              <div class="metric-cell">
                <span class="metric-value">{{ leftArea }}</span>
                <span v-if="winnerFor('area') === 'left'" class="winner-badge winner-badge--area">
                  <v-icon icon="mdi-ruler-square" size="14" class="mr-1" />
                  Superficie plus grande
                </span>
              </div>
            </td>
            <td :class="['compare-val-cell', 'compare-val-right', cellClass('area', 'right')]">
              <div class="metric-cell">
                <span class="metric-value">{{ rightArea }}</span>
                <span v-if="winnerFor('area') === 'right'" class="winner-badge winner-badge--area">
                  <v-icon icon="mdi-ruler-square" size="14" class="mr-1" />
                  Superficie plus grande
                </span>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td class="compare-field-cell"><strong>Densité de population</strong></td>
            <td :class="['compare-val-cell', 'compare-val-left', cellClass('density', 'left')]">
              <div class="metric-cell">
                <span class="metric-value">{{ leftDensity }}</span>
                <span v-if="winnerFor('density') === 'left'" class="winner-badge winner-badge--density">
                  <v-icon icon="mdi-speedometer" size="14" class="mr-1" />
                  Densité plus forte
                </span>
              </div>
            </td>
            <td :class="['compare-val-cell', 'compare-val-right', cellClass('density', 'right')]">
              <div class="metric-cell">
                <span class="metric-value">{{ rightDensity }}</span>
                <span v-if="winnerFor('density') === 'right'" class="winner-badge winner-badge--density">
                  <v-icon icon="mdi-speedometer" size="14" class="mr-1" />
                  Densité plus forte
                </span>
              </div>
            </td>
          </tr>
          <tr class="metric-row">
            <td class="compare-field-cell"><strong>Frontières terrestres</strong></td>
            <td :class="['compare-val-cell', 'compare-val-left', cellClass('borders', 'left')]">
              <div class="metric-cell">
                <span class="metric-value">{{ leftBorders }}</span>
                <span v-if="winnerFor('borders') === 'left'" class="winner-badge winner-badge--borders">
                  <v-icon icon="mdi-road-variant" size="14" class="mr-1" />
                  Plus de frontières
                </span>
              </div>
            </td>
            <td :class="['compare-val-cell', 'compare-val-right', cellClass('borders', 'right')]">
              <div class="metric-cell">
                <span class="metric-value">{{ rightBorders }}</span>
                <span v-if="winnerFor('borders') === 'right'" class="winner-badge winner-badge--borders">
                  <v-icon icon="mdi-road-variant" size="14" class="mr-1" />
                  Plus de frontières
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="compare-field-cell"><strong>Statut politique</strong></td>
            <td class="compare-val-cell compare-val-left">{{ independentLabel(left?.independent) }}</td>
            <td class="compare-val-cell compare-val-right">{{ independentLabel(right?.independent) }}</td>
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
  if (value === true) return 'État indépendant'
  if (value === false) return 'Territoire dépendant'
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
  overflow: hidden;
}

.compare-table-title {
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.compare-table-scroll-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.compare-table :deep(table) {
  width: 100%;
  min-width: 520px;
  border-collapse: separate;
  border-spacing: 0;
}

.compare-table :deep(thead th) {
  position: sticky;
  top: 0;
  z-index: 3;
}

.compare-th-field {
  z-index: 4 !important;
  min-width: 132px;
  max-width: 38vw;
  padding: 14px 16px !important;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(186, 218, 218, 0.85);
  background: linear-gradient(180deg, rgba(14, 22, 28, 0.98), rgba(12, 18, 24, 0.98)) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  vertical-align: bottom;
}

.compare-th-side {
  padding: 14px 18px !important;
  font-weight: 700;
  font-size: 0.95rem;
  border-bottom: 2px solid transparent !important;
  vertical-align: bottom;
}

.compare-th-left {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border-bottom-color: rgba(var(--v-theme-primary), 0.45) !important;
  color: rgba(236, 252, 252, 0.96);
}

.compare-th-right {
  background: rgba(var(--v-theme-secondary), 0.1) !important;
  border-bottom-color: rgba(var(--v-theme-secondary), 0.45) !important;
  color: rgba(236, 244, 255, 0.96);
}

.compare-th-label {
  display: inline-block;
  max-width: 220px;
  line-height: 1.3;
}

.compare-field-cell {
  position: sticky;
  left: 0;
  z-index: 2;
  min-width: 128px;
  max-width: 40vw;
  padding: 14px 16px !important;
  font-size: 0.82rem;
  color: rgba(200, 228, 228, 0.88);
  background: linear-gradient(90deg, rgba(10, 16, 20, 0.98) 70%, rgba(10, 16, 20, 0.85) 100%) !important;
  box-shadow: 6px 0 14px rgba(0, 0, 0, 0.18);
  vertical-align: top;
}

.compare-val-cell {
  padding: 14px 18px !important;
  font-size: 0.9rem;
  line-height: 1.45;
  vertical-align: top;
  color: rgba(236, 252, 252, 0.94);
}

.compare-val-left {
  background: rgba(var(--v-theme-primary), 0.04);
}

.compare-val-right {
  background: rgba(var(--v-theme-secondary), 0.05);
}

.flag-cell {
  display: flex;
  align-items: center;
  min-height: 56px;
}

.compare-flag-img {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-row td {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.metric-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.metric-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.winner-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.winner-badge--population {
  color: rgba(200, 230, 210, 0.95);
  background: rgba(76, 175, 80, 0.12);
  border-color: rgba(129, 199, 132, 0.35);
}

.winner-badge--area {
  color: rgba(210, 224, 255, 0.95);
  background: rgba(var(--v-theme-secondary), 0.14);
  border-color: rgba(var(--v-theme-secondary), 0.35);
}

.winner-badge--density {
  color: rgba(200, 230, 245, 0.95);
  background: rgba(33, 150, 243, 0.12);
  border-color: rgba(100, 181, 246, 0.35);
}

.winner-badge--borders {
  color: rgba(255, 224, 178, 0.96);
  background: rgba(255, 152, 0, 0.12);
  border-color: rgba(255, 183, 77, 0.38);
}

.metric-winner {
  background: rgba(var(--v-theme-primary), 0.11) !important;
  box-shadow: inset 3px 0 0 rgba(var(--v-theme-primary), 0.55);
}

.compare-val-right.metric-winner {
  box-shadow: inset 3px 0 0 rgba(var(--v-theme-secondary), 0.55);
  background: rgba(var(--v-theme-secondary), 0.12) !important;
}

@media (max-width: 700px) {
  .compare-th-label {
    max-width: 140px;
    font-size: 0.88rem;
  }

  .metric-cell {
    gap: 8px;
  }

  .winner-badge {
    font-size: 0.62rem;
    padding: 3px 8px 3px 6px;
  }
}
</style>
