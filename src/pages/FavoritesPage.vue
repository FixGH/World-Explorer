<template>
  <v-container class="py-6">
    <div class="my-4">
      <h1 class="text-h4">Pays favoris</h1>
      <p class="text-medium-emphasis mt-1">
        Retrouvez rapidement les pays que vous avez sélectionnés.
      </p>
    </div>

    <v-alert v-if="!store.favoriteCountries.length" type="info" variant="tonal">
      Vous n'avez pas encore de pays favoris. Ajoutez-en depuis l'explorateur ou la fiche detail.
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
