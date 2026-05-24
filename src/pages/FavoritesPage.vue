<template>
  <v-container class="py-6 py-md-8 favorites-page">
    <header class="favorites-page__header mb-6 mb-md-8">
      <div class="favorites-page__header-glow" aria-hidden="true" />
      <div class="favorites-page__header-inner">
        <div class="favorites-page__header-icon" aria-hidden="true">
          <v-icon icon="mdi-heart-multiple-outline" size="32" />
        </div>
        <div class="favorites-page__header-copy">
          <p class="favorites-page__kicker">Votre collection</p>
          <h1 class="favorites-page__title">Pays favoris</h1>
          <p class="favorites-page__subtitle">
            Les destinations que vous gardez près de vous — retrouvez-les en un clin d’œil
          </p>
        </div>
      </div>
    </header>

    <div class="favorites-stats mb-6 mb-md-8">
      <StatsSummaryCards :items="favoriteSummaryItems" :md="4" margin-bottom="mb-0" />
    </div>

    <v-card variant="flat" class="favorites-toolbar mb-6 mb-md-8" rounded="xl">
      <v-card-text class="favorites-toolbar__inner">
        <div class="favorites-toolbar__label">
          <v-icon icon="mdi-filter-variant" size="18" class="favorites-toolbar__label-icon" aria-hidden="true" />
          Parcourir vos favoris
        </div>
        <v-row class="favorites-toolbar__row" align="end">
          <v-col cols="12" md="5" lg="5">
            <v-text-field
              v-model="favoritesSearch"
              label="Rechercher dans les favoris"
              placeholder="France, Japon, Brésil…"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              density="comfortable"
              clearable
              hide-details
              class="favorites-field favorites-field--search"
            />
          </v-col>
          <v-col cols="12" md="4" lg="4">
            <v-select
              v-model="favoritesSort"
              :items="sortItems"
              label="Trier"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              class="favorites-field"
            />
          </v-col>
          <v-col cols="12" md="3" lg="3">
            <v-autocomplete
              v-model="countryToAdd"
              v-model:search="countryToAddSearch"
              :items="addableCountryItems"
              :loading="store.loading"
              item-title="title"
              item-value="value"
              label="Ajouter un pays"
              placeholder="Rechercher…"
              prepend-inner-icon="mdi-heart-plus-outline"
              variant="solo-filled"
              flat
              density="comfortable"
              clearable
              hide-details
              no-data-text="Tous les pays sont déjà en favoris"
              class="favorites-field favorites-field--add"
              @update:model-value="onAddFavorite"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      v-if="!store.favoriteCountries.length"
      class="favorites-empty favorites-empty--hero mb-6"
      rounded="xl"
      variant="flat"
    >
      <v-card-text class="favorites-empty__inner pa-8 pa-md-12 text-center">
        <div class="favorites-empty__icon-wrap" aria-hidden="true">
          <v-icon icon="mdi-heart-plus-outline" size="48" />
        </div>
        <h2 class="favorites-empty__title">Votre collection attend son premier pays</h2>
        <p class="favorites-empty__text">
          Ajoutez un pays ci-dessous ou explorez le monde pour constituer votre collection.
        </p>
        <v-autocomplete
          v-model="countryToAdd"
          v-model:search="countryToAddSearch"
          :items="addableCountryItems"
          :loading="store.loading"
          item-title="title"
          item-value="value"
          label="Ajouter un pays"
          placeholder="Rechercher un pays…"
          prepend-inner-icon="mdi-heart-plus-outline"
          variant="solo-filled"
          flat
          density="comfortable"
          clearable
          hide-details
          class="favorites-add-field mx-auto mb-6"
          @update:model-value="onAddFavorite"
        />
        <v-btn
          color="primary"
          size="x-large"
          rounded="xl"
          class="favorites-empty__cta text-none font-weight-bold"
          prepend-icon="mdi-earth"
          :to="{ name: 'countries' }"
        >
          Explorer les pays
        </v-btn>
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card
        v-if="visibleFavorites.length === 0"
        class="favorites-empty favorites-empty--search mb-6"
        rounded="xl"
        variant="flat"
      >
        <v-card-text class="favorites-empty__inner pa-7 pa-md-9 text-center">
          <div class="favorites-empty__icon-wrap favorites-empty__icon-wrap--muted" aria-hidden="true">
            <v-icon icon="mdi-magnify-close" size="40" />
          </div>
          <h2 class="favorites-empty__title favorites-empty__title--sm">Aucun résultat</h2>
          <p class="favorites-empty__text">Aucun favori ne correspond à votre recherche.</p>
          <v-btn variant="tonal" color="primary" rounded="xl" class="text-none font-weight-bold" @click="resetFavoritesControls">
            Réinitialiser la recherche
          </v-btn>
        </v-card-text>
      </v-card>

      <v-row v-if="visibleFavorites.length" class="favorites-grid" align="stretch">
        <v-col
          v-for="country in visibleFavorites"
          :key="country.cca3"
          cols="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
        >
          <CountryCard
            :country="country"
            :is-favorite="true"
            show-remove-favorite
            :can-delete="authStore.isAuthenticated && Boolean(country.isCustom)"
            @remove-favorite="store.removeFavorite"
            @delete-country="store.deleteCustomCountry"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import { useAuthStore } from '@/stores/auth'
import CountryCard from '@/components/CountryCard.vue'
import StatsSummaryCards from '@/components/StatsSummaryCards.vue'

const store = useCountriesStore()
const authStore = useAuthStore()

const favoritesSearch = ref('')
const favoritesSort = ref('name-asc')
const countryToAdd = ref(null)
const countryToAddSearch = ref('')

const regionLabels = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

const sortItems = [
  { title: 'Nom (A → Z)', value: 'name-asc' },
  { title: 'Nom (Z → A)', value: 'name-desc' },
  { title: 'Population ↑', value: 'population-asc' },
  { title: 'Population ↓', value: 'population-desc' },
  { title: 'Superficie ↑', value: 'area-asc' },
  { title: 'Superficie ↓', value: 'area-desc' },
  { title: 'Région (A → Z)', value: 'region-asc' },
]

const addableCountryItems = computed(() => {
  return store.countries
    .filter((country) => country?.cca3 && !store.isFavorite(country.cca3))
    .map((country) => ({
      title: `${country.name?.common || 'Sans nom'} (${country.cca3})`,
      value: country.cca3,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
})

function onAddFavorite(code) {
  if (!code) return
  store.addFavorite(code)
  countryToAdd.value = null
  countryToAddSearch.value = ''
}

const favoriteSummaryItems = computed(() => [
  {
    label: 'Pays favoris',
    value: store.favoritesCount.toLocaleString('fr-FR'),
    icon: 'mdi-heart',
  },
  {
    label: 'Régions représentées',
    value: store.favoriteRegionsCount.toLocaleString('fr-FR'),
    icon: 'mdi-map-outline',
  },
  {
    label: 'Population cumulée',
    value: store.favoriteTotalPopulation.toLocaleString('fr-FR'),
    icon: 'mdi-account-group-outline',
  },
])

const visibleFavorites = computed(() => {
  const query = favoritesSearch.value.trim().toLowerCase()

  let list = store.favoriteCountries
  if (query) {
    list = list.filter((country) => (country?.name?.common || '').toLowerCase().includes(query))
  }

  const sorted = [...list]
  sorted.sort((a, b) => {
    switch (favoritesSort.value) {
      case 'name-desc':
        return (b?.name?.common || '').localeCompare(a?.name?.common || '', 'fr', { sensitivity: 'base' })
      case 'population-asc':
        return (a?.population || 0) - (b?.population || 0)
      case 'population-desc':
        return (b?.population || 0) - (a?.population || 0)
      case 'area-asc':
        return (a?.area || 0) - (b?.area || 0)
      case 'area-desc':
        return (b?.area || 0) - (a?.area || 0)
      case 'region-asc': {
        const regionA = regionLabels[a?.region] || a?.region || ''
        const regionB = regionLabels[b?.region] || b?.region || ''
        const byRegion = regionA.localeCompare(regionB, 'fr', { sensitivity: 'base' })
        if (byRegion !== 0) return byRegion
        return (a?.name?.common || '').localeCompare(b?.name?.common || '', 'fr', { sensitivity: 'base' })
      }
      case 'name-asc':
      default:
        return (a?.name?.common || '').localeCompare(b?.name?.common || '', 'fr', { sensitivity: 'base' })
    }
  })

  return sorted
})

function resetFavoritesControls() {
  favoritesSearch.value = ''
  favoritesSort.value = 'name-asc'
}

onMounted(() => {
  if (!store.countries.length) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.favorites-page {
  max-width: min(100%, 1320px) !important;
}

/* --- Header --- */
.favorites-page__header {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: clamp(22px, 4vw, 36px) clamp(18px, 3vw, 32px);
  background: linear-gradient(145deg, rgba(48, 22, 32, 0.35), rgba(8, 16, 22, 0.94));
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.32);
}

.favorites-page__header-glow {
  position: absolute;
  inset: -35%;
  pointer-events: none;
  background: radial-gradient(circle at 20% 35%, rgba(255, 128, 160, 0.18), transparent 42%),
    radial-gradient(circle at 85% 25%, rgba(124, 243, 232, 0.16), transparent 40%);
  animation: favorites-header-glow 16s ease-in-out infinite alternate;
}

@keyframes favorites-header-glow {
  0% {
    transform: translate(-2%, 0) scale(1);
  }
  100% {
    transform: translate(3%, 2%) scale(1.06);
  }
}

.favorites-page__header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 18px 22px;
}

.favorites-page__header-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.14);
  border: 1px solid rgba(255, 180, 200, 0.2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.favorites-page__header-copy {
  flex: 1 1 240px;
  min-width: 0;
}

.favorites-page__kicker {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 200, 210, 0.85);
}

.favorites-page__title {
  margin: 0 0 10px;
  font-size: clamp(1.75rem, 1.2rem + 2vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: rgba(248, 255, 255, 0.98);
}

.favorites-page__subtitle {
  margin: 0;
  max-width: 38rem;
  font-size: 1.02rem;
  line-height: 1.6;
  color: rgba(200, 224, 224, 0.9);
  font-weight: 500;
}

/* --- Stats (réutilise StatsSummaryCards) --- */
.favorites-stats :deep(.summary-card) {
  border-radius: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.055), rgba(6, 16, 20, 0.88));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.26);
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.favorites-stats :deep(.summary-card:hover) {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.38);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(124, 243, 232, 0.1) inset;
}

.favorites-stats :deep(.summary-icon-wrap) {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  transition: transform 0.25s ease;
}

.favorites-stats :deep(.summary-card:hover .summary-icon-wrap) {
  transform: scale(1.05);
}

.favorites-stats :deep(.summary-label) {
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
}

.favorites-stats :deep(.summary-value) {
  font-size: 1.35rem !important;
  letter-spacing: 0.02em;
}

/* --- Toolbar recherche / tri --- */
.favorites-toolbar {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(8, 20, 26, 0.72);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  box-shadow:
    0 14px 44px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(124, 243, 232, 0.05) inset;
}

.favorites-toolbar__inner {
  padding: 18px 18px 20px !important;
}

@media (min-width: 960px) {
  .favorites-toolbar__inner {
    padding: 20px 22px 22px !important;
  }
}

.favorites-toolbar__label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(186, 222, 220, 0.88);
}

.favorites-toolbar__label-icon {
  color: rgb(var(--v-theme-primary));
}

.favorites-toolbar__row {
  margin: 0;
}

.favorites-field :deep(.v-field) {
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 12, 16, 0.55) !important;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.favorites-field :deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  box-shadow:
    0 0 0 1px rgba(124, 243, 232, 0.22),
    0 8px 28px rgba(0, 0, 0, 0.22);
}

.favorites-field--search :deep(.v-field) {
  min-height: 50px;
}

.favorites-add-field {
  max-width: 420px;
}

.favorites-add-field :deep(.v-field) {
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 12, 16, 0.55) !important;
}

/* --- Grille = Explorateur (même largeur de carte) --- */
.favorites-grid {
  margin-top: 8px;
  row-gap: 8px;
}

.favorites-grid :deep(> .v-col) {
  padding-top: 16px;
  padding-bottom: 16px;
}

@media (min-width: 960px) {
  .favorites-grid {
    row-gap: 12px;
  }

  .favorites-grid :deep(> .v-col) {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-inline: 14px;
  }
}

@media (min-width: 1280px) {
  .favorites-grid :deep(> .v-col) {
    padding-inline: 20px;
  }
}

/* --- États vides --- */
.favorites-empty {
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.favorites-empty--hero {
  background: linear-gradient(155deg, rgba(40, 24, 34, 0.45), rgba(6, 16, 20, 0.92));
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
}

.favorites-empty--search {
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(6, 16, 20, 0.88));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.26);
}

.favorites-empty__inner {
  position: relative;
  z-index: 1;
}

.favorites-empty__icon-wrap {
  width: 88px;
  height: 88px;
  margin: 0 auto 18px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(124, 243, 232, 0.22);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
}

.favorites-empty__icon-wrap--muted {
  width: 72px;
  height: 72px;
  color: rgba(200, 230, 228, 0.9);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.favorites-empty__title {
  margin: 0 0 12px;
  font-size: clamp(1.25rem, 1rem + 1vw, 1.6rem);
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
}

.favorites-empty__title--sm {
  font-size: 1.15rem;
}

.favorites-empty__text {
  margin: 0 auto 22px;
  max-width: 26rem;
  font-size: 1rem;
  line-height: 1.55;
  color: rgba(188, 218, 218, 0.9);
  font-weight: 500;
}

.favorites-empty__cta {
  box-shadow: 0 12px 32px rgba(var(--v-theme-primary), 0.28);
}
</style>
