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
        <RouterLink to="/" class="text-decoration-none d-flex align-center text-white">
          <v-icon icon="mdi-earth" class="mr-2" />
          World Explorer
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="text-center">
      <v-col>
        World Explorer {{ currentYear }} -
        <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" class="text-primary">
          restcountries.com
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { title: 'Pays', to: '/', icon: 'mdi-earth' },
  { title: 'Comparer', to: '/compare', icon: 'mdi-compare' },
  { title: 'Favoris', to: '/favorites', icon: 'mdi-heart' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]
</script>
