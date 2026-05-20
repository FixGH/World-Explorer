<template>
  <v-card variant="flat" class="filters-panel" rounded="xl">
    <v-card-text class="filters-panel__inner">
      <div class="filters-panel__heading">
        <v-icon icon="mdi-tune-variant" size="20" class="filters-panel__heading-icon" aria-hidden="true" />
        <span class="filters-panel__heading-text">Recherche &amp; filtres</span>
      </div>

      <v-row class="filters-panel__row filters-panel__row--search" align="stretch">
        <v-col cols="12" class="filters-panel__col">
          <v-text-field
            :model-value="searchQuery"
            label="Rechercher un pays"
            placeholder="Tapez un nom : France, Japon, Brésil…"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            density="comfortable"
            flat
            clearable
            hide-details
            class="filters-field filters-field--search"
            @update:model-value="$emit('update:search-query', $event)"
          />
        </v-col>
      </v-row>

      <v-row class="filters-panel__row filters-panel__row--controls" align="end">
        <v-col cols="12" sm="12" md="5" lg="5" class="filters-panel__col">
          <v-select
            :model-value="selectedRegion"
            :items="regionItems"
            label="Continent / région"
            variant="solo-filled"
            density="comfortable"
            flat
            hide-details
            class="filters-field"
            @update:model-value="$emit('update:selected-region', $event)"
          />
        </v-col>

        <v-col cols="12" sm="12" md="5" lg="5" class="filters-panel__col">
          <v-select
            :model-value="sortOption"
            :items="sortItems"
            label="Trier par"
            variant="solo-filled"
            density="comfortable"
            flat
            hide-details
            class="filters-field"
            @update:model-value="$emit('update:sort-option', $event)"
          />
        </v-col>

        <v-col cols="12" sm="12" md="2" lg="2" class="filters-panel__col filters-panel__col--reset">
          <v-btn
            variant="tonal"
            color="primary"
            size="large"
            rounded="xl"
            class="reset-btn text-none font-weight-bold"
            prepend-icon="mdi-backup-restore"
            block
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
  { title: 'Toutes les régions', value: 'all' },
  { title: 'Afrique', value: 'Africa' },
  { title: 'Amériques', value: 'Americas' },
  { title: 'Asie', value: 'Asia' },
  { title: 'Europe', value: 'Europe' },
  { title: 'Océanie', value: 'Oceania' },
]

const sortItems = [
  { title: 'Nom (A → Z)', value: 'name-asc' },
  { title: 'Nom (Z → A)', value: 'name-desc' },
  { title: 'Population ↑', value: 'population-asc' },
  { title: 'Population ↓', value: 'population-desc' },
]
</script>

<style scoped>
.filters-panel {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(8, 20, 26, 0.72);
  backdrop-filter: blur(20px) saturate(1.25);
  -webkit-backdrop-filter: blur(20px) saturate(1.25);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(124, 243, 232, 0.05) inset,
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
}

.filters-panel__inner {
  padding: 18px 18px 20px !important;
}

@media (min-width: 960px) {
  .filters-panel__inner {
    padding: 22px 24px 24px !important;
  }
}

.filters-panel__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.filters-panel__heading-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.95;
}

.filters-panel__heading-text {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(186, 224, 222, 0.88);
}

.filters-panel__row {
  margin-top: 0;
  margin-bottom: 0;
}

.filters-panel__row--search {
  margin-bottom: 8px;
}

.filters-panel__row--controls {
  margin-top: 4px;
}

.filters-panel__col {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.filters-panel__col--reset {
  display: flex;
  align-items: stretch;
}

@media (min-width: 960px) {
  .filters-panel__col--reset {
    align-items: flex-end;
  }
}

.filters-field :deep(.v-field) {
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 12, 16, 0.55) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    transform 0.2s ease;
}

.filters-field :deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-primary), 0.55) !important;
  box-shadow:
    0 0 0 1px rgba(124, 243, 232, 0.25),
    0 10px 32px rgba(0, 0, 0, 0.28),
    0 0 40px rgba(23, 215, 209, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.filters-field--search :deep(.v-field) {
  min-height: 52px;
}

.filters-field--search :deep(.v-field--focused) {
  transform: translateY(-1px);
}

.filters-field :deep(.v-label) {
  font-weight: 600;
  opacity: 0.9;
}

.reset-btn {
  min-height: 48px;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 18px rgba(var(--v-theme-primary), 0.15);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(var(--v-theme-primary), 0.22);
}

@media (min-width: 960px) {
  .reset-btn {
    height: 48px;
  }
}
</style>
