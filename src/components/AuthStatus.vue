<template>
  <div class="auth-status d-flex align-center ga-2">
    <v-btn
      v-if="!authStore.isAuthenticated"
      variant="text"
      class="appbar-btn"
      :to="{ name: 'login', query: { redirect: route.fullPath } }"
    >
      Connexion
    </v-btn>

    <template v-else>
      <v-chip size="small" variant="tonal" color="primary">
        {{ authStore.user?.username || 'Utilisateur' }}
      </v-chip>
      <v-btn variant="text" class="appbar-btn" @click="authStore.logout">
        Déconnexion
      </v-btn>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
</script>
