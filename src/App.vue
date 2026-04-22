<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <RouterLink :to="{ name: 'home' }" class="text-decoration-none d-flex align-center text-white">
          <v-icon icon="mdi-earth" class="mr-2" />
          World Explorer
        </RouterLink>
      </v-app-bar-title>
      <div class="d-none d-md-flex ga-2 mr-4">
        <v-btn variant="text" :to="{ name: 'countries' }">Explorer</v-btn>
        <v-btn variant="text" :to="{ name: 'compare' }">Comparer</v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="border-t-sm">
      <v-container class="py-3">
        <div class="d-flex flex-wrap align-center justify-space-between ga-2 text-medium-emphasis">
          <span>World Explorer {{ currentYear }} - Explorez, comparez et sauvegardez vos pays favoris.</span>
          <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" class="text-primary">
            Donnees: restcountries.com
          </a>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { title: 'Accueil', to: '/', icon: 'mdi-home' },
  { title: 'Pays', to: '/countries', icon: 'mdi-earth' },
  { title: 'Comparer', to: '/compare', icon: 'mdi-compare' },
  { title: 'Favoris', to: '/favorites', icon: 'mdi-heart' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]
</script>
