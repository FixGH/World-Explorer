<template>
  <section class="spotlight" aria-labelledby="spotlight-title">
    <div class="spotlight__head">
      <h2 id="spotlight-title" class="spotlight__title">
        <span aria-hidden="true">🔥</span>
        Les pays les plus fascinants
      </h2>
      <p class="spotlight__subtitle">
        Un aperçu express de destinations qui marquent les esprits — population, superficie ou frontières.
      </p>
    </div>

    <div class="spotlight__deck">
      <RouterLink
        v-for="country in countries"
        :key="country.cca3"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        class="spot-card"
      >
        <div class="spot-card__media">
          <v-img :src="flagSrc(country)" :alt="''" height="120" cover class="spot-card__img">
            <template #error>
              <v-sheet height="120" class="spot-card__fallback d-flex align-center justify-center">
                <v-icon icon="mdi-flag-outline" size="40" color="primary" />
              </v-sheet>
            </template>
          </v-img>
          <div class="spot-card__wash" aria-hidden="true" />
        </div>
        <div class="spot-card__body">
          <div class="spot-card__name">{{ country.name?.common }}</div>
          <div class="spot-card__region">{{ regionFr(country.region) }}</div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

defineProps({
  countries: {
    type: Array,
    default: () => [],
  },
})

const regionLabels = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

function regionFr(code) {
  return regionLabels[code] || code || 'Monde'
}

function flagSrc(country) {
  return getCountryFlagSrc(country)
}
</script>

<style scoped>
.spotlight__head {
  margin-bottom: 20px;
  max-width: 48rem;
}

.spotlight__title {
  margin: 0 0 8px;
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
}

.spotlight__subtitle {
  margin: 0;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.55;
  font-weight: 500;
}

.spotlight__deck {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.spot-card {
  text-decoration: none;
  color: inherit;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(6, 14, 18, 0.85));
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.32);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.spot-card:hover,
.spot-card:focus-visible {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.42);
}

.spot-card:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.65);
  outline-offset: 2px;
}

.spot-card__media {
  position: relative;
}

.spot-card__img :deep(img) {
  transition: transform 0.45s ease;
}

.spot-card:hover .spot-card__img :deep(img) {
  transform: scale(1.06);
}

.spot-card__fallback {
  background: linear-gradient(145deg, rgba(15, 28, 34, 0.96), rgba(25, 48, 56, 0.88));
}

.spot-card__wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(4, 12, 16, 0.85) 100%);
  pointer-events: none;
}

.spot-card__body {
  padding: 14px 16px 18px;
}

.spot-card__name {
  font-weight: 800;
  font-size: 1.05rem;
  color: rgba(248, 255, 255, 0.98);
}

.spot-card__region {
  margin-top: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(124, 243, 232, 0.88);
}
</style>
