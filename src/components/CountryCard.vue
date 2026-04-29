<template>
  <v-card class="country-card h-100 d-flex flex-column" hover rounded="lg">
    <v-img :src="flagSrc" :alt="country.name?.common" height="180" cover rounded="lg">
      <template #error>
        <v-sheet height="180" class="d-flex align-center justify-center">
          <v-icon icon="mdi-flag-outline" size="48" />
        </v-sheet>
      </template>
    </v-img>

    <v-card-title class="text-wrap font-weight-medium text-body-1">
      {{ country.name?.common }}
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <div class="text-medium-emphasis"><strong>Capitale :</strong> {{ country.capital?.[0] || 'Non disponible' }}</div>
      <div class="text-medium-emphasis"><strong>Région :</strong> {{ country.region || 'Non disponible' }}</div>
      <div class="text-medium-emphasis"><strong>Population :</strong> {{ formattedPopulation }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
      >
        Détails
      </v-btn>
      <v-spacer />
      <v-btn
        :icon="favoriteIcon"
        variant="text"
        rounded="lg"
        @click="$emit('toggle-favorite', country.cca3)"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  country: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-favorite'])

const flagSrc = computed(() => props.country?.flags?.svg || props.country?.flags?.png || '')

const formattedPopulation = computed(() => {
  const value = props.country?.population
  return value ? value.toLocaleString('fr-FR') : 'Non disponible'
})

const favoriteIcon = computed(() => (props.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'))
</script>

<style scoped>
.country-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.country-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
}
</style>
