<template>
  <v-container>
    <h1 class="text-h4 my-4">Favorite Countries</h1>

    <v-alert v-if="!store.favoriteCountries.length" type="info" variant="tonal">
      You have no favorite countries yet.
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="country in store.favoriteCountries"
        :key="country.cca3"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CountryCard
          :country="country"
          :is-favorite="true"
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

const store = useCountriesStore()

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>
