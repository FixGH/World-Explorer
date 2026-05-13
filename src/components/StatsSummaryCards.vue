<template>
  <v-row class="mb-4">
    <v-col v-for="item in items" :key="item.label" cols="12" sm="6" :md="md">
      <v-card class="summary-card h-100">
        <v-card-text class="d-flex justify-space-between align-start ga-4">
          <div>
            <div class="text-medium-emphasis text-subtitle-2 mb-2">{{ item.label }}</div>
            <div class="text-h5 font-weight-bold mb-1">{{ item.value }}</div>
          </div>
          <div class="summary-icon-wrap">
            <v-icon :icon="item.icon" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  /** Largeur colonne sur breakpoint md (12/md = nombre de cartes par ligne). */
  md: {
    type: Number,
    default: 3,
  },
})
</script>

<style scoped>
.summary-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.3);
}

.summary-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.14);
}
</style>
