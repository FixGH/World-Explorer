<template>
  <v-form @submit.prevent="submitForm">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="form.name" label="Nom" variant="outlined" rounded="lg" :rules="[requiredRule]" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="form.capital" label="Capitale" variant="outlined" rounded="lg" :rules="[requiredRule]" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="form.region" label="Région" variant="outlined" rounded="lg" :rules="[requiredRule]" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="form.population"
          label="Population"
          type="number"
          min="0"
          variant="outlined"
          rounded="lg"
          :rules="[positiveNumberRule]"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="form.area"
          label="Superficie (km²)"
          type="number"
          min="0"
          variant="outlined"
          rounded="lg"
          :rules="[positiveNumberRule]"
        />
      </v-col>
    </v-row>

    <div class="d-flex ga-2">
      <v-btn type="submit" color="primary" rounded="lg">
        Ajouter le pays
      </v-btn>
      <v-btn variant="text" rounded="lg" :to="{ name: 'countries' }">
        Annuler
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  capital: '',
  region: '',
  population: 0,
  area: 0,
})

const requiredRule = (value) => Boolean(String(value || '').trim()) || 'Champ requis.'
const positiveNumberRule = (value) => Number(value) >= 0 || 'Valeur invalide.'

function submitForm() {
  if (!form.name.trim() || !form.capital.trim() || !form.region.trim()) return

  emit('submit', {
    name: form.name.trim(),
    capital: form.capital.trim(),
    region: form.region.trim(),
    population: Number(form.population || 0),
    area: Number(form.area || 0),
  })
}
</script>
