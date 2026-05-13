<template>
  <v-card variant="tonal" class="mb-5 filters-card" rounded="lg">
    <v-card-text class="filters-card-text">
      <v-row class="filters-row" align="stretch">
        <v-col cols="12" md="12" lg="4" class="filters-col">
          <v-text-field
            :model-value="searchQuery"
            label="Recherche par nom"
            placeholder="Ex: France, Japon, Brésil..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            @update:model-value="$emit('update:search-query', $event)"
          />
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="3" class="filters-col">
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

        <v-col cols="12" sm="6" md="6" lg="3" class="filters-col">
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

        <v-col cols="12" sm="12" md="12" lg="2" class="filters-col filters-reset-col">
          <v-btn
            variant="tonal"
            color="secondary"
            class="reset-btn"
            prepend-icon="mdi-backup-restore"
            @click="$emit('reset')"
          >
            Réinitialiser
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
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
  { title: 'Population (décroissante)', value: 'population-desc' },
]
</script>

<style scoped>
.filters-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}

.filters-card-text {
  padding: 16px 18px 18px;
}

@media (min-width: 960px) {
  .filters-card-text {
    padding: 20px 22px 22px;
  }
}

.filters-row {
  margin-top: -6px;
  margin-bottom: -6px;
}

.filters-col {
  padding-top: 6px;
  padding-bottom: 6px;
}

.filters-reset-col {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}

@media (min-width: 1280px) {
  .filters-reset-col {
    justify-content: flex-end;
    align-items: center;
  }
}

.reset-btn {
  width: 100%;
  min-height: 44px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.02em;
}

@media (min-width: 1280px) {
  .reset-btn {
    width: auto;
    min-width: 8.75rem;
    align-self: center;
  }
}
</style>
