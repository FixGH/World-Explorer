<template>
  <v-card class="mb-6" color="primary" variant="tonal">
    <v-card-text class="py-10">
      <div class="text-overline mb-2">World Explorer</div>
      <h1 class="text-h3 font-weight-bold mb-3">Explorez le monde simplement</h1>
      <p class="text-body-1 mb-6">
        Une application moderne pour decouvrir les pays, comparer leurs donnees et garder vos favoris.
      </p>
      <div class="d-flex flex-wrap ga-3">
        <v-btn color="primary" size="large" :to="{ name: 'countries' }" prepend-icon="mdi-earth">
          Explorer les pays
        </v-btn>
        <v-btn variant="outlined" size="large" :to="{ name: 'compare' }" prepend-icon="mdi-compare">
          Comparer des pays
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
