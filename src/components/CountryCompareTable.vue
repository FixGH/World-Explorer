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
            </td>
          </tr>

          <tr>
            <td><strong>Nom commun</strong></td>
            <td>{{ left?.name?.common || '-' }}</td>
            <td>{{ right?.name?.common || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Nom officiel</strong></td>
            <td>{{ left?.name?.official || '-' }}</td>
            <td>{{ right?.name?.official || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Capitale</strong></td>
            <td>{{ left?.capital?.[0] || '-' }}</td>
            <td>{{ right?.capital?.[0] || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Région</strong></td>
            <td>{{ leftRegionLabel }}</td>
            <td>{{ rightRegionLabel }}</td>
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
          <tr>
            <td><strong>Code CCA3</strong></td>
            <td>{{ left?.cca3 || '-' }}</td>
            <td>{{ right?.cca3 || '-' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

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

const leftFlagSrc = computed(() => props.left?.flags?.svg || props.left?.flags?.png || '')
const rightFlagSrc = computed(() => props.right?.flags?.svg || props.right?.flags?.png || '')
const regionMap = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

const leftPopulation = computed(() => (props.left?.population ? props.left.population.toLocaleString('fr-FR') : '-'))
const rightPopulation = computed(() => (props.right?.population ? props.right.population.toLocaleString('fr-FR') : '-'))
const leftArea = computed(() => (Number.isFinite(props.left?.area) ? `${props.left.area.toLocaleString('fr-FR')} km²` : '-'))
const rightArea = computed(() => (Number.isFinite(props.right?.area) ? `${props.right.area.toLocaleString('fr-FR')} km²` : '-'))
const leftBorders = computed(() => `${Number(props.left?.borders?.length || 0).toLocaleString('fr-FR')} frontière(s)`)
const rightBorders = computed(() => `${Number(props.right?.borders?.length || 0).toLocaleString('fr-FR')} frontière(s)`)
const leftRegionLabel = computed(() => regionMap[props.left?.region] || props.left?.region || '-')
const rightRegionLabel = computed(() => regionMap[props.right?.region] || props.right?.region || '-')

function getMetricValue(metric, side) {
  const item = side === 'left' ? props.left : props.right
  if (!item) return null
  if (metric === 'population') return Number(item.population)
  if (metric === 'area') return Number(item.area)
  if (metric === 'borders') return Number(item.borders?.length || 0)
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
  return 'Statut non précisé'
}
</script>

<style scoped>
.compare-table-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
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
