<template>
  <v-card rounded="lg" class="feature-card">
    <v-card-title>Fonctionnalités principales</v-card-title>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="feature in features"
        :key="feature.title"
        :prepend-icon="feature.icon"
        :title="feature.title"
        :subtitle="feature.description"
        rounded="lg"
        class="feature-item"
      />
    </v-list>
  </v-card>
</template>

<script setup>
const features = [
  {
    icon: 'mdi-earth',
    title: 'Explorer les pays',
    description: 'Recherchez, filtrez et triez les pays avec une interface claire.',
  },
  {
    icon: 'mdi-compare',
    title: 'Comparer deux pays',
    description: 'Affichez les données côte à côte pour une lecture rapide.',
  },
  {
    icon: 'mdi-heart',
    title: 'Ajouter aux favoris',
    description: 'Constituez une sélection personnelle pour y revenir facilement.',
  },
  {
    icon: 'mdi-map-marker',
    title: 'Consulter les détails et la localisation',
    description: 'Accédez aux informations détaillées et aux cartes externes.',
  },
]
</script>

<style scoped>
.feature-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.feature-item {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.feature-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(2px);
}
</style>
