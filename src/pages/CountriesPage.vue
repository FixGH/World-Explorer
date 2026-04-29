<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between my-4">
      <h1 class="text-h4 font-weight-bold">Explorateur de pays</h1>
      <v-btn
        color="secondary"
        variant="tonal"
        rounded="lg"
        prepend-icon="mdi-compare"
        to="/compare"
      >
        Comparer
      </v-btn>
    </div>

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
        >
          <CountryCard
            :country="country"
            :is-favorite="store.isFavorite(country.cca3)"
            @toggle-favorite="store.toggleFavorite"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import CountryCard from '@/components/CountryCard.vue'
import CountryFilters from '@/components/CountryFilters.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useCountriesStore()

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>
