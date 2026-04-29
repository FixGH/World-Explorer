<template>
  <v-container class="py-6">
    <v-card variant="tonal" rounded="lg" class="mb-4">
      <v-card-text class="py-4">
        <h1 class="text-h4 font-weight-bold">Pays favoris</h1>
        <p class="text-medium-emphasis mt-1">
          Retrouvez rapidement les pays que vous avez sélectionnés.
        </p>
      </v-card-text>
    </v-card>

    <StatsSummaryCards :items="favoriteSummaryItems" />

    <v-card rounded="lg" class="mb-4" variant="tonal">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="favoritesSearch"
              label="Rechercher dans les favoris"
              placeholder="Ex: France, Japon..."
              prepend-inner-icon="mdi-magnify"
              clearable
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="favoritesSort"
              :items="sortItems"
              label="Trier"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-alert
      v-if="!store.favoriteCountries.length"
      type="info"
      variant="tonal"
      rounded="lg"
    >
      Vous n'avez pas encore de pays favoris. Ajoutez-en depuis l'explorateur ou la fiche détail.
      <template #append>
        <v-btn variant="text" color="primary" :to="{ name: 'countries' }">
          Explorer les pays
        </v-btn>
      </template>
    </v-alert>

    <template v-else>
      <v-alert
        v-if="visibleFavorites.length === 0"
        type="info"
        variant="tonal"
        rounded="lg"
        class="mb-4"
      >
        Aucun favori ne correspond à votre recherche.
        <template #append>
          <v-btn variant="text" color="primary" @click="resetFavoritesControls">
            Réinitialiser
          </v-btn>
        </template>
      </v-alert>

      <v-row v-if="visibleFavorites.length">
        <v-col
          v-for="country in visibleFavorites"
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
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import CountryCard from '@/components/CountryCard.vue'
import StatsSummaryCards from '@/components/StatsSummaryCards.vue'

const store = useCountriesStore()

const favoritesSearch = ref('')
const favoritesSort = ref('name-asc')

const sortItems = [
  { title: 'Nom (A -> Z)', value: 'name-asc' },
  { title: 'Population (décroissante)', value: 'population-desc' },
]

const favoriteSummaryItems = computed(() => [
  {
    label: 'Pays favoris',
    value: store.favoritesCount.toLocaleString('fr-FR'),
    icon: 'mdi-heart',
  },
  {
    label: 'Régions favorites',
    value: store.favoriteRegionsCount.toLocaleString('fr-FR'),
    icon: 'mdi-map',
  },
  {
    label: 'Population totale (favoris)',
    value: store.favoriteTotalPopulation.toLocaleString('fr-FR'),
    icon: 'mdi-account-group',
  },
])

const visibleFavorites = computed(() => {
  const query = favoritesSearch.value.trim().toLowerCase()

  let list = store.favoriteCountries
  if (query) {
    list = list.filter((country) => (country?.name?.common || '').toLowerCase().includes(query))
  }

  const sorted = [...list]
  sorted.sort((a, b) => {
    switch (favoritesSort.value) {
      case 'population-desc':
        return (b?.population || 0) - (a?.population || 0)
      case 'name-asc':
      default:
        return (a?.name?.common || '').localeCompare(b?.name?.common || '')
    }
  })

  return sorted
})

function resetFavoritesControls() {
  favoritesSearch.value = ''
  favoritesSort.value = 'name-asc'
}

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>
