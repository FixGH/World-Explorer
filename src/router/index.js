import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/stores'
import { useAuthStore } from '@/stores/auth'
import { useCountriesStore } from '@/stores/countries'
import HomePage from '@/pages/HomePage.vue'
import CountriesPage from '@/pages/CountriesPage.vue'
import CountryDetailsPage from '@/pages/CountryDetailsPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ComparePage from '@/pages/ComparePage.vue'
import StatisticsPage from '@/pages/StatisticsPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import AddCountryPage from '@/pages/AddCountryPage.vue'

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
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/add-country',
      name: 'add-country',
      component: AddCountryPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)
  if (!to.meta.requiresAuth) return true
  if (authStore.isAuthenticated) return true

  const countriesStore = useCountriesStore(pinia)
  countriesStore.showActionReservedFeedback()

  return {
    name: 'login',
    query: {
      redirect: to.fullPath,
    },
  }
})

export default router
