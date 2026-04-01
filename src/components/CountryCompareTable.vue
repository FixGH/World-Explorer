<template>
  <v-card>
    <v-card-title>Comparaison</v-card-title>
    <v-divider />
    <v-card-text>
      <v-table density="comfortable">
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
            <td>{{ left?.region || '-' }}</td>
            <td>{{ right?.region || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Population</strong></td>
            <td :class="leftPopulationClass">
              <div class="d-flex align-center justify-space-between">
                <span>{{ leftPopulation }}</span>
                <v-chip
                  v-if="populationWinner === 'left'"
                  size="small"
                  color="success"
                  variant="tonal"
                  prepend-icon="mdi-arrow-up"
                >
                  Plus élevé
                </v-chip>
              </div>
            </td>
            <td :class="rightPopulationClass">
              <div class="d-flex align-center justify-space-between">
                <span>{{ rightPopulation }}</span>
                <v-chip
                  v-if="populationWinner === 'right'"
                  size="small"
                  color="success"
                  variant="tonal"
                  prepend-icon="mdi-arrow-up"
                >
                  Plus élevé
                </v-chip>
              </div>
            </td>
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

const leftPopulation = computed(() => (props.left?.population ? props.left.population.toLocaleString() : '-'))
const rightPopulation = computed(() => (props.right?.population ? props.right.population.toLocaleString() : '-'))

const populationWinner = computed(() => {
  const left = props.left?.population
  const right = props.right?.population

  if (!Number.isFinite(left) || !Number.isFinite(right) || left === right) {
    return null
  }

  return left > right ? 'left' : 'right'
})

const leftPopulationClass = computed(() => (populationWinner.value === 'left' ? 'bg-success' : ''))
const rightPopulationClass = computed(() => (populationWinner.value === 'right' ? 'bg-success' : ''))
</script>

<style scoped>
.bg-success {
  background: rgba(var(--v-theme-success), 0.12);
}
</style>
