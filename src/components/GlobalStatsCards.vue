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
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}
</style>
