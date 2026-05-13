<template>
  <v-container class="py-6 countries-page">
    <v-card variant="tonal" rounded="lg" class="mb-5 countries-hero">
      <v-card-text class="d-flex align-center justify-space-between py-4">
        <h1 class="text-h4 font-weight-bold">Explorateur de pays</h1>
        <div class="d-flex ga-2 hero-actions">
          <v-btn
            color="secondary"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-compare"
            to="/compare"
            class="compare-btn"
          >
            Comparer
          </v-btn>
          <v-btn
            v-if="authStore.isAuthenticated"
            color="primary"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-plus"
            :to="{ name: 'add-country' }"
            class="compare-btn"
          >
            Ajouter un pays
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

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
        @update:search-query="store.setSearchQuery"
        @update:selected-region="store.setSelectedRegion"
        @update:sort-option="store.setSortOption"
        @reset="store.resetFilters"
      />

      <v-alert
        v-if="!store.filteredCountries.length"
        type="info"
        variant="tonal"
        rounded="lg"
        class="mb-4"
      >
        Aucun pays ne correspond à votre recherche.
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="country in store.filteredCountries"
          :key="country.cca3"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
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
.countries-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, rgba(var(--v-theme-primary), 0.2), rgba(255, 255, 255, 0.03));
}

.compare-btn {
  text-transform: none;
  font-weight: 600;
}

@media (max-width: 760px) {
  .countries-hero :deep(.v-card-text) {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
}
</style>
