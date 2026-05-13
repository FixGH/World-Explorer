<template>
  <v-container class="py-6 home-page">
    <HomeHero class="mb-6" />

    <v-row class="mb-6" align="stretch">
      <v-col cols="12" xl="8">
        <div class="section-header mb-3">
          <h2 class="text-h5 font-weight-bold">Commencer votre exploration</h2>
          <v-btn variant="text" color="primary" :to="{ name: 'countries' }">Explorer maintenant</v-btn>
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="quick-card quick-card--large h-100" rounded="lg" :to="{ name: 'countries' }">
              <v-card-text>
                <div class="quick-title"><v-icon icon="mdi-earth" size="22" /> Explorer les pays</div>
                <div class="text-medium-emphasis text-body-2">Parcourir, filtrer et trier les pays en quelques secondes.</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="quick-card quick-card--large h-100" rounded="lg" :to="{ name: 'compare' }">
              <v-card-text>
                <div class="quick-title"><v-icon icon="mdi-compare" size="22" /> Comparer deux pays</div>
                <div class="text-medium-emphasis text-body-2">Visualiser rapidement les écarts clés entre deux destinations.</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'statistics' }">
              <v-card-text>
                <div class="quick-title"><v-icon icon="mdi-chart-box-outline" size="22" /> Voir les statistiques</div>
                <div class="text-medium-emphasis text-body-2">Accéder aux indicateurs globaux et aux tendances majeures.</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="quick-card h-100" rounded="lg" :to="{ name: 'favorites' }">
              <v-card-text>
                <div class="quick-title"><v-icon icon="mdi-heart-multiple-outline" size="22" /> Gérer mes favoris</div>
                <div class="text-medium-emphasis text-body-2">Retrouver votre sélection et reprendre votre exploration.</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" xl="4">
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
    </v-row>

    <v-row class="mb-6" align="stretch">
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
                    <v-img :src="getCountryFlagSrc(country)" :alt="country.name?.common" cover />
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

    <div class="section-header mb-4">
      <h2 class="text-h5 font-weight-bold">Vue d'ensemble mondiale</h2>
    </div>
    <GlobalStatsCards :stats="stats" />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import HomeHero from '@/components/HomeHero.vue'
import GlobalStatsCards from '@/components/GlobalStatsCards.vue'
import RecentlyViewedCountries from '@/components/RecentlyViewedCountries.vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

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

const favoritePreview = computed(() => store.favoriteCountries.slice(0, 5))
const topPopulationPreview = computed(() => store.topPopulatedCountries.slice(0, 5))

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1360px;
  position: relative;
}

.home-page::before {
  content: '';
  position: absolute;
  right: -120px;
  top: 160px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.12), rgba(var(--v-theme-primary), 0));
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
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.quick-card--large :deep(.v-card-text) {
  padding-top: 24px;
  padding-bottom: 24px;
}

.quick-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.38);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.32);
}

.quick-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: 700;
}

.favorites-preview,
.top-preview-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
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
  background: rgba(var(--v-theme-primary), 0.16);
  font-weight: 700;
}

@media (max-width: 1400px) {
  .home-page::before {
    right: -180px;
  }
}

@media (max-width: 959px) {
  .section-header {
    flex-wrap: wrap;
  }

  .home-page::before {
    display: none;
  }
}
</style>
