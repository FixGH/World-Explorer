<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste des pays</h1>

    <!-- Chargement -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste des pays -->
    <v-row v-else>
      <v-col
          v-for="country in countries"
          :key="country.cca3"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card class="h-100" hover>
          <v-img
              :src="country.flags?.png"
              :alt="country.name?.common"
              height="200"
              cover
          />

          <v-card-title>
            {{ country.name?.common }}
          </v-card-title>

          <v-card-text>
            <div>
              <strong>Capitale :</strong>
              {{ country.capital?.[0] || 'Non renseignée' }}
            </div>

            <div>
              <strong>Région :</strong>
              {{ country.region || 'Non renseignée' }}
            </div>

            <div>
              <strong>Population :</strong>
              {{ country.population?.toLocaleString() || 'Non renseignée' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État réactif
const countries = ref([])
const loading = ref(true)
const error = ref(null)

// Chargement des données au montage du composant
onMounted(async () => {
  try {
    const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3'
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()

    // RestCountries renvoie directement un tableau
    countries.value = data
  } catch (err) {
    error.value = `Impossible de charger les pays : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>