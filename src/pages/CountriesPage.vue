<template>
  <v-container>
    <h1 class="text-h4 my-4">Country Explorer</h1>

    <LoadingState v-if="store.loading" />

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      retryable
      @retry="store.fetchCountries"
    />

    <v-row v-else>
      <v-col
        v-for="country in store.countries"
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
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import CountryCard from '@/components/CountryCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useCountriesStore()

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>
