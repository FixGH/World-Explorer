<template>
  <v-container>
    <div class="d-flex align-center justify-space-between my-4">
      <h1 class="text-h4">Comparer des pays</h1>
      <v-btn variant="text" color="secondary" @click="store.resetCompare">Réinitialiser</v-btn>
    </div>

    <v-card variant="tonal" class="mb-4">
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
      Sélectionnez deux pays pour afficher la comparaison.
    </v-alert>

    <CountryCompareTable
      v-else
      :left="store.compareLeftCountry"
      :right="store.compareRightCountry"
    />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
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
</script>
