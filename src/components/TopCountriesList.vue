<template>
  <v-card class="h-100 ranking-card">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>{{ title }}</span>
      <v-chip size="small" variant="tonal" color="primary">Top 10</v-chip>
    </v-card-title>
    <v-divider />
    <v-list v-if="items.length">
      <v-list-item
        v-for="(country, index) in items"
        :key="country.cca3"
        :title="`${index + 1}. ${country.name?.common || 'Non disponible'}`"
        :subtitle="formatValue(valueAccessor(country))"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="rank-item mb-1"
      >
        <template #prepend>
          <v-avatar size="30" class="rank-badge" rounded="lg">
            {{ index + 1 }}
          </v-avatar>
        </template>
        <template #append>
          <v-progress-linear
            :model-value="progressValue(valueAccessor(country))"
            color="primary"
            bg-color="grey-darken-1"
            height="8"
            rounded
            style="width: 110px"
          />
        </template>
      </v-list-item>
    </v-list>
    <v-card-text v-else class="text-medium-emphasis">
      Données non disponibles.
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  valueAccessor: {
    type: Function,
    required: true,
  },
  formatter: {
    type: Function,
    required: true,
  },
})

function formatValue(value) {
  if (!Number.isFinite(value)) return 'Non disponible'
  return props.formatter(value)
}

function progressValue(value) {
  const maxValue = Number(props.valueAccessor(props.items[0]) || 0)
  if (!Number.isFinite(value) || maxValue <= 0) return 0
  return (Number(value) / maxValue) * 100
}
</script>

<style scoped>
.ranking-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.015);
}

.v-list-item {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.rank-item {
  cursor: pointer;
}

.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(3px);
}

.rank-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.14);
}
</style>
