<template>
  <v-container class="py-6 home-page">
    <v-row class="mb-5" align="stretch">
      <v-col cols="12" lg="8">
        <HomeHero />
      </v-col>
      <v-col cols="12" lg="4">
        <HomeOnboardingWidget />
      </v-col>
    </v-row>

    <v-row class="mb-5">
      <v-col cols="12" md="6" lg="3">
        <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'countries' }">
          <v-card-text>
            <div class="quick-title"><v-icon icon="mdi-earth" /> Explorer</div>
            <div class="text-medium-emphasis text-body-2">Parcourir et filtrer tous les pays.</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'compare' }">
          <v-card-text>
            <div class="quick-title"><v-icon icon="mdi-compare" /> Comparer</div>
            <div class="text-medium-emphasis text-body-2">Comparer deux pays côte à côte.</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'favorites' }">
          <v-card-text>
            <div class="quick-title"><v-icon icon="mdi-heart" /> Favoris</div>
            <div class="text-medium-emphasis text-body-2">Retrouver votre sélection personnelle.</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'statistics' }">
          <v-card-text>
            <div class="quick-title"><v-icon icon="mdi-chart-bar" /> Statistiques</div>
            <div class="text-medium-emphasis text-body-2">Visualiser les tendances mondiales.</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="section-header">
      <h2 class="text-h5 font-weight-bold">Pays en vedette</h2>
      <v-btn variant="text" color="primary" :to="{ name: 'countries' }">Tout explorer</v-btn>
    </div>
    <v-row class="mb-5">
      <v-col
        v-for="country in featuredCountries"
        :key="country.cca3"
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <CountryCard
          :country="country"
          :is-favorite="store.isFavorite(country.cca3)"
          @toggle-favorite="store.toggleFavorite"
        />
      </v-col>
    </v-row>

    <v-row class="mb-5" align="stretch">
      <v-col cols="12" lg="6">
        <RecentlyViewedCountries :items="store.recentlyViewedCountries" />
      </v-col>
      <v-col cols="12" lg="6">
        <v-card class="favorites-preview h-100" rounded="lg">
          <v-card-text>
            <div class="section-header mb-2">
              <h3 class="text-h6 font-weight-bold">Aperçu des favoris</h3>
              <v-chip size="small" variant="tonal" color="primary">
                {{ store.favoritesCount.toLocaleString('fr-FR') }}
              </v-chip>
            </div>
            <v-alert v-if="!favoritePreview.length" type="info" variant="tonal" rounded="lg">
              Aucun favori pour le moment.
            </v-alert>
            <v-list v-else density="comfortable" class="py-1">
              <v-list-item
                v-for="country in favoritePreview"
                :key="country.cca3"
                :to="{ name: 'country-details', params: { code: country.cca3 } }"
                rounded="lg"
                class="preview-item"
              >
                <template #prepend>
                  <v-avatar size="32" rounded="lg">
                    <v-img :src="country.flags?.svg || country.flags?.png" :alt="country.name?.common" cover />
                  </v-avatar>
                </template>
                <v-list-item-title>{{ country.name?.common }}</v-list-item-title>
                <v-list-item-subtitle>{{ country.region || 'Région non disponible' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-btn variant="text" color="primary" class="mt-2" :to="{ name: 'favorites' }">
              Voir tous les favoris
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-7 section-divider" />

    <div class="section-header mb-3">
      <h2 class="text-h5 font-weight-bold">Vue d'ensemble mondiale</h2>
    </div>
    <GlobalStatsCards :stats="stats" />

    <v-row class="mt-5 mb-5">
      <v-col cols="12" lg="6">
        <v-card class="top-preview-card h-100" rounded="lg">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Top 5 pays les plus peuplés</span>
            <v-btn variant="text" color="primary" size="small" :to="{ name: 'statistics' }">Détails</v-btn>
          </v-card-title>
          <v-divider />
          <v-list density="comfortable" class="py-2">
            <v-list-item
              v-for="(country, index) in topPopulationPreview"
              :key="country.cca3"
              :to="{ name: 'country-details', params: { code: country.cca3 } }"
              rounded="lg"
              class="preview-item"
            >
              <template #prepend>
                <v-avatar size="28" rounded="lg" class="rank-pill">{{ index + 1 }}</v-avatar>
              </template>
              <v-list-item-title>{{ country.name?.common }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ Number(country.population || 0).toLocaleString('fr-FR') }} habitants
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <div class="section-header mb-3">
          <h2 class="text-h5 font-weight-bold">Ce que vous pouvez faire</h2>
        </div>
        <FeatureHighlights />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import HomeHero from '@/components/HomeHero.vue'
import HomeOnboardingWidget from '@/components/HomeOnboardingWidget.vue'
import GlobalStatsCards from '@/components/GlobalStatsCards.vue'
import FeatureHighlights from '@/components/FeatureHighlights.vue'
import RecentlyViewedCountries from '@/components/RecentlyViewedCountries.vue'
import CountryCard from '@/components/CountryCard.vue'

const store = useCountriesStore()

const stats = computed(() => [
  {
    label: 'Nombre total de pays',
    value: store.totalCountries.toLocaleString('fr-FR'),
    icon: 'mdi-flag',
  },
  {
    label: 'Régions représentées',
    value: store.totalRegions.toLocaleString('fr-FR'),
    icon: 'mdi-earth',
  },
  {
    label: 'Population totale',
    value: store.totalPopulation.toLocaleString('fr-FR'),
    icon: 'mdi-account-group',
  },
  {
    label: 'Pays favoris',
    value: store.favoritesCount.toLocaleString('fr-FR'),
    icon: 'mdi-heart',
  },
])

const featuredCountries = computed(() => {
  if (!store.countries.length) return []
  const seeded = [...store.countries]
    .sort((left, right) => (left?.cca3 || '').localeCompare(right?.cca3 || ''))
    .map((country) => ({ country, score: seededScore(country?.cca3) }))
    .sort((left, right) => left.score - right.score)

  return seeded.slice(0, 4).map((entry) => entry.country)
})

const favoritePreview = computed(() => store.favoriteCountries.slice(0, 5))
const topPopulationPreview = computed(() => store.topPopulatedCountries.slice(0, 5))

function seededScore(code) {
  const daySeed = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const source = `${String(code || '')}${daySeed}`
  let hash = 0

  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1320px;
}

.section-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.quick-card {
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.quick-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.3);
}

.quick-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 700;
}

.favorites-preview,
.top-preview-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.preview-item {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.preview-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(2px);
}

.rank-pill {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.14);
  font-weight: 700;
}

@media (max-width: 959px) {
  .section-header {
    flex-wrap: wrap;
  }
}
</style>
