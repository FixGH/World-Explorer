<template>
  <v-container>
    <v-btn variant="text" :to="{ name: 'countries' }" class="mb-4">
      <v-icon icon="mdi-arrow-left" class="mr-1" />
      Back to countries
    </v-btn>

    <LoadingState v-if="store.selectedCountryLoading" :item-count="1" />

    <ErrorState
      v-else-if="store.selectedCountryError"
      :message="store.selectedCountryError"
      retryable
      @retry="loadCountry"
    />

    <v-row v-else-if="country">
      <v-col cols="12" md="4">
        <v-img :src="flagSrc" :alt="country.name?.common" rounded="lg" cover>
          <template #error>
            <v-sheet height="240" class="d-flex align-center justify-center" rounded="lg">
              <v-icon icon="mdi-flag-outline" size="64" />
            </v-sheet>
          </template>
        </v-img>
      </v-col>
      <v-col cols="12" md="8">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4">{{ country.name?.common }}</h1>
          <v-btn
            :prepend-icon="store.isFavorite(country.cca3) ? 'mdi-heart' : 'mdi-heart-outline'"
            variant="tonal"
            color="secondary"
            @click="store.toggleFavorite(country.cca3)"
          >
            {{ store.isFavorite(country.cca3) ? 'Remove favorite' : 'Add favorite' }}
          </v-btn>
        </div>

        <v-list lines="two" class="mt-4">
          <v-list-item
            prepend-icon="mdi-card-account-details"
            title="Nom officiel"
            :subtitle="country.name?.official || 'Unknown'"
          />
          <v-list-item prepend-icon="mdi-city" title="Capitale" :subtitle="country.capital?.[0] || 'Unknown'" />
          <v-list-item prepend-icon="mdi-earth" title="Région" :subtitle="country.region || 'Unknown'" />
          <v-list-item prepend-icon="mdi-account-group" title="Population" :subtitle="formattedPopulation" />
          <v-list-item prepend-icon="mdi-identifier" title="Code CCA3" :subtitle="country.cca3" />
        </v-list>
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

const route = useRoute()
const store = useCountriesStore()

const countryCode = computed(() => String(route.params.code || ''))
const country = computed(() => store.selectedCountry)
const flagSrc = computed(() => country.value?.flags?.svg || country.value?.flags?.png || '')
const formattedPopulation = computed(() => {
  const value = country.value?.population
  return value ? value.toLocaleString() : 'Unknown'
})

function loadCountry() {
  if (countryCode.value) {
    store.fetchCountryByCode(countryCode.value)
  }
}

onMounted(loadCountry)
watch(countryCode, loadCountry)
</script>
