<template>
  <v-card variant="flat" class="filters-toolbar mb-5" rounded="xl">
    <v-card-text class="filters-toolbar__inner">
      <v-row class="filters-toolbar__row" align="center">
        <v-col cols="12" md="12" lg="4" class="filters-toolbar__col">
          <v-text-field
            :model-value="searchQuery"
            label="Rechercher un pays"
            placeholder="France, Japon, Kenya…"
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

        <v-col cols="12" sm="6" md="6" lg="3" class="filters-toolbar__col">
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

        <v-col cols="12" sm="6" md="6" lg="3" class="filters-toolbar__col">
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

        <v-col cols="12" sm="12" md="12" lg="2" class="filters-toolbar__col filters-toolbar__col--reset">
          <v-btn
            variant="tonal"
            color="primary"
            size="large"
            rounded="xl"
            class="reset-btn text-none font-weight-bold"
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
.filters-toolbar {
  position: sticky;
  top: 88px;
  z-index: 4;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 22, 28, 0.55);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(124, 243, 232, 0.06) inset,
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.filters-toolbar:hover {
  border-color: rgba(124, 243, 232, 0.22);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(124, 243, 232, 0.1) inset;
}

.filters-toolbar__inner {
  padding: 14px 16px 16px !important;
}

@media (min-width: 960px) {
  .filters-toolbar__inner {
    padding: 18px 20px 20px !important;
  }
}

.filters-toolbar__row {
  margin-top: -4px;
  margin-bottom: -4px;
}

.filters-toolbar__col {
  padding-top: 4px;
  padding-bottom: 4px;
}

.filters-toolbar__col--reset {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
}

@media (min-width: 1280px) {
  .filters-toolbar__col--reset {
    justify-content: flex-end;
    align-items: center;
  }
}

.filters-field :deep(.v-field) {
  border-radius: 14px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(5, 14, 18, 0.45) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.filters-field :deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-primary), 0.55) !important;
  box-shadow:
    0 0 0 1px rgba(124, 243, 232, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.filters-field :deep(.v-label) {
  font-weight: 600;
  opacity: 0.88;
}

.reset-btn {
  width: 100%;
  min-height: 48px;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 22px rgba(var(--v-theme-primary), 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(var(--v-theme-primary), 0.28);
}

@media (min-width: 1280px) {
  .reset-btn {
    width: auto;
    min-width: 9rem;
  }
}

@media (max-width: 959px) {
  .filters-toolbar {
    position: relative;
    top: auto;
  }
}
</style>
