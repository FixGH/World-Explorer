import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CountriesPage from '@/pages/CountriesPage.vue'
import CountryDetailsPage from '@/pages/CountryDetailsPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ComparePage from '@/pages/ComparePage.vue'
import StatisticsPage from '@/pages/StatisticsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/countries',
      name: 'countries',
      component: CountriesPage,
    },
    {
      path: '/countries/:code',
      name: 'country-details',
      component: CountryDetailsPage,
      props: true,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage,
    },
    {
      path: '/compare',
      name: 'compare',
      component: ComparePage,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
  ],
})

export default router
