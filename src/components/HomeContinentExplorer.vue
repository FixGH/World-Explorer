<template>
  <section class="continent-explorer" aria-labelledby="continent-explorer-title">
    <div class="continent-explorer__head">
      <h2 id="continent-explorer-title" class="continent-explorer__title">
        <span class="continent-explorer__icon" aria-hidden="true">🧭</span>
        Explorez par continent
      </h2>
      <p class="continent-explorer__subtitle">
        Choisissez une région et plongez dans ses pays — capitales, drapeaux et curiosités vous attendent.
      </p>
    </div>

    <div class="continent-explorer__grid">
      <button
        v-for="item in items"
        :key="item.region"
        type="button"
        class="continent-card"
        @click="explore(item.region)"
      >
        <div class="continent-card__glow" aria-hidden="true" />
        <div class="continent-card__inner">
          <v-icon :icon="item.icon" size="36" class="continent-card__mdi" />
          <div class="continent-card__label">{{ item.label }}</div>
          <div class="continent-card__count">{{ countFor(item.region) }} pays</div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const store = useCountriesStore()
const router = useRouter()

const items = [
  { region: 'Europe', label: 'Europe', icon: 'mdi-terrain' },
  { region: 'Asia', label: 'Asie', icon: 'mdi-pine-tree' },
  { region: 'Africa', label: 'Afrique', icon: 'mdi-island' },
  { region: 'Americas', label: 'Amériques', icon: 'mdi-weather-sunset' },
  { region: 'Oceania', label: 'Océanie', icon: 'mdi-waves' },
]

const countMap = computed(() => {
  const map = Object.create(null)
  for (const { region, count } of store.regionDistribution) {
    map[region] = count
  }
  return map
})

function countFor(region) {
  return countMap.value[region] ?? 0
}

function explore(region) {
  store.setSelectedRegion(region)
  store.setSearchQuery('')
  router.push({ name: 'countries' })
}
</script>

<style scoped>
.continent-explorer__head {
  margin-bottom: 22px;
  max-width: 52rem;
}

.continent-explorer__title {
  margin: 0 0 10px;
  font-size: clamp(1.35rem, 1.1rem + 1vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.continent-explorer__icon {
  font-size: 1.35em;
  line-height: 1;
}

.continent-explorer__subtitle {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.55;
  color: rgba(188, 220, 220, 0.88);
  font-weight: 500;
}

.continent-explorer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}

@media (min-width: 600px) {
  .continent-explorer__grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.continent-card {
  position: relative;
  cursor: pointer;
  text-align: left;
  border: none;
  padding: 0;
  border-radius: 18px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.continent-card__glow {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.35s ease;
  background: radial-gradient(circle at 30% 20%, rgba(124, 243, 232, 0.35), transparent 62%);
  pointer-events: none;
}

.continent-card:hover .continent-card__glow,
.continent-card:focus-visible .continent-card__glow {
  opacity: 1;
}

.continent-card__inner {
  position: relative;
  height: 100%;
  min-height: 132px;
  padding: 18px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.06), rgba(8, 18, 22, 0.55));
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.continent-card:hover .continent-card__inner,
.continent-card:focus-visible .continent-card__inner {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.38);
}

.continent-card:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.65);
  outline-offset: 3px;
}

.continent-card__mdi {
  color: rgb(var(--v-theme-primary));
  opacity: 0.95;
}

.continent-card__label {
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  color: rgba(248, 255, 255, 0.96);
}

.continent-card__count {
  margin-top: auto;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(170, 210, 210, 0.85);
}
</style>
