<template>
  <v-card class="country-card h-100 d-flex flex-column" hover rounded="lg">
    <v-img :src="flagSrc" :alt="country.name?.common" height="184" cover class="country-flag" rounded="lg">
      <template #error>
        <v-sheet height="180" class="d-flex align-center justify-center">
          <v-icon icon="mdi-flag-outline" size="48" />
        </v-sheet>
      </template>
    </v-img>

    <v-card-title class="text-wrap font-weight-bold text-body-1 pt-4">
      {{ country.name?.common }}
    </v-card-title>

    <v-card-text class="flex-grow-1 country-meta">
      <div class="text-medium-emphasis"><strong>Capitale :</strong> {{ country.capital?.[0] || 'Non disponible' }}</div>
      <div class="text-medium-emphasis"><strong>Région :</strong> {{ country.region || 'Non disponible' }}</div>
      <div class="text-medium-emphasis"><strong>Population :</strong> {{ formattedPopulation }}</div>
    </v-card-text>

    <v-card-actions class="country-actions px-4 pb-4">
      <v-btn
        color="primary"
        variant="tonal"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="details-btn"
      >
        Détails
      </v-btn>
      <v-spacer />
      <v-btn
        :icon="favoriteIcon"
        variant="tonal"
        rounded="lg"
        class="favorite-btn"
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}

.country-card:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--v-theme-primary), 0.38);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.36);
}

.country-flag :deep(img) {
  object-position: center;
}

.country-meta {
  display: grid;
  gap: 8px;
  line-height: 1.4;
}

.country-actions {
  margin-top: auto;
}

.details-btn {
  text-transform: none;
  font-weight: 600;
}

.favorite-btn {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.05);
}
</style>
