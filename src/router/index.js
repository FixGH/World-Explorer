import { createRouter, createWebHistory } from 'vue-router'
import CountriesPage from '@/pages/CountriesPage.vue'
import CountryDetailsPage from '@/pages/CountryDetailsPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import AboutPage from '@/pages/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
  ],
})

export default router
