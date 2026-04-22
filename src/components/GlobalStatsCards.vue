<template>
  <v-row class="mb-4">
    <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
      <v-card class="h-100">
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
