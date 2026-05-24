<template>
  <v-container class="py-6 login-page">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card rounded="lg" class="login-card">
          <v-card-title class="text-h5 font-weight-bold">Connexion</v-card-title>
          <v-card-subtitle>
            Entrez les identifiants de démonstration pour accéder aux actions d'écriture locales.
          </v-card-subtitle>
          <v-card-text class="pt-4">
            <v-form @submit.prevent="onSubmit">
              <v-text-field v-model="username" label="Nom d'utilisateur" variant="outlined" rounded="lg" />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                type="password"
                variant="outlined"
                rounded="lg"
              />

              <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg" class="mb-3">
                {{ errorMessage }}
              </v-alert>

              <v-btn type="submit" color="primary" block rounded="lg">
                Se connecter
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="px-4 pb-4 text-medium-emphasis">
            Démo : <code>admin</code> / <code>admin</code>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

function onSubmit() {
  errorMessage.value = ''

  const result = authStore.login(String(username.value || '').trim(), String(password.value || '').trim())
  if (!result.success) {
    errorMessage.value = result.error || 'Connexion impossible.'
    return
  }

  const redirectTarget = getSafeRedirect(route.query.redirect)

  router.push(redirectTarget)
}

function getSafeRedirect(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/countries'
  }
  return value
}
</script>

<style scoped>
.login-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
}
</style>
