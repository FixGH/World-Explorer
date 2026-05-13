<template>
  <v-container class="py-6">
    <v-card rounded="lg" class="add-country-card">
      <v-card-title class="text-h5 font-weight-bold">Ajouter un pays personnalisé</v-card-title>
      <v-card-subtitle>
        Ce pays est enregistré localement dans votre navigateur et n'affecte pas l'API REST Countries.
      </v-card-subtitle>
      <v-card-text class="pt-5">
        <div class="d-flex flex-wrap align-center ga-4 mb-6 preview-row">
          <v-img
            :src="CUSTOM_COUNTRY_FLAG_ASSET"
            alt="Visuel par défaut pays personnalisé"
            width="112"
            height="112"
            cover
            rounded="lg"
            class="preview-thumb border-sm"
          />
          <p class="text-body-2 text-medium-emphasis mb-0 preview-caption">
            Visuel utilisé automatiquement pour les pays personnalisés (aucun téléversement requis).
          </p>
        </div>
        <AddCountryForm @submit="onSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'
import AddCountryForm from '@/components/AddCountryForm.vue'
import { CUSTOM_COUNTRY_FLAG_ASSET } from '@/utils/countryFlagSrc'

const router = useRouter()
const countriesStore = useCountriesStore()

function onSubmit(payload) {
  const result = countriesStore.addCustomCountry(payload)
  if (result.success) {
    router.push({ name: 'countries' })
  }
}
</script>

<style scoped>
.add-country-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
}

.preview-thumb {
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

.preview-caption {
  max-width: 420px;
  line-height: 1.45;
}

@media (max-width: 600px) {
  .preview-row {
    flex-direction: column;
    align-items: flex-start !important;
  }
}
</style>
