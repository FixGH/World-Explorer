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
          rounded="lg"
          class="nav-item"
          :class="{ 'nav-item--active': isNavActive(item.to) }"
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
        <v-btn
          variant="text"
          class="appbar-btn"
          :to="{ name: 'countries' }"
          :class="{ 'appbar-btn--active': isNavActive('/countries') }"
        >
          Explorer
        </v-btn>
        <v-btn
          variant="text"
          class="appbar-btn"
          :to="{ name: 'compare' }"
          :class="{ 'appbar-btn--active': isNavActive('/compare') }"
        >
          Comparer
        </v-btn>
        <v-btn
          variant="text"
          class="appbar-btn"
          :to="{ name: 'statistics' }"
          :class="{ 'appbar-btn--active': isNavActive('/statistics') }"
        >
          Statistiques
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <div class="app-content">
        <RouterView />
      </div>
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
import { useRoute } from 'vue-router'

const route = useRoute()
const drawer = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { title: 'Accueil', to: '/', icon: 'mdi-home' },
  { title: 'Pays', to: '/countries', icon: 'mdi-earth' },
  { title: 'Comparer', to: '/compare', icon: 'mdi-compare' },
  { title: 'Statistiques', to: '/statistics', icon: 'mdi-chart-bar' },
  { title: 'Favoris', to: '/favorites', icon: 'mdi-heart' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]

function isNavActive(to) {
  if (to === '/') return route.path === '/'
  if (to === '/countries') return route.path === '/countries' || route.path.startsWith('/countries/')
  return route.path === to
}
</script>

<style scoped>
.app-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-item {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.nav-item--active {
  background: rgba(var(--v-theme-primary), 0.12);
}

.appbar-btn {
  border-radius: 12px;
  text-transform: none;
}

.appbar-btn--active {
  background: rgba(255, 255, 255, 0.12);
}
</style>
