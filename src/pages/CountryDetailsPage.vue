<template>
  <v-container class="py-4 py-md-6">
    <v-btn variant="text" :to="{ name: 'countries' }" class="mb-4">
      <v-icon icon="mdi-arrow-left" class="mr-1" />
      Retour à la liste
    </v-btn>

    <LoadingState v-if="store.selectedCountryLoading" :item-count="1" />

    <ErrorState
      v-else-if="store.selectedCountryError"
      :message="store.selectedCountryError"
      retryable
      @retry="loadCountry"
    />

    <v-row v-else-if="country">
      <v-col cols="12" lg="4">
        <v-card class="mb-4 details-flag-card" rounded="lg">
          <v-img :src="flagSrc" :alt="country.name?.common" height="240" rounded="lg" cover>
            <template #error>
              <v-sheet height="240" class="d-flex align-center justify-center" rounded="lg">
                <v-icon icon="mdi-flag-outline" size="64" />
              </v-sheet>
            </template>
          </v-img>
          <v-card-text>
            <div class="text-h5 mb-1">{{ country.name?.common || fallback }}</div>
            <div class="text-medium-emphasis">{{ country.name?.official || fallback }}</div>
            <div class="mt-3 d-flex flex-wrap ga-2">
              <v-chip size="small" variant="tonal">
                {{ country.continents?.join(', ') || fallback }}
              </v-chip>
              <v-chip size="small" variant="tonal">
                {{ independentLabel }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <v-card rounded="lg" class="details-map-links">
          <v-card-title>Cartes</v-card-title>
          <v-card-text class="d-flex flex-wrap ga-2">
          <v-btn
              :href="country.maps?.googleMaps"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-google-maps"
              :disabled="!country.maps?.googleMaps"
              class="map-link-btn"
            >
              Google Maps
            </v-btn>
            <v-btn
              :href="country.maps?.openStreetMaps"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-map"
              :disabled="!country.maps?.openStreetMaps"
              class="map-link-btn"
            >
              OpenStreetMap
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <div class="d-flex align-center justify-space-between mb-4 details-header">
          <h1 class="text-h4 font-weight-bold">Informations du pays</h1>
          <v-btn
            :prepend-icon="store.isFavorite(country.cca3) ? 'mdi-heart' : 'mdi-heart-outline'"
            variant="tonal"
            color="secondary"
            class="favorite-toggle-btn"
            @click="store.toggleFavorite(country.cca3)"
          >
            {{ store.isFavorite(country.cca3) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </v-btn>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="h-100 details-block" rounded="lg">
              <v-card-title>Identité</v-card-title>
              <v-divider />
              <v-list lines="two">
                <v-list-item prepend-icon="mdi-card-account-details" title="Nom commun" :subtitle="country.name?.common || fallback" />
                <v-list-item prepend-icon="mdi-card-text" title="Nom officiel" :subtitle="country.name?.official || fallback" />
                <v-list-item prepend-icon="mdi-identifier" title="Code CCA2" :subtitle="country.cca2 || fallback" />
                <v-list-item prepend-icon="mdi-identifier" title="Code CCA3" :subtitle="country.cca3 || fallback" />
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="h-100 details-block" rounded="lg">
              <v-card-title>Géographie</v-card-title>
              <v-divider />
              <v-list lines="two">
                <v-list-item prepend-icon="mdi-city" title="Capitale" :subtitle="country.capital?.[0] || fallback" />
                <v-list-item prepend-icon="mdi-earth" title="Région" :subtitle="country.region || fallback" />
                <v-list-item prepend-icon="mdi-map-marker-radius" title="Sous-région" :subtitle="country.subregion || fallback" />
                <v-list-item prepend-icon="mdi-map" title="Continents" :subtitle="continentsLabel" />
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="h-100 details-block" rounded="lg">
              <v-card-title>Statistiques</v-card-title>
              <v-divider />
              <v-list lines="two">
                <v-list-item prepend-icon="mdi-account-group" title="Population" :subtitle="formattedPopulation" />
                <v-list-item prepend-icon="mdi-ruler-square" title="Superficie" :subtitle="formattedArea" />
                <v-list-item prepend-icon="mdi-flag" title="Statut indépendant" :subtitle="independentLabel" />
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="h-100 details-block" rounded="lg">
              <v-card-title>Culture et temps</v-card-title>
              <v-divider />
              <v-list lines="two">
                <v-list-item prepend-icon="mdi-translate" title="Langues" :subtitle="languagesLabel" />
                <v-list-item prepend-icon="mdi-cash" title="Monnaies" :subtitle="currenciesLabel" />
                <v-list-item prepend-icon="mdi-clock-outline" title="Fuseaux horaires" :subtitle="timezonesLabel" />
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="mt-4 details-block" rounded="lg">
          <v-card-title>Pays frontaliers</v-card-title>
          <v-card-text>
            <div v-if="!borders.length" class="text-medium-emphasis">
              {{ fallback }}
            </div>
            <div v-else class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="borderCode in borders"
                :key="borderCode"
                color="primary"
                variant="tonal"
                :to="{ name: 'country-details', params: { code: borderCode } }"
              >
                {{ borderCountryLabel(borderCode) }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-4 details-block map-panel" rounded="lg">
          <v-card-title>Localisation du pays</v-card-title>
          <v-card-text>
            <CountryMap
              v-if="hasCoordinates"
              :latlng="coordinates"
              :country-name="country.name?.common || 'Pays'"
            />
            <v-alert v-else type="info" variant="tonal">
              Coordonnées géographiques non disponibles pour ce pays.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" variant="tonal">
      Aucun pays à afficher.
    </v-alert>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import CountryMap from '@/components/CountryMap.vue'

const route = useRoute()
const store = useCountriesStore()
const fallback = 'Non disponible'

const countryCode = computed(() => String(route.params.code || ''))
const country = computed(() => store.selectedCountry)
const flagSrc = computed(() => country.value?.flags?.svg || country.value?.flags?.png || '')
const formattedPopulation = computed(() => {
  const value = country.value?.population
  return Number.isFinite(value) ? value.toLocaleString('fr-FR') : fallback
})
const formattedArea = computed(() => {
  const value = country.value?.area
  return Number.isFinite(value) ? `${value.toLocaleString('fr-FR')} km²` : fallback
})
const continentsLabel = computed(() => country.value?.continents?.join(', ') || fallback)
const languagesLabel = computed(() => {
  const languages = country.value?.languages
  return languages ? Object.values(languages).join(', ') : fallback
})
const currenciesLabel = computed(() => {
  const currencies = country.value?.currencies
  if (!currencies) return fallback
  return Object.values(currencies)
    .map((currency) => {
      const name = currency?.name || ''
      const symbol = currency?.symbol ? ` (${currency.symbol})` : ''
      return `${name}${symbol}`.trim() || fallback
    })
    .join(', ')
})
const timezonesLabel = computed(() => country.value?.timezones?.join(', ') || fallback)
const independentLabel = computed(() => {
  if (country.value?.independent === true) return 'Oui'
  if (country.value?.independent === false) return 'Non'
  return fallback
})
const borders = computed(() => country.value?.borders || [])
const coordinates = computed(() => country.value?.latlng || [])
const hasCoordinates = computed(() => {
  return Array.isArray(coordinates.value)
    && coordinates.value.length >= 2
    && Number.isFinite(coordinates.value[0])
    && Number.isFinite(coordinates.value[1])
})

function loadCountry() {
  if (countryCode.value) {
    store.fetchCountryByCode(countryCode.value)
  }
}

function borderCountryLabel(code) {
  return store.getCountryNameByCode(code)
}

onMounted(loadCountry)
watch(countryCode, loadCountry)
watch(country, (newCountry) => {
  if (newCountry?.cca3) {
    store.markRecentlyViewed(newCountry)
  }
})

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.details-header {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
  background: linear-gradient(140deg, rgba(var(--v-theme-primary), 0.14), rgba(255, 255, 255, 0.03));
}

.details-flag-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.02);
}

.details-map-links,
.details-block {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.details-block {
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.details-block:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.28);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
}

.map-link-btn {
  text-transform: none;
}

.favorite-toggle-btn {
  text-transform: none;
  font-weight: 600;
}

.map-panel {
  overflow: hidden;
}

@media (max-width: 959px) {
  .details-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
