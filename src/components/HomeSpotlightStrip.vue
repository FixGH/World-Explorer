<template>
  <section class="spotlight" aria-labelledby="spotlight-title">
    <div class="spotlight__head">
      <div>
        <h2 id="spotlight-title" class="spotlight__title">
          <span aria-hidden="true">🌎</span>
          Pays à découvrir aujourd’hui
        </h2>
        <p class="spotlight__subtitle">Quelques destinations pour lancer votre curiosité — la carte entière vous attend ensuite.</p>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        size="large"
        rounded="xl"
        class="spotlight__random"
        prepend-icon="mdi-shuffle-variant"
        :disabled="!canRandom"
        @click="$emit('random-trip')"
      >
        Voyage aléatoire
      </v-btn>
    </div>

    <div class="spotlight__grid">
      <RouterLink
        v-for="country in countries"
        :key="country.cca3"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        class="spot-card"
      >
        <div class="spot-card__media">
          <v-img :src="flagSrc(country)" :alt="`Drapeau — ${country.name?.common || ''}`" height="120" cover class="spot-card__img">
            <template #error>
              <v-sheet height="120" class="spot-card__fallback d-flex align-center justify-center">
                <v-icon icon="mdi-flag-outline" size="40" />
              </v-sheet>
            </template>
          </v-img>
          <div class="spot-card__scrim" aria-hidden="true" />
        </div>
        <div class="spot-card__body">
          <div class="spot-card__name">{{ country.name?.common }}</div>
          <div class="spot-card__region">{{ regionLabel(country) }}</div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'
import { formatRegionLabel } from '@/utils/regionLabels'

defineProps({
  countries: {
    type: Array,
    default: () => [],
  },
  canRandom: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['random-trip'])

function flagSrc(country) {
  return getCountryFlagSrc(country)
}

function regionLabel(country) {
  return formatRegionLabel(country?.region, 'Monde')
}
</script>

<style scoped>
.spotlight__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 20px;
  margin-bottom: 22px;
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
  max-width: 36rem;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.55;
  font-weight: 500;
}

.spotlight__random {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 28px rgba(var(--v-theme-primary), 0.22);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.spotlight__random:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(var(--v-theme-primary), 0.32);
}

.spotlight__grid {
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
  background: rgba(8, 18, 22, 0.55);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.spot-card:hover,
.spot-card:focus-visible {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 24px 52px rgba(0, 0, 0, 0.38);
}

.spot-card:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.65);
  outline-offset: 3px;
}

.spot-card__media {
  position: relative;
}

.spot-card__img :deep(img) {
  object-fit: cover;
}

.spot-card__fallback {
  background: linear-gradient(145deg, rgba(15, 28, 34, 0.96), rgba(25, 48, 56, 0.88));
}

.spot-card__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(4, 10, 14, 0.88) 100%);
  pointer-events: none;
}

.spot-card__body {
  padding: 14px 16px 16px;
  margin-top: -52px;
  position: relative;
  z-index: 1;
}

.spot-card__name {
  font-weight: 800;
  font-size: 1.08rem;
  color: rgba(248, 255, 255, 0.98);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.spot-card__region {
  margin-top: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(180, 220, 218, 0.9);
}
</style>
