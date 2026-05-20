<template>
  <section class="world-curios" aria-labelledby="world-curios-title">
    <div class="world-curios__head">
      <h2 id="world-curios-title" class="world-curios__title">
        <span aria-hidden="true">📊</span>
        Faits étonnants du monde
      </h2>
      <p class="world-curios__subtitle">Quelques records pour éveiller la curiosité — touchez une carte pour voyager.</p>
    </div>

    <v-row class="world-curios__row" align="stretch">
      <v-col v-for="card in cards" :key="card.key" cols="12" sm="6" lg="3">
        <component
          :is="card.to ? 'RouterLink' : 'div'"
          v-bind="card.to ? { to: card.to } : {}"
          class="curio-card"
          :class="{ 'curio-card--disabled': !card.to }"
        >
          <div class="curio-card__shine" aria-hidden="true" />
          <div class="curio-card__emoji" aria-hidden="true">{{ card.emoji }}</div>
          <div class="curio-card__kicker">{{ card.kicker }}</div>
          <div class="curio-card__name">{{ card.name }}</div>
          <div v-if="card.hint" class="curio-card__hint">{{ card.hint }}</div>
        </component>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  largest: { type: Object, default: null },
  smallestPop: { type: Object, default: null },
  mostPopulated: { type: Object, default: null },
  mostBorders: { type: Object, default: null },
})

const cards = computed(() => {
  const toCountry = (c) =>
    c?.cca3 ? { name: 'country-details', params: { code: c.cca3 } } : null

  return [
    {
      key: 'area',
      emoji: '🌍',
      kicker: 'Immensité',
      name: props.largest?.name?.common || '—',
      hint: 'Le plus grand pays',
      to: toCountry(props.largest),
    },
    {
      key: 'micro',
      emoji: '🏝️',
      kicker: 'Petit bijou',
      name: props.smallestPop?.name?.common || '—',
      hint: 'Parmi les plus petits en population',
      to: toCountry(props.smallestPop),
    },
    {
      key: 'pop',
      emoji: '👥',
      kicker: 'Effervescence',
      name: props.mostPopulated?.name?.common || '—',
      hint: 'Le pays le plus peuplé',
      to: toCountry(props.mostPopulated),
    },
    {
      key: 'borders',
      emoji: '🗺️',
      kicker: 'Au carrefour',
      name: props.mostBorders?.name?.common || '—',
      hint: 'Beaucoup de voisins',
      to: toCountry(props.mostBorders),
    },
  ]
})
</script>

<style scoped>
.world-curios__head {
  margin-bottom: 20px;
  max-width: 48rem;
}

.world-curios__title {
  margin: 0 0 8px;
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
}

.world-curios__subtitle {
  margin: 0;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.55;
  font-weight: 500;
}

.curio-card {
  position: relative;
  display: block;
  height: 100%;
  min-height: 168px;
  padding: 20px 18px;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.055), rgba(6, 16, 20, 0.72));
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.curio-card--disabled {
  cursor: default;
  opacity: 0.75;
}

.curio-card:not(.curio-card--disabled):hover,
.curio-card:not(.curio-card--disabled):focus-visible {
  transform: translateY(-5px);
  border-color: rgba(var(--v-theme-primary), 0.42);
  box-shadow: 0 22px 52px rgba(0, 0, 0, 0.38);
}

.curio-card__shine {
  position: absolute;
  inset: -40% -20%;
  background: linear-gradient(115deg, transparent 40%, rgba(124, 243, 232, 0.12) 50%, transparent 60%);
  transform: translateX(-30%);
  transition: transform 0.6s ease;
  pointer-events: none;
}

.curio-card:not(.curio-card--disabled):hover .curio-card__shine {
  transform: translateX(30%);
}

.curio-card__emoji {
  font-size: 1.75rem;
  line-height: 1;
  margin-bottom: 10px;
}

.curio-card__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(124, 243, 232, 0.9);
  margin-bottom: 6px;
}

.curio-card__name {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.25;
  color: rgba(248, 255, 255, 0.98);
}

.curio-card__hint {
  margin-top: 10px;
  font-size: 0.88rem;
  color: rgba(180, 210, 210, 0.85);
  font-weight: 500;
}
</style>
