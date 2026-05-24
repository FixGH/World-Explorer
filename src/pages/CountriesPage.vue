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
            Parcourez le monde et découvrez-le d'un nouvel œil
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
        class="mb-8 mb-md-10"
        @update:search-query="store.setSearchQuery"
        @update:selected-region="store.setSelectedRegion"
        @update:sort-option="store.setSortOption"
        @reset="store.resetFilters"
      />

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
          lg="6"
          xl="6"
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
import { onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import { useAuthStore } from '@/stores/auth'
import CountryCard from '@/components/CountryCard.vue'
import CountryFilters from '@/components/CountryFilters.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useCountriesStore()
const authStore = useAuthStore()

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
  margin-top: 8px;
  row-gap: 8px;
}

.countries-grid :deep(> .v-col) {
  padding-top: 16px;
  padding-bottom: 16px;
}

@media (min-width: 960px) {
  .countries-grid {
    row-gap: 12px;
  }

  .countries-grid :deep(> .v-col) {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-inline: 14px;
  }
}

@media (min-width: 1280px) {
  .countries-grid :deep(> .v-col) {
    padding-inline: 20px;
  }
}
</style>
