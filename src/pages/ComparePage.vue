<template>
  <v-container class="py-6">
    <v-card variant="tonal" rounded="lg" class="mb-5 compare-hero">
      <v-card-text class="d-flex align-center justify-space-between py-4 compare-hero-content">
        <div>
          <h1 class="text-h4 font-weight-bold">Comparer des pays</h1>
          <p class="text-medium-emphasis mt-1">
            Sélectionnez deux pays pour visualiser leurs données côte à côte.
          </p>
        </div>
        <v-btn variant="tonal" color="secondary" rounded="lg" class="reset-btn" @click="store.resetCompare">
          Réinitialiser
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card variant="tonal" class="mb-5 compare-select-card" rounded="lg">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              :items="countryItems"
              :model-value="store.compareLeftCode"
              item-title="title"
              item-value="value"
              label="Pays A"
              prepend-inner-icon="mdi-earth"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
              @update:model-value="store.setCompareLeftCode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete
              :items="countryItems"
              :model-value="store.compareRightCode"
              item-title="title"
              item-value="value"
              label="Pays B"
              prepend-inner-icon="mdi-earth"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
              @update:model-value="store.setCompareRightCode"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-alert v-if="store.loading" type="info" variant="tonal" class="mb-4">
      Chargement de la liste des pays...
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-alert
      v-else-if="!store.compareLeftCountry || !store.compareRightCountry"
      type="info"
      variant="tonal"
      class="mb-4"
    >
      Sélectionnez deux pays (Pays A et Pays B) pour afficher la comparaison détaillée.
    </v-alert>

    <template v-else>
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <v-card class="country-head-card" rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>{{ store.compareLeftCountry.name?.common }}</span>
              <v-btn
                variant="tonal"
                prepend-icon="mdi-open-in-new"
                :to="{ name: 'country-details', params: { code: store.compareLeftCountry.cca3 } }"
                class="details-link-btn"
              >
                Détails
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="country-head-card" rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>{{ store.compareRightCountry.name?.common }}</span>
              <v-btn
                variant="tonal"
                prepend-icon="mdi-open-in-new"
                :to="{ name: 'country-details', params: { code: store.compareRightCountry.cca3 } }"
                class="details-link-btn"
              >
                Détails
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <CountryCompareTable :left="store.compareLeftCountry" :right="store.compareRightCountry" />
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import CountryCompareTable from '@/components/CountryCompareTable.vue'

const store = useCountriesStore()

const countryItems = computed(() => {
  return store.countries.map((c) => ({
    title: `${c.name?.common || 'Sans nom'} (${c.cca3})`,
    value: c.cca3,
  }))
})

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})

watch(
  () => store.compareLeftCode,
  (code) => {
    if (!code) return
    store.ensureCompareCountryData(code)
  },
  { immediate: true },
)

watch(
  () => store.compareRightCode,
  (code) => {
    if (!code) return
    store.ensureCompareCountryData(code)
  },
  { immediate: true },
)
</script>

<style scoped>
.compare-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, rgba(var(--v-theme-primary), 0.2), rgba(255, 255, 255, 0.03));
}

.reset-btn {
  text-transform: none;
  font-weight: 600;
}

.compare-select-card,
.country-head-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.details-link-btn {
  text-transform: none;
}

@media (max-width: 860px) {
  .compare-hero-content {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
}
</style>
