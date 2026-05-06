<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary class="d-md-none nav-drawer">
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

    <v-app-bar class="app-header" flat>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-app-bar-title>
        <RouterLink :to="{ name: 'home' }" class="brand-link">
          <span class="brand-badge">
            <v-icon icon="mdi-earth" />
          </span>
          <span>World Explorer</span>
        </RouterLink>
      </v-app-bar-title>
      <v-spacer />
      <div class="d-none d-md-flex ga-2 mr-4 nav-desktop">
        <GlobalSearch class="mx-2 nav-search" />
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
        <v-btn
          variant="text"
          class="appbar-btn"
          :to="{ name: 'favorites' }"
          :class="{ 'appbar-btn--active': isNavActive('/favorites') }"
        >
          Favoris
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="app-main">
      <div class="app-content">
        <transition name="page" mode="out-in">
          <RouterView :key="route.fullPath" />
        </transition>
      </div>
    </v-main>

    <v-footer class="app-footer border-t-sm">
      <v-container class="py-4">
        <div class="footer-content text-medium-emphasis">
          <div class="footer-left">
            <div class="footer-brand">World Explorer {{ currentYear }}</div>
            <div class="footer-subtitle">Explorez, comparez et sauvegardez vos pays favoris.</div>
          </div>
          <div class="footer-right">
            <RouterLink :to="{ name: 'about' }" class="footer-link">À propos</RouterLink>
            <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" class="footer-link text-primary">
              Données : restcountries.com
            </a>
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import GlobalSearch from '@/components/GlobalSearch.vue'

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
  max-width: 1240px;
  margin: 0 auto;
  padding: 10px 20px 28px;
}

.nav-item {
  transition: background-color 0.24s ease, transform 0.24s ease;
}

.nav-item--active {
  background: rgba(var(--v-theme-primary), 0.16);
}

.nav-drawer {
  backdrop-filter: blur(16px);
}

.app-header {
  margin: 10px 18px 0;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.32),
    rgba(10, 29, 33, 0.72) 42%,
    rgba(12, 20, 26, 0.7)
  );
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.25);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #ecffff;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.brand-badge {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.appbar-btn {
  border-radius: 12px;
  text-transform: none;
  color: rgba(255, 255, 255, 0.86);
  transition: all 0.22s ease;
}

.appbar-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.appbar-btn--active {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.nav-search {
  min-width: 280px;
}

.app-main {
  padding-top: 16px;
}

.app-footer {
  margin-top: 10px;
  border-color: rgba(255, 255, 255, 0.12) !important;
  background: rgba(5, 14, 18, 0.6);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px 18px;
  flex-wrap: wrap;
}

.footer-brand {
  font-weight: 700;
  color: rgba(233, 255, 255, 0.92);
}

.footer-subtitle {
  font-size: 0.92rem;
}

.footer-right {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.footer-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 0.84;
}

@media (max-width: 959px) {
  .app-header {
    margin: 6px 10px 0;
    border-radius: 14px;
  }

  .app-content {
    padding: 6px 12px 20px;
  }
}
</style>
