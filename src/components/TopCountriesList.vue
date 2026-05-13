<template>
  <v-card class="h-100 ranking-card" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2 pb-2">
      <span class="ranking-title">{{ title }}</span>
      <v-chip size="small" variant="tonal" color="primary">Top 10</v-chip>
    </v-card-title>
    <v-divider class="opacity-25" />
    <v-list v-if="items.length" class="ranking-list py-2 px-2" density="comfortable">
      <v-list-item
        v-for="(country, index) in items"
        :key="country.cca3"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="rank-item mb-1 pa-2"
      >
        <template #prepend>
          <div class="flag-rank-cell">
            <v-avatar size="46" rounded="lg" class="flag-avatar flex-shrink-0">
              <v-img :src="flagSrc(country)" :alt="country.name?.common || ''" cover>
                <template #error>
                  <v-sheet class="flag-fallback fill-height d-flex align-center justify-center">
                    <v-icon icon="mdi-flag-outline" size="22" />
                  </v-sheet>
                </template>
              </v-img>
            </v-avatar>
            <span class="rank-index" aria-hidden="true">{{ index + 1 }}</span>
          </div>
        </template>

        <v-list-item-title class="country-title text-body-1 font-weight-bold">
          {{ country.name?.common || 'Non disponible' }}
        </v-list-item-title>
        <v-list-item-subtitle class="country-value text-body-2 mt-1">
          {{ formatValue(valueAccessor(country)) }}
        </v-list-item-subtitle>

        <template #append>
          <div class="rank-progress-wrap">
            <v-progress-linear
              :model-value="progressValue(valueAccessor(country))"
              color="primary"
              bg-color="grey-darken-2"
              height="8"
              rounded
              class="rank-progress"
            />
          </div>
        </template>
      </v-list-item>
    </v-list>
    <v-card-text v-else class="text-medium-emphasis py-6 text-center">
      Données non disponibles.
    </v-card-text>
  </v-card>
</template>

<script setup>
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  valueAccessor: {
    type: Function,
    required: true,
  },
  formatter: {
    type: Function,
    required: true,
  },
})

function flagSrc(country) {
  return getCountryFlagSrc(country)
}

function formatValue(value) {
  if (!Number.isFinite(value)) return 'Non disponible'
  return props.formatter(value)
}

function progressValue(value) {
  const maxValue = Number(props.valueAccessor(props.items[0]) || 0)
  if (!Number.isFinite(value) || maxValue <= 0) return 0
  return (Number(value) / maxValue) * 100
}
</script>

<style scoped>
.ranking-card {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.02);
}

.ranking-title {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.flag-rank-cell {
  position: relative;
  margin-right: 4px;
}

.flag-avatar {
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.flag-fallback {
  background: linear-gradient(145deg, rgba(14, 26, 32, 0.95), rgba(22, 40, 48, 0.88));
}

.rank-index {
  position: absolute;
  bottom: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: rgba(232, 252, 252, 0.92);
  background: rgba(8, 18, 22, 0.88);
  border: 1px solid rgba(124, 243, 232, 0.35);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.country-title {
  line-height: 1.35;
}

.country-value {
  font-variant-numeric: tabular-nums;
  opacity: 0.92;
}

.rank-progress-wrap {
  width: 112px;
  flex-shrink: 0;
  align-self: center;
}

.rank-progress {
  opacity: 0.95;
}

.rank-item {
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
  border: 1px solid transparent;
}

.rank-item:hover {
  background: rgba(var(--v-theme-primary), 0.09) !important;
  border-color: rgba(var(--v-theme-primary), 0.18);
  transform: translateX(4px);
}

.ranking-list :deep(.v-list-item__prepend) {
  width: auto;
  margin-inline-end: 12px;
}

.ranking-list :deep(.v-list-item__append) {
  align-self: center;
}

@media (max-width: 600px) {
  .rank-progress-wrap {
    width: 88px;
  }
}
</style>
