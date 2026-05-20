<template>
  <section class="discover-today" aria-labelledby="discover-today-title">
    <div class="discover-today__head">
      <h2 id="discover-today-title" class="discover-today__title">
        <span aria-hidden="true">🌎</span>
        Pays à découvrir aujourd’hui
      </h2>
      <p class="discover-today__subtitle">
        Trois suggestions pour ouvrir l’appétit — puis laissez-vous guider.
      </p>
    </div>

    <v-row align="stretch">
      <v-col cols="12" md="8">
        <div class="discover-today__chips">
          <RouterLink
            v-for="country in picks"
            :key="country.cca3"
            :to="{ name: 'country-details', params: { code: country.cca3 } }"
            class="pick-chip"
          >
            <v-avatar size="36" rounded="lg" class="pick-chip__avatar">
              <v-img :src="flagSrc(country)" :alt="''" cover>
                <template #error>
                  <v-icon icon="mdi-flag-outline" size="20" />
                </template>
              </v-img>
            </v-avatar>
            <span class="pick-chip__text">{{ country.name?.common }}</span>
            <v-icon icon="mdi-arrow-right" size="18" class="pick-chip__arrow" />
          </RouterLink>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="random-panel">
          <div class="random-panel__icon" aria-hidden="true">✈️</div>
          <div class="random-panel__title">Voyage aléatoire</div>
          <p class="random-panel__text">Un clic, un pays au hasard — parfait pour l’improvisation.</p>
          <v-btn
            color="primary"
            variant="flat"
            block
            rounded="xl"
            class="random-panel__btn"
            prepend-icon="mdi-shuffle-variant"
            @click="$emit('random-trip')"
          >
            Me faire voyager
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

defineProps({
  picks: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['random-trip'])

function flagSrc(country) {
  return getCountryFlagSrc(country)
}
</script>

<style scoped>
.discover-today__head {
  margin-bottom: 18px;
  max-width: 48rem;
}

.discover-today__title {
  margin: 0 0 8px;
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
}

.discover-today__subtitle {
  margin: 0;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.55;
  font-weight: 500;
}

.discover-today__chips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.pick-chip {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.05), rgba(8, 20, 24, 0.65));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.26);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.pick-chip:hover,
.pick-chip:focus-visible {
  transform: translateX(6px);
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.34);
}

.pick-chip__avatar {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.pick-chip__text {
  flex: 1;
  font-weight: 700;
  font-size: 1.05rem;
  color: rgba(248, 255, 255, 0.96);
}

.pick-chip__arrow {
  color: rgba(124, 243, 232, 0.75);
  transition: transform 0.25s ease;
}

.pick-chip:hover .pick-chip__arrow {
  transform: translateX(4px);
}

.random-panel {
  height: 100%;
  min-height: 200px;
  padding: 22px 20px;
  border-radius: 20px;
  border: 1px solid rgba(124, 243, 232, 0.22);
  background: linear-gradient(155deg, rgba(var(--v-theme-primary), 0.18), rgba(6, 16, 22, 0.88));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
}

.random-panel__icon {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 8px;
}

.random-panel__title {
  font-weight: 800;
  font-size: 1.15rem;
  color: rgba(248, 255, 255, 0.98);
  margin-bottom: 8px;
}

.random-panel__text {
  margin: 0 0 16px;
  flex: 1;
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(210, 236, 236, 0.9);
  font-weight: 500;
}

.random-panel__btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
