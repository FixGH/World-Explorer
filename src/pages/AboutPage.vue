<template>
  <v-container class="py-6">
    <v-card variant="tonal" rounded="lg" class="mb-5 about-hero">
      <v-card-text class="py-5">
        <h1 class="text-h4 font-weight-bold">À propos de World Explorer</h1>
        <p class="text-medium-emphasis mt-2">
          Une application pédagogique modernisée pour explorer les pays de manière claire et interactive.
        </p>
      </v-card-text>
    </v-card>

    <v-card class="about-card" rounded="lg">
      <v-card-title>Architecture</v-card-title>
      <v-card-text>
        Cette application utilise Vue 3 (Composition API), Pinia, Vue Router et Vuetify avec une
        architecture orientée fonctionnalités, claire et évolutive.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.about-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, rgba(var(--v-theme-primary), 0.2), rgba(255, 255, 255, 0.03));
}

.about-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}
</style>
