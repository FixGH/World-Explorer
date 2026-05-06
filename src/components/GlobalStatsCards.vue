<template>
  <v-row class="mb-4">
    <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
      <v-card class="stats-card h-100" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-2 text-medium-emphasis">{{ stat.label }}</div>
            <v-icon :icon="stat.icon" />
          </div>
          <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.stats-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.stats-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.32);
}
</style>
