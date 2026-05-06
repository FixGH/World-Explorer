<template>
  <v-row class="loading-grid">
    <v-col v-for="n in itemCount" :key="n" cols="12" sm="6" md="4" lg="3">
      <v-skeleton-loader class="loading-skeleton" type="image, heading, text" />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  itemCount: {
    type: Number,
    default: 8,
  },
})
</script>

<style scoped>
.loading-grid {
  animation: fadeInUp 0.24s ease;
}

.loading-skeleton {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
