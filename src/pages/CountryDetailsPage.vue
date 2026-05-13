<template>
  <v-container class="details-page py-4 py-md-6">
    <v-btn
      variant="text"
      size="small"
      :to="{ name: 'countries' }"
      class="back-btn mb-5 text-medium-emphasis"
      rounded="lg"
    >
      <v-icon icon="mdi-arrow-left" size="18" class="mr-1" />
      Retour à l’explorateur
    </v-btn>

    <LoadingState v-if="store.selectedCountryLoading" :item-count="1" />

    <ErrorState
      v-else-if="store.selectedCountryError"
      :message="store.selectedCountryError"
      retryable
      @retry="loadCountry"
    />

    <template v-else-if="country">
      <v-row class="details-layout" align="start">
        <!-- Colonne visuelle : drapeau + liens cartes -->
        <v-col cols="12" lg="4">
          <v-card class="details-hero-card mb-4" rounded="lg" elevation="0">
            <div class="details-flag-frame">
              <v-img
                :src="flagSrc"
                :alt="`Visuel — ${country.name?.common || 'pays'}`"
                height="280"
                cover
                class="details-flag-img"
              >
                <template #error>
                  <v-sheet height="280" class="details-flag-fallback d-flex align-center justify-center">
                    <v-icon icon="mdi-flag-outline" size="72" class="details-flag-fallback-icon" />
                  </v-sheet>
                </template>
              </v-img>
              <div class="details-flag-scrim" aria-hidden="true" />
              <div class="details-flag-overlay">
                <v-chip
                  v-if="country.isCustom"
                  size="small"
                  variant="flat"
                  class="details-custom-badge mb-2"
                >
                  Personnalisé
                </v-chip>
                <h2 class="details-flag-title text-h5 font-weight-bold">
                  {{ country.name?.common || fallback }}
                </h2>
                <p v-if="officialHeroLine" class="details-flag-official text-body-2 mb-0">
                  {{ officialHeroLine }}
                </p>
              </div>
            </div>

            <v-card-text class="details-hero-chips pt-4 pb-4">
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  size="small"
                  variant="tonal"
                  color="primary"
                  prepend-icon="mdi-earth"
                  class="hero-chip"
                >
                  {{ continentsLabel }}
                </v-chip>
                <v-chip
                  size="small"
                  variant="tonal"
                  color="secondary"
                  prepend-icon="mdi-flag-variant"
                  class="hero-chip"
                >
                  {{ independentChipLabel }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <v-card rounded="lg" class="details-map-links-card" elevation="0">
            <v-card-title class="detail-card-heading pb-1">
              <v-icon icon="mdi-map-search-outline" size="22" class="mr-2 text-medium-emphasis" />
              Cartes externes
            </v-card-title>
            <v-card-subtitle class="text-caption px-4 pb-3 text-medium-emphasis">
              Ouvrir le pays dans un service de cartographie.
            </v-card-subtitle>
            <v-card-text class="pt-0 d-flex flex-column flex-sm-row ga-2">
              <v-btn
                :href="country.maps?.googleMaps"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="flat"
                prepend-icon="mdi-google-maps"
                :disabled="!country.maps?.googleMaps"
                class="map-link-btn flex-grow-1"
                rounded="lg"
              >
                Google Maps
              </v-btn>
              <v-btn
                :href="country.maps?.openStreetMaps"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="tonal"
                prepend-icon="mdi-map"
                :disabled="!country.maps?.openStreetMaps"
                class="map-link-btn flex-grow-1"
                rounded="lg"
              >
                OpenStreetMap
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Colonne contenu -->
        <v-col cols="12" lg="8">
          <div class="details-toolbar mb-5">
            <div class="details-toolbar-text">
              <span class="text-overline text-medium-emphasis d-block letter-spacing-sm">Fiche pays</span>
              <span class="text-body-2 text-medium-emphasis">Vue synthétique des données disponibles.</span>
            </div>
            <v-btn
              :prepend-icon="store.isFavorite(country.cca3) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="store.isFavorite(country.cca3) ? 'primary' : 'default'"
              variant="flat"
              rounded="lg"
              class="favorite-toggle-btn"
              @click="store.toggleFavorite(country.cca3)"
            >
              {{ store.isFavorite(country.cca3) ? 'Favori' : 'Ajouter aux favoris' }}
            </v-btn>
          </div>

          <v-row class="details-grid">
            <v-col cols="12" md="6">
              <v-card class="h-100 details-block" rounded="lg" elevation="0">
                <v-card-title class="detail-section-title">
                  <v-icon icon="mdi-badge-account-horizontal-outline" size="22" class="detail-section-icon" />
                  Identité
                </v-card-title>
                <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
                  Noms et codes utilisés pour identifier le pays.
                </v-card-subtitle>
                <v-divider class="my-3 mx-4 opacity-25" />
                <v-list class="detail-list py-0 px-2" density="comfortable">
                  <v-list-item prepend-icon="mdi-card-account-details-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Nom courant</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.name?.common || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-card-text-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Nom officiel</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.name?.official || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-alpha-a-circle-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Code ISO (2 lettres)</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.cca2 || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-alpha-a-box-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Code ISO (3 lettres)</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.cca3 || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 details-block" rounded="lg" elevation="0">
                <v-card-title class="detail-section-title">
                  <v-icon icon="mdi-earth" size="22" class="detail-section-icon" />
                  Géographie
                </v-card-title>
                <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
                  Localisation et grandes régions.
                </v-card-subtitle>
                <v-divider class="my-3 mx-4 opacity-25" />
                <v-list class="detail-list py-0 px-2" density="comfortable">
                  <v-list-item prepend-icon="mdi-city-variant-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Capitale</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.capital?.[0] || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-map-marker-radius-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Région</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ regionLabel }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-sign-direction" class="detail-list-item">
                    <v-list-item-title class="detail-label">Sous-région</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ country.subregion || fallback }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-earth-box" class="detail-list-item">
                    <v-list-item-title class="detail-label">Continents</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ continentsLabel }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 details-block" rounded="lg" elevation="0">
                <v-card-title class="detail-section-title">
                  <v-icon icon="mdi-chart-box-outline" size="22" class="detail-section-icon" />
                  Statistiques
                </v-card-title>
                <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
                  Chiffres clés et voisinage.
                </v-card-subtitle>
                <v-divider class="my-3 mx-4 opacity-25" />
                <v-list class="detail-list py-0 px-2" density="comfortable">
                  <v-list-item prepend-icon="mdi-account-group-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Population</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ formattedPopulation }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-ruler-square-compass" class="detail-list-item">
                    <v-list-item-title class="detail-label">Superficie</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ formattedArea }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-scale-balance" class="detail-list-item">
                    <v-list-item-title class="detail-label">Statut politique</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ independentLabel }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-transit-connection-variant" class="detail-list-item">
                    <v-list-item-title class="detail-label">Frontières terrestres</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ borderCountLabel }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 details-block" rounded="lg" elevation="0">
                <v-card-title class="detail-section-title">
                  <v-icon icon="mdi-translate" size="22" class="detail-section-icon" />
                  Culture &amp; temps
                </v-card-title>
                <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
                  Langues, monnaies et fuseaux horaires.
                </v-card-subtitle>
                <v-divider class="my-3 mx-4 opacity-25" />
                <v-list class="detail-list py-0 px-2" density="comfortable">
                  <v-list-item prepend-icon="mdi-translate-variant" class="detail-list-item">
                    <v-list-item-title class="detail-label">Langues</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ languagesLabel }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-cash-multiple" class="detail-list-item">
                    <v-list-item-title class="detail-label">Monnaies</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ currenciesLabel }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-clock-outline" class="detail-list-item">
                    <v-list-item-title class="detail-label">Fuseaux horaires</v-list-item-title>
                    <v-list-item-subtitle class="detail-value">{{ timezonesLabel }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="mt-4 details-block details-borders-card" rounded="lg" elevation="0">
            <v-card-title class="detail-section-title">
              <v-icon icon="mdi-road-variant" size="22" class="detail-section-icon" />
              Pays frontaliers
            </v-card-title>
            <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
              Cliquez sur un pays pour ouvrir sa fiche.
            </v-card-subtitle>
            <v-card-text class="pt-4">
              <div v-if="!borders.length" class="borders-empty">
                <v-icon icon="mdi-map-marker-off-outline" size="40" class="borders-empty-icon mb-2" />
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Aucune frontière terrestre listée pour ce pays (île, micro-État ou données incomplètes).
                </p>
              </div>
              <div v-else class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="borderCode in borders"
                  :key="borderCode"
                  color="primary"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-chevron-right"
                  class="border-chip"
                  :to="{ name: 'country-details', params: { code: borderCode } }"
                >
                  {{ borderCountryLabel(borderCode) }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mt-4 details-block details-map-panel" rounded="lg" elevation="0">
            <v-card-title class="detail-section-title">
              <v-icon icon="mdi-crosshairs-gps" size="22" class="detail-section-icon" />
              Localisation
            </v-card-title>
            <v-card-subtitle class="detail-section-subtitle px-4 pb-0">
              Carte interactive (OpenStreetMap) centrée sur le pays — marqueur déplaçable à l’ouverture du popup.
            </v-card-subtitle>
            <v-card-text class="pt-4">
              <div v-if="hasCoordinates" class="map-embed-shell">
                <CountryMap
                  :latlng="coordinates"
                  :country-name="country.name?.common || 'Pays'"
                />
              </div>
              <v-alert v-else type="info" variant="tonal" rounded="lg" class="mb-0">
                Coordonnées géographiques non disponibles pour afficher la carte.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-alert v-else type="info" variant="tonal">
      Aucun pays à afficher.
    </v-alert>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import CountryMap from '@/components/CountryMap.vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const route = useRoute()
const store = useCountriesStore()
const fallback = 'Non disponible'

const countryCode = computed(() => String(route.params.code || ''))
const country = computed(() => store.selectedCountry)
const flagSrc = computed(() => getCountryFlagSrc(country.value))

const regionMap = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

const officialHeroLine = computed(() => {
  const official = country.value?.name?.official?.trim()
  const common = country.value?.name?.common?.trim()
  if (!official) return ''
  if (common && official === common) return ''
  return official
})

const formattedPopulation = computed(() => {
  const value = country.value?.population
  return Number.isFinite(value) ? `${value.toLocaleString('fr-FR')} habitants` : fallback
})
const formattedArea = computed(() => {
  const value = country.value?.area
  return Number.isFinite(value) ? `${value.toLocaleString('fr-FR')} km²` : fallback
})
const continentsLabel = computed(() => country.value?.continents?.join(', ') || fallback)
const regionLabel = computed(() => {
  const region = country.value?.region
  return regionMap[region] || region || fallback
})
const languagesLabel = computed(() => {
  const languages = country.value?.languages
  return languages ? Object.values(languages).join(', ') : fallback
})
const currenciesLabel = computed(() => {
  const currencies = country.value?.currencies
  if (!currencies) return fallback
  return Object.values(currencies)
    .map((currency) => {
      const name = currency?.name || ''
      const symbol = currency?.symbol ? ` (${currency.symbol})` : ''
      return `${name}${symbol}`.trim() || fallback
    })
    .join(', ')
})
const timezonesLabel = computed(() => country.value?.timezones?.join(', ') || fallback)
const independentLabel = computed(() => {
  if (country.value?.independent === true) return 'État indépendant'
  if (country.value?.independent === false) return 'Territoire dépendant'
  return 'Statut non précisé'
})
const borders = computed(() => country.value?.borders || [])
const independentChipLabel = computed(() => {
  if (country.value?.independent === true) return 'État indépendant'
  if (country.value?.independent === false) return 'Territoire dépendant'
  return 'Statut non précisé'
})
const borderCountLabel = computed(() => {
  if (!borders.value.length) return 'Aucune frontière terrestre'
  return `${borders.value.length.toLocaleString('fr-FR')} voisin(s)`
})
const coordinates = computed(() => country.value?.latlng || [])
const hasCoordinates = computed(() => {
  return Array.isArray(coordinates.value)
    && coordinates.value.length >= 2
    && Number.isFinite(coordinates.value[0])
    && Number.isFinite(coordinates.value[1])
})

function loadCountry() {
  if (countryCode.value) {
    store.fetchCountryByCode(countryCode.value)
  }
}

function borderCountryLabel(code) {
  return store.getCountryNameByCode(code)
}

onMounted(loadCountry)
watch(countryCode, loadCountry)
watch(country, (newCountry) => {
  if (newCountry?.cca3) {
    store.markRecentlyViewed(newCountry)
  }
})

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})
</script>

<style scoped>
.details-page {
  max-width: 100%;
}

.letter-spacing-sm {
  letter-spacing: 0.08em;
}

.back-btn {
  text-transform: none;
  font-weight: 600;
  opacity: 0.92;
}

.back-btn:hover {
  opacity: 1;
}

.details-hero-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
}

.details-flag-frame {
  position: relative;
  overflow: hidden;
}

.details-flag-img :deep(img) {
  object-fit: cover;
  object-position: center;
}

.details-flag-fallback {
  background: linear-gradient(155deg, rgba(12, 26, 32, 0.96), rgba(22, 44, 52, 0.9));
}

.details-flag-fallback-icon {
  color: rgba(160, 210, 208, 0.45);
}

.details-flag-scrim {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(6, 12, 16, 0) 35%,
    rgba(6, 12, 16, 0.82) 100%
  );
}

.details-flag-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 18px 18px;
}

.details-custom-badge {
  font-weight: 600;
  letter-spacing: 0.02em;
  background: rgba(0, 0, 0, 0.35) !important;
  color: rgba(230, 255, 253, 0.95) !important;
}

.details-flag-title {
  color: rgba(248, 255, 255, 0.98);
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
  line-height: 1.25;
}

.details-flag-official {
  color: rgba(220, 238, 238, 0.88);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.details-hero-chips {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.hero-chip {
  font-weight: 600;
}

.details-map-links-card {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.02);
}

.detail-card-heading {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding-top: 18px !important;
}

.map-link-btn {
  text-transform: none;
  font-weight: 600;
  min-height: 44px;
}

.details-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12), rgba(255, 255, 255, 0.03));
}

.details-toolbar-text {
  min-width: 0;
}

.favorite-toggle-btn {
  text-transform: none;
  font-weight: 600;
  flex-shrink: 0;
}

.details-block {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.details-block:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.22);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.26);
}

.detail-section-title {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding-top: 18px !important;
  padding-bottom: 4px !important;
}

.detail-section-icon {
  margin-right: 10px;
  color: rgba(var(--v-theme-primary), 0.95);
  opacity: 0.95;
}

.detail-section-subtitle {
  line-height: 1.45;
  font-size: 0.8125rem !important;
}

.detail-list :deep(.v-list-item__prepend) {
  width: 44px;
}

.detail-list-item {
  min-height: 56px !important;
}

.detail-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(186, 218, 218, 0.72) !important;
  opacity: 1 !important;
}

.detail-value {
  font-size: 0.94rem !important;
  font-weight: 600;
  color: rgba(236, 252, 252, 0.96) !important;
  line-height: 1.4 !important;
  margin-top: 4px !important;
}

.details-borders-card .detail-section-subtitle {
  padding-bottom: 0 !important;
}

.borders-empty {
  text-align: center;
  padding: 20px 12px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
}

.borders-empty-icon {
  opacity: 0.45;
  color: rgba(180, 220, 220, 0.8);
}

.border-chip {
  font-weight: 600;
  border: 1px solid rgba(var(--v-theme-primary), 0.22) !important;
}

.details-map-panel {
  overflow: hidden;
}

.map-embed-shell {
  width: 100%;
  max-width: 100%;
  border-radius: 14px;
  overflow: hidden;
}

@media (max-width: 959px) {
  .details-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .favorite-toggle-btn {
    width: 100%;
  }
}
</style>
