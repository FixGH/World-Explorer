<template>
  <v-container class="py-10">
    <v-card variant="tonal" rounded="lg" class="mx-auto" max-width="900">
      <v-card-text class="pa-8">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar color="secondary" size="56" class="elevation-2">
            <v-icon icon="mdi-alert-circle" size="32" />
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Page introuvable</h1>
            <div class="text-medium-emphasis">
              L’URL demandée n’existe pas ou n’est plus disponible.
            </div>
          </div>
        </div>

        <v-row class="mt-2" dense>
          <v-col cols="12" sm="6">
            <v-btn
              color="primary"
              rounded="lg"
              size="large"
              :to="{ name: 'home' }"
              prepend-icon="mdi-home"
            >
              Retour à l’accueil
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              color="secondary"
              rounded="lg"
              size="large"
              :to="{ name: 'countries' }"
              prepend-icon="mdi-earth"
            >
              Explorer les pays
            </v-btn>
          </v-col>
        </v-row>

        <div class="text-caption text-medium-emphasis mt-4">
          Conseil : utilisez le menu pour naviguer vers les sections disponibles.
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
// Page d’erreur statique.
</script>
