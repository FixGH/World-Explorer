<template>
  <v-container class="py-8 py-md-10 home-landing">
    <HomeHero class="mb-10 mb-md-12" />

    <LoadingState v-if="store.loading && !store.countries.length" />

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      retryable
      @retry="store.fetchCountries"
    />

    <template v-else>
      <HomeSpotlightStrip
        class="mb-10 mb-md-12"
        :countries="spotlightCountries"
        :can-random="store.countries.length > 0"
        @random-trip="goRandomCountry"
      />

      <HomeContinentExplorer class="mb-10 mb-md-12" />

      <HomeWorldCuriosities
        class="mb-10 mb-md-12"
        :largest="store.largestCountry"
        :smallest-pop="store.leastPopulatedCountry"
        :most-populated="store.mostPopulatedCountry"
        :most-borders="store.mostBorderedCountry"
      />

      <section class="home-quick mb-10 mb-md-12" aria-labelledby="home-quick-title">
        <div class="home-quick__head">
          <h2 id="home-quick-title" class="home-quick__title">
            <span aria-hidden="true">✈️</span>
            Poursuivre l’aventure
          </h2>
          <p class="home-quick__subtitle">Comparez, mesurez et gardez vos pépites sous la main.</p>
        </div>
        <v-row align="stretch">
          <v-col cols="12" md="4">
            <v-card class="home-tile" rounded="xl" :to="{ name: 'compare' }">
              <v-card-text class="pa-6">
                <v-icon icon="mdi-compare" size="32" class="home-tile__icon mb-3" />
                <div class="home-tile__label">Comparer deux pays</div>
                <p class="home-tile__hint">Deux drapeaux, un seul écran : qui vous surprendra ?</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="home-tile" rounded="xl" :to="{ name: 'statistics' }">
              <v-card-text class="pa-6">
                <v-icon icon="mdi-chart-bell-curve" size="32" class="home-tile__icon mb-3" />
                <div class="home-tile__label">Cartes &amp; chiffres du monde</div>
                <p class="home-tile__hint">Une vue d’ensemble vivante pour satisfaire votre soif de savoir.</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="home-tile" rounded="xl" :to="{ name: 'favorites' }">
              <v-card-text class="pa-6">
                <v-icon icon="mdi-heart-multiple" size="32" class="home-tile__icon mb-3" />
                <div class="home-tile__label">Vos coups de cœur</div>
                <p class="home-tile__hint">Retrouvez la liste qui compte vraiment pour vous.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <section class="home-dual mb-10 mb-md-12" aria-label="Récemment consultés et favoris">
        <v-row align="stretch">
          <v-col cols="12" lg="7">
            <RecentlyViewedCountries :items="store.recentlyViewedCountries" class="home-dual__card" />
          </v-col>
          <v-col cols="12" lg="5">
            <v-card class="home-fav h-100" rounded="xl">
              <v-card-text class="pa-6">
                <div class="home-fav__head">
                  <div>
                    <h3 class="home-fav__title">
                      <span aria-hidden="true">🔥</span>
                      Vos favoris
                    </h3>
                    <p class="home-fav__subtitle">Les pays que vous aimez revoir encore et encore.</p>
                  </div>
                  <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">
                    {{ store.favoritesCount }}
                  </v-chip>
                </div>
                <v-alert v-if="!favoritePreview.length" type="info" variant="tonal" rounded="lg" class="mt-2">
                  Ajoutez des cœurs depuis les fiches pays — votre carte du monde personnelle se remplira ici.
                </v-alert>
                <v-list v-else density="comfortable" class="py-1 bg-transparent">
                  <v-list-item
                    v-for="country in favoritePreview"
                    :key="country.cca3"
                    :to="{ name: 'country-details', params: { code: country.cca3 } }"
                    rounded="xl"
                    class="home-fav__item"
                  >
                    <template #prepend>
                      <v-avatar size="40" rounded="lg">
                        <v-img :src="getCountryFlagSrc(country)" :alt="country.name?.common" cover />
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-bold">{{ country.name?.common }}</v-list-item-title>
                    <v-list-item-subtitle>{{ country.region || 'Région' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <v-btn variant="text" color="primary" class="mt-2 font-weight-bold" :to="{ name: 'favorites' }">
                  Ouvrir tous les favoris
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <section class="home-fascination mb-10 mb-md-12" aria-labelledby="fasc-title">
        <v-card class="home-fascination__card" rounded="xl" :to="{ name: 'statistics' }">
          <v-card-text class="pa-6 pa-md-8 d-flex flex-column flex-md-row align-md-center ga-6">
            <div class="flex-grow-1">
              <h2 id="fasc-title" class="home-fascination__title">
                <span aria-hidden="true">🔥</span>
                Les pays les plus fascinants
              </h2>
              <p class="home-fascination__text mb-0">
                Classements, records et curiosités : laissez-vous guider par les chiffres qui racontent le monde.
              </p>
            </div>
            <v-btn color="primary" size="large" rounded="xl" variant="elevated" class="text-none font-weight-bold">
              Voir les classements
              <v-icon end icon="mdi-arrow-right" />
            </v-btn>
          </v-card-text>
        </v-card>
      </section>

      <HomeClosingCta />
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'
import HomeHero from '@/components/HomeHero.vue'
import HomeContinentExplorer from '@/components/HomeContinentExplorer.vue'
import HomeWorldCuriosities from '@/components/HomeWorldCuriosities.vue'
import HomeSpotlightStrip from '@/components/HomeSpotlightStrip.vue'
import HomeClosingCta from '@/components/HomeClosingCta.vue'
import RecentlyViewedCountries from '@/components/RecentlyViewedCountries.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const store = useCountriesStore()
const router = useRouter()

const favoritePreview = computed(() => store.favoriteCountries.slice(0, 5))

const spotlightCountries = computed(() => {
  const picks = [
    store.mostPopulatedCountry,
    store.largestCountry,
    store.mostBorderedCountry,
    store.leastPopulatedCountry,
  ].filter(Boolean)

  const seen = new Set()
  const out = []
  for (const c of picks) {
    const code = c?.cca3
    if (!code || seen.has(code)) continue
    seen.add(code)
    out.push(c)
    if (out.length >= 4) break
  }
  return out
})

function goRandomCountry() {
  const list = store.countries
  if (!list.length) return
  const pick = list[Math.floor(Math.random() * list.length)]
  if (pick?.cca3) {
    router.push({ name: 'country-details', params: { code: pick.cca3 } })
  }
}

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.home-landing {
  max-width: min(100%, 1320px) !important;
}

.home-quick__head {
  margin-bottom: 20px;
  max-width: 40rem;
}

.home-quick__title {
  margin: 0 0 8px;
  font-size: clamp(1.25rem, 1rem + 0.9vw, 1.65rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-quick__subtitle {
  margin: 0;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.55;
  font-weight: 500;
}

.home-tile {
  cursor: pointer;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(6, 16, 20, 0.65));
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.home-tile:hover {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.42);
  box-shadow: 0 22px 52px rgba(0, 0, 0, 0.36);
}

.home-tile__icon {
  color: rgb(var(--v-theme-primary));
}

.home-tile__label {
  font-size: 1.12rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
}

.home-tile__hint {
  margin: 8px 0 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(180, 210, 210, 0.88);
}

.home-dual__card :deep(.recent-card) {
  height: 100%;
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.045), rgba(6, 16, 20, 0.6));
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
}

.home-fav {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(6, 16, 20, 0.65));
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
}

.home-fav__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.home-fav__title {
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-fav__subtitle {
  margin: 0;
  font-size: 0.92rem;
  color: rgba(186, 218, 218, 0.88);
  line-height: 1.45;
}

.home-fav__item {
  border-radius: 14px !important;
  transition: background-color 0.22s ease, transform 0.22s ease;
}

.home-fav__item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: translateX(3px);
}

.home-fascination__card {
  cursor: pointer;
  border: 1px solid rgba(124, 243, 232, 0.22);
  background: linear-gradient(120deg, rgba(23, 215, 209, 0.12), rgba(8, 20, 26, 0.85));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.home-fascination__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.38);
}

.home-fascination__title {
  margin: 0 0 8px;
  font-size: clamp(1.2rem, 1rem + 0.8vw, 1.5rem);
  font-weight: 800;
  color: rgba(248, 255, 255, 0.98);
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-fascination__text {
  color: rgba(200, 228, 228, 0.9);
  line-height: 1.55;
  font-weight: 500;
}
</style>
