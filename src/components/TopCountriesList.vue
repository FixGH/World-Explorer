<template>
  <v-card class="h-100 ranking-card" rounded="xl">
    <v-card-title class="ranking-card-title d-flex align-center justify-space-between flex-wrap ga-2">
      <span class="ranking-title">{{ title }}</span>
      <v-chip size="small" variant="tonal" color="primary" class="ranking-chip">Top 10</v-chip>
    </v-card-title>
    <v-divider class="opacity-25" />
    <v-list v-if="items.length" class="ranking-list py-3 px-3" density="comfortable">
      <v-list-item
        v-for="(country, index) in items"
        :key="country.cca3"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="rank-item mb-2"
      >
        <div class="rank-row-layout">
          <div class="rank-flag-col">
            <div class="flag-rank-cell">
              <v-avatar size="40" rounded="lg" class="flag-avatar flex-shrink-0">
                <v-img :src="flagSrc(country)" :alt="country.name?.common || ''" cover>
                  <template #error>
                    <v-sheet class="flag-fallback fill-height d-flex align-center justify-center">
                      <v-icon icon="mdi-flag-outline" size="20" />
                    </v-sheet>
                  </template>
                </v-img>
              </v-avatar>
              <span class="rank-index" aria-hidden="true">{{ index + 1 }}</span>
            </div>
          </div>

          <div class="rank-main-col min-width-0">
            <div class="country-title text-body-1 font-weight-bold text-truncate">
              {{ country.name?.common || 'Non disponible' }}
            </div>
            <div class="country-value text-body-2 text-medium-emphasis mt-1">
              {{ formatValue(valueAccessor(country)) }}
            </div>
          </div>

          <div class="rank-bar-col">
            <v-progress-linear
              :model-value="progressValue(valueAccessor(country))"
              color="primary"
              bg-color="grey-darken-2"
              height="8"
              rounded
              class="rank-progress"
            />
          </div>
        </div>
      </v-list-item>
    </v-list>
    <v-card-text v-else class="text-medium-emphasis py-8 text-center">
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
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.055), rgba(6, 16, 22, 0.92));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.ranking-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow:
    0 22px 52px rgba(0, 0, 0, 0.36),
    0 0 48px rgba(23, 215, 209, 0.08);
}

.ranking-card-title {
  padding-top: 18px !important;
  padding-bottom: 12px !important;
}

.ranking-title {
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 1.05rem;
}

.ranking-chip {
  font-weight: 700;
  letter-spacing: 0.06em;
}

.flag-rank-cell {
  position: relative;
}

.flag-avatar {
  border: 1px solid rgba(255, 255, 255, 0.11);
  overflow: hidden;
}

.flag-fallback {
  background: linear-gradient(145deg, rgba(14, 26, 32, 0.95), rgba(22, 40, 48, 0.88));
}

.rank-index {
  position: absolute;
  bottom: -3px;
  right: -3px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: rgba(232, 252, 252, 0.92);
  background: rgba(8, 18, 22, 0.9);
  border: 1px solid rgba(124, 243, 232, 0.32);
  border-radius: 999px;
}

.country-value {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.rank-row-layout {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(72px, 104px);
  align-items: center;
  gap: 12px 14px;
  width: 100%;
}

.rank-bar-col {
  align-self: center;
}

.rank-progress {
  opacity: 0.95;
  box-shadow: 0 0 14px rgba(23, 215, 209, 0.15);
}

.rank-progress :deep(.v-progress-linear__determinate) {
  transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.rank-item {
  cursor: pointer;
  transition:
    background-color 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
  border: 1px solid transparent;
  padding: 12px 14px !important;
}

.rank-item:hover {
  background: rgba(var(--v-theme-primary), 0.09) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
  transform: translateX(2px);
}

.ranking-list :deep(.v-list-item__content) {
  overflow: visible;
}

@media (max-width: 520px) {
  .rank-row-layout {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto;
  }

  .rank-bar-col {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}
</style>
