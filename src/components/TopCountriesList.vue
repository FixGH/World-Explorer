<template>
  <v-card class="ranking-card" rounded="xl">
    <v-card-title class="ranking-card-title d-flex align-center justify-space-between ga-3">
      <span class="ranking-title">{{ title }}</span>
      <v-chip size="small" variant="tonal" color="primary" class="ranking-chip flex-shrink-0">Top 10</v-chip>
    </v-card-title>
    <v-divider class="ranking-divider opacity-25" />
    <v-list v-if="items.length" class="ranking-list" density="comfortable">
      <v-list-item
        v-for="(country, index) in items"
        :key="country.cca3"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="rank-item"
      >
        <div class="rank-row-layout">
          <div class="rank-flag-col">
            <div class="flag-rank-cell">
              <v-avatar size="48" rounded="lg" class="flag-avatar flex-shrink-0">
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
          </div>

          <div class="rank-main-col min-width-0">
            <div class="country-title text-truncate">
              {{ country.name?.common || 'Non disponible' }}
            </div>
            <div class="country-value text-medium-emphasis">
              {{ formatValue(valueAccessor(country)) }}
            </div>
          </div>

          <div class="rank-bar-col">
            <v-progress-linear
              :model-value="progressValue(valueAccessor(country))"
              color="primary"
              bg-color="grey-darken-2"
              height="6"
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
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(6, 16, 22, 0.94));
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.ranking-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
}

.ranking-card-title {
  flex-shrink: 0;
  min-height: 72px;
  padding: 22px 24px 18px !important;
  align-items: center !important;
}

.ranking-divider {
  flex-shrink: 0;
  margin: 0;
}

.ranking-title {
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 0.92rem;
  line-height: 1.35;
  text-transform: uppercase;
  color: rgba(236, 252, 252, 0.96);
}

.ranking-chip {
  font-weight: 700;
  letter-spacing: 0.06em;
}

.ranking-list {
  flex: 1 1 auto;
  padding: 16px 20px 20px !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank-flag-col {
  width: 56px;
  flex-shrink: 0;
}

.flag-rank-cell {
  position: relative;
  width: 48px;
  margin: 0 4px 6px 0;
}

.flag-avatar {
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.rank-item:hover .flag-avatar {
  transform: scale(1.03);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
}

.flag-fallback {
  background: linear-gradient(145deg, rgba(14, 26, 32, 0.95), rgba(22, 40, 48, 0.88));
}

.country-title {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.3;
  color: rgba(248, 255, 255, 0.96);
}

.country-value {
  margin-top: 4px;
  font-size: 0.84rem;
  font-weight: 500;
}

.rank-index {
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: 20px;
  height: 20px;
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

.rank-row-layout {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) minmax(88px, 108px);
  align-items: center;
  column-gap: 16px;
  row-gap: 8px;
  width: 100%;
  min-height: 52px;
}

.rank-main-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.rank-bar-col {
  align-self: center;
  min-width: 0;
}

.rank-progress {
  opacity: 0.9;
}

.rank-progress :deep(.v-progress-linear__background) {
  opacity: 0.55 !important;
}

.rank-progress :deep(.v-progress-linear__determinate) {
  transition: width 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.rank-item {
  cursor: pointer;
  flex-shrink: 0;
  margin-bottom: 0 !important;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
  border: 1px solid transparent;
  padding: 12px 14px !important;
}

.rank-item:hover {
  background: rgba(var(--v-theme-primary), 0.07) !important;
  border-color: rgba(var(--v-theme-primary), 0.14);
}

.ranking-list :deep(.v-list-item__content) {
  overflow: visible;
  padding: 0 !important;
}

@media (max-width: 520px) {
  .rank-row-layout {
    grid-template-columns: 56px minmax(0, 1fr);
    grid-template-rows: auto auto;
    min-height: 0;
  }

  .rank-bar-col {
    grid-column: 1 / -1;
    max-width: 100%;
    padding-left: 0;
  }
}
</style>
