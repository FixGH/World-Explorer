<template>
  <v-card variant="tonal" class="mb-4">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            :model-value="searchQuery"
            label="Recherche par nom"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            @update:model-value="$emit('update:search-query', $event)"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="selectedRegion"
            :items="regionItems"
            label="Région"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="$emit('update:selected-region', $event)"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="sortOption"
            :items="sortItems"
            label="Tri"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="$emit('update:sort-option', $event)"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center justify-end">
          <v-btn variant="text" color="secondary" @click="$emit('reset')">Reset</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  selectedRegion: {
    type: String,
    default: 'all',
  },
  sortOption: {
    type: String,
    default: 'name-asc',
  },
})

defineEmits(['update:search-query', 'update:selected-region', 'update:sort-option', 'reset'])

const regionItems = [
  { title: 'Toutes', value: 'all' },
  { title: 'Afrique', value: 'Africa' },
  { title: 'Amériques', value: 'Americas' },
  { title: 'Asie', value: 'Asia' },
  { title: 'Europe', value: 'Europe' },
  { title: 'Océanie', value: 'Oceania' },
]

const sortItems = [
  { title: 'Nom (A -> Z)', value: 'name-asc' },
  { title: 'Nom (Z -> A)', value: 'name-desc' },
  { title: 'Population (croissante)', value: 'population-asc' },
  { title: 'Population (decroissante)', value: 'population-desc' },
]
</script>
