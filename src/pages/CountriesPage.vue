<template>
  <v-container class="py-6 py-md-8 countries-page">
    <header class="countries-page__header mb-6 mb-md-8">
      <div class="countries-page__header-glow" aria-hidden="true" />
      <div class="countries-page__header-inner">
        <div class="countries-page__header-copy">
          <div class="countries-page__kicker">
            <v-icon icon="mdi-compass-outline" size="22" class="countries-page__kicker-icon" />
            Galerie du monde
          </div>
          <h1 class="countries-page__title">Explorateur de pays</h1>
          <p class="countries-page__subtitle">
            Parcourez le monde comme une collection vivante : filtres doux, cartes immersives, coups de cœur en un geste.
          </p>
        </div>
        <div class="countries-page__header-actions">
          <v-btn
            color="secondary"
            variant="tonal"
            rounded="xl"
            size="large"
            prepend-icon="mdi-compare"
            to="/compare"
            class="countries-page__action-btn text-none font-weight-bold"
          >
            Comparer
          </v-btn>
          <v-btn
            v-if="authStore.isAuthenticated"
            color="primary"
            variant="elevated"
            rounded="xl"
            size="large"
            prepend-icon="mdi-plus"
            :to="{ name: 'add-country' }"
            class="countries-page__action-btn text-none font-weight-bold"
          >
            Ajouter un pays
          </v-btn>
        </div>
      </div>
    </header>

    <LoadingState v-if="store.loading" />

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      retryable
      @retry="store.fetchCountries"
    />

    <template v-else>
      <CountryFilters
        :search-query="store.searchQuery"
        :selected-region="store.selectedRegion"
        :sort-option="store.sortOption"
        class="countries-page__filters mb-6 mb-md-8"
        @update:search-query="store.setSearchQuery"
        @update:selected-region="store.setSelectedRegion"
        @update:sort-option="store.setSortOption"
        @reset="store.resetFilters"
      />

      <section
        v-if="showExplorationModes && store.filteredCountries.length"
        class="countries-modes mb-8"
        aria-label="Modes d’exploration"
      >
        <div class="countries-modes__block">
          <div class="countries-modes__head">
            <span class="countries-modes__emoji" aria-hidden="true">🌍</span>
            <div>
              <h2 class="countries-modes__title">Pays populaires</h2>
              <p class="countries-modes__hint">Les destinations les plus consultées — un clic pour ouvrir la fiche.</p>
            </div>
          </div>
          <div class="countries-modes__scroll">
            <RouterLink
              v-for="c in popularStrip"
              :key="c.cca3"
              :to="{ name: 'country-details', params: { code: c.cca3 } }"
              class="mini-land"
            >
              <v-avatar size="48" rounded="lg" class="mini-land__avatar">
                <v-img :src="flagSrc(c)" :alt="`Drapeau — ${c.name?.common || ''}`" cover>
                  <template #error>
                    <v-icon icon="mdi-flag-outline" />
                  </template>
                </v-img>
              </v-avatar>
              <span class="mini-land__name">{{ c.name?.common }}</span>
            </RouterLink>
          </div>
        </div>

        <div class="countries-modes__block countries-modes__block--accent">
          <div class="countries-modes__head">
            <span class="countries-modes__emoji" aria-hidden="true">🔥</span>
            <div>
              <h2 class="countries-modes__title">Découverte rapide</h2>
              <p class="countries-modes__hint">Quatre pays à mettre sous les yeux avant de plonger dans la grille.</p>
            </div>
          </div>
          <div class="countries-modes__quick">
            <RouterLink
              v-for="c in quickDiscovery"
              :key="c.cca3"
              :to="{ name: 'country-details', params: { code: c.cca3 } }"
              class="quick-chip"
            >
              <span class="quick-chip__dot" aria-hidden="true" />
              {{ c.name?.common }}
            </RouterLink>
          </div>
          <v-btn
            color="primary"
            variant="tonal"
            rounded="xl"
            size="large"
            class="text-none font-weight-bold mt-4"
            prepend-icon="mdi-shuffle-variant"
            @click="goRandomExplorer"
          >
            Explorer au hasard
          </v-btn>
        </div>
      </section>

      <v-card
        v-if="!store.filteredCountries.length"
        class="countries-empty mb-6"
        rounded="xl"
        variant="flat"
      >
        <v-card-text class="pa-8 pa-md-10 text-center">
          <div class="countries-empty__emoji" aria-hidden="true">🌍</div>
          <h2 class="countries-empty__title text-h5 font-weight-bold mb-2">Aucun pays trouvé</h2>
          <p class="countries-empty__text text-body-1 text-medium-emphasis mb-6">
            Ajustez votre recherche ou réinitialisez les filtres pour retrouver toute la carte du monde.
          </p>
          <v-btn color="primary" size="large" rounded="xl" class="text-none font-weight-bold" @click="store.resetFilters">
            <v-icon start icon="mdi-backup-restore" />
            Réinitialiser les filtres
          </v-btn>
        </v-card-text>
      </v-card>

      <v-row v-else class="countries-grid" align="stretch">
        <v-col
          v-for="country in store.filteredCountries"
          :key="country.cca3"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
        >
          <CountryCard
            :country="country"
            :is-favorite="store.isFavorite(country.cca3)"
            :can-delete="authStore.isAuthenticated && Boolean(country.isCustom)"
            @toggle-favorite="store.toggleFavorite"
            @delete-country="store.deleteCustomCountry"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'
import { useAuthStore } from '@/stores/auth'
import CountryCard from '@/components/CountryCard.vue'
import CountryFilters from '@/components/CountryFilters.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const store = useCountriesStore()
const authStore = useAuthStore()
const router = useRouter()

const showExplorationModes = computed(() => {
  return (
    !store.searchQuery?.trim() &&
    store.selectedRegion === 'all' &&
    store.sortOption === 'name-asc' &&
    store.countries.length > 0
  )
})

const popularStrip = computed(() => store.topPopulatedCountries.slice(0, 6))

const quickDiscovery = computed(() => {
  const picks = [
    store.topPopulatedCountries[1],
    store.topLargestCountries[0],
    store.topBorderCountries[0],
    store.topPopulatedCountries[3],
  ].filter(Boolean)
  const seen = new Set()
  return picks.filter((c) => {
    if (!c?.cca3 || seen.has(c.cca3)) return false
    seen.add(c.cca3)
    return true
  })
})

function flagSrc(country) {
  return getCountryFlagSrc(country)
}

function goRandomExplorer() {
  const list = store.filteredCountries.length ? store.filteredCountries : store.countries
  if (!list.length) return
  const pick = list[Math.floor(Math.random() * list.length)]
  if (pick?.cca3) {
    router.push({ name: 'country-details', params: { code: pick.cca3 } })
  }
}

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.countries-page {
  max-width: min(100%, 1320px) !important;
}

.countries-page__header {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: clamp(22px, 4vw, 36px) clamp(18px, 3vw, 32px);
  background: linear-gradient(145deg, rgba(18, 42, 48, 0.55), rgba(6, 14, 18, 0.92));
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.32);
}

.countries-page__header-glow {
  position: absolute;
  inset: -30%;
  pointer-events: none;
  background: radial-gradient(circle at 18% 40%, rgba(124, 243, 232, 0.22), transparent 45%),
    radial-gradient(circle at 88% 30%, rgba(54, 168, 255, 0.18), transparent 42%);
  animation: countries-header-glow 14s ease-in-out infinite alternate;
}

@keyframes countries-header-glow {
  0% {
    transform: translate(-2%, 0) scale(1);
  }
  100% {
    transform: translate(3%, 2%) scale(1.05);
  }
}

.countries-page__header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 24px;
}

.countries-page__header-copy {
  flex: 1 1 280px;
  min-width: 0;
}

.countries-page__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(160, 230, 226, 0.9);
  margin-bottom: 10px;
}

.countries-page__kicker-icon {
  color: rgb(var(--v-theme-primary));
}

.countries-page__title {
  margin: 0 0 10px;
  font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: rgba(248, 255, 255, 0.98);
}

.countries-page__subtitle {
  margin: 0;
  max-width: 36rem;
  font-size: 1.02rem;
  line-height: 1.6;
  color: rgba(188, 218, 218, 0.9);
  font-weight: 500;
}

.countries-page__header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.countries-page__action-btn {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.countries-page__filters {
  position: relative;
  z-index: 2;
}

.countries-modes {
  display: grid;
  gap: 18px;
}

@media (min-width: 960px) {
  .countries-modes {
    grid-template-columns: 1.15fr 0.85fr;
    align-items: stretch;
  }
}

.countries-modes__block {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 20px 22px;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(6, 16, 20, 0.75));
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.26);
}

.countries-modes__block--accent {
  border-color: rgba(124, 243, 232, 0.22);
  background: linear-gradient(155deg, rgba(23, 215, 209, 0.1), rgba(8, 20, 26, 0.88));
}

.countries-modes__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.countries-modes__emoji {
  font-size: 1.75rem;
  line-height: 1;
}

.countries-modes__title {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
}

.countries-modes__hint {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(180, 210, 210, 0.88);
}

.countries-modes__scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.mini-land {
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 104px;
  text-decoration: none;
  color: inherit;
  padding: 10px 8px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.18);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.mini-land:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}

.mini-land__avatar {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.mini-land__name {
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.25;
  color: rgba(236, 252, 252, 0.95);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.countries-modes__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88rem;
  color: rgba(248, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.quick-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.5);
  background: rgba(var(--v-theme-primary), 0.12);
}

.quick-chip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 12px rgba(124, 243, 232, 0.8);
}

.countries-empty {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(6, 16, 20, 0.85));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

.countries-empty__emoji {
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 8px;
}

.countries-empty__title {
  color: rgba(248, 255, 255, 0.98);
}

.countries-empty__text {
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.countries-grid {
  margin-top: 4px;
}
</style>
