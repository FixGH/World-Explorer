<template>
  <v-card class="h-100 d-flex flex-column" hover>
    <v-img :src="flagSrc" :alt="country.name?.common" height="180" cover>
      <template #error>
        <v-sheet height="180" class="d-flex align-center justify-center">
          <v-icon icon="mdi-flag-outline" size="48" />
        </v-sheet>
      </template>
    </v-img>

    <v-card-title>{{ country.name?.common }}</v-card-title>

    <v-card-text class="flex-grow-1">
      <div><strong>Capital:</strong> {{ country.capital?.[0] || 'Unknown' }}</div>
      <div><strong>Region:</strong> {{ country.region || 'Unknown' }}</div>
      <div><strong>Population:</strong> {{ formattedPopulation }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
      >
        Details
      </v-btn>
      <v-spacer />
      <v-btn :icon="favoriteIcon" variant="text" @click="$emit('toggle-favorite', country.cca3)" />
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
  return value ? value.toLocaleString() : 'Unknown'
})

const favoriteIcon = computed(() => (props.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'))
</script>
