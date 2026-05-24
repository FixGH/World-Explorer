<template>
  <v-container class="compare-page py-6">
    <v-card rounded="lg" elevation="0" class="compare-hero mb-6">
      <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-4 py-5 px-5 compare-hero-inner">
        <div class="compare-hero-text">
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="primary" variant="tonal" size="44" rounded="lg">
              <v-icon icon="mdi-compare-horizontal" size="26" />
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold compare-hero-title">Comparer des pays</h1>
              <p class="text-body-2 text-medium-emphasis mb-0 compare-hero-sub">
                Mettez deux pays face à face pour comparer population, superficie, densité et voisinage.
              </p>
            </div>
          </div>
        </div>
        <v-btn
          variant="tonal"
          color="secondary"
          rounded="lg"
          prepend-icon="mdi-backspace-outline"
          class="reset-btn flex-shrink-0"
          @click="store.resetCompare"
        >
          Réinitialiser
        </v-btn>
      </v-card-text>
    </v-card>

    <section class="compare-section mb-8">
      <div class="compare-section-label text-overline text-medium-emphasis mb-3 px-1">
        Sélection
      </div>
      <v-card rounded="lg" elevation="0" class="compare-select-card">
        <v-card-text class="pa-5 pt-6">
          <v-row align="stretch">
            <v-col cols="12" md="6">
              <div class="compare-picker-head compare-picker-head--left mb-3">
                <span class="compare-picker-badge compare-picker-badge--left">A</span>
                <span class="text-caption text-medium-emphasis">Premier pays</span>
              </div>
              <v-autocomplete
                :items="countryItems"
                :model-value="store.compareLeftCode"
                item-title="title"
                item-value="value"
                label="Rechercher un pays…"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details
                class="compare-autocomplete"
                @update:model-value="store.setCompareLeftCode"
              />
            </v-col>

            <v-col cols="12" md="6">
              <div class="compare-picker-head compare-picker-head--right mb-3">
                <span class="compare-picker-badge compare-picker-badge--right">B</span>
                <span class="text-caption text-medium-emphasis">Second pays</span>
              </div>
              <v-autocomplete
                :items="countryItems"
                :model-value="store.compareRightCode"
                item-title="title"
                item-value="value"
                label="Rechercher un pays…"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details
                class="compare-autocomplete"
                @update:model-value="store.setCompareRightCode"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>

    <v-alert v-if="store.loading" type="info" variant="tonal" rounded="lg" class="mb-6">
      Chargement de la liste des pays…
    </v-alert>

    <v-alert v-else-if="store.error" type="error" variant="tonal" rounded="lg" class="mb-6">
      {{ store.error }}
    </v-alert>

    <v-card
      v-else-if="!store.compareLeftCountry || !store.compareRightCountry"
      rounded="lg"
      elevation="0"
      class="compare-empty-card mb-4"
    >
      <v-card-text class="pa-8 pa-md-10">
        <div class="text-center compare-empty-inner">
          <v-icon icon="mdi-gesture-tap-hold" size="52" class="compare-empty-icon mb-4" />
          <h2 class="text-h6 font-weight-bold mb-2">
            Sélectionnez deux pays ci-dessus
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-8 text-medium-emphasis mx-auto compare-empty-lead">
            Choisissez un pays dans chaque liste pour afficher le tableau comparatif, les indicateurs clés
            et les écarts entre les deux territoires.
          </p>

          <v-row justify="center" class="compare-steps ga-6">
            <v-col cols="12" sm="4" class="text-center">
              <div class="compare-step-num compare-step-num--a mb-2">1</div>
              <div class="text-body-2 font-weight-medium">Pays A</div>
              <div class="text-caption text-medium-emphasis">Première liste déroulante</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <div class="compare-step-num compare-step-num--b mb-2">2</div>
              <div class="text-body-2 font-weight-medium">Pays B</div>
              <div class="text-caption text-medium-emphasis">Seconde liste déroulante</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <div class="compare-step-num compare-step-num--ok mb-2">
                <v-icon icon="mdi-check" size="20" />
              </div>
              <div class="text-body-2 font-weight-medium">Tableau</div>
              <div class="text-caption text-medium-emphasis">Écarts et badges automatiques</div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <template v-else>
      <section class="compare-section mb-6">
        <div class="compare-section-label text-overline text-medium-emphasis mb-3 px-1">
          Pays comparés
        </div>
        <v-row class="compare-country-row">
          <v-col cols="12" sm="6">
            <v-card class="country-head-card country-head-card--left h-100" rounded="lg" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between py-4 px-4 flex-wrap ga-3">
                <div class="d-flex align-center ga-3 min-width-0">
                  <v-avatar rounded="lg" size="48" class="country-head-flag flex-shrink-0">
                    <v-img
                      :src="leftFlagSrc"
                      :alt="store.compareLeftCountry.name?.common"
                      cover
                    >
                      <template #error>
                        <v-sheet class="fill-height d-flex align-center justify-center">
                          <v-icon icon="mdi-flag-outline" />
                        </v-sheet>
                      </template>
                    </v-img>
                  </v-avatar>
                  <div class="min-width-0">
                    <div class="text-caption text-medium-emphasis mb-0">Colonne A</div>
                    <div class="text-h6 font-weight-bold text-truncate">
                      {{ store.compareLeftCountry.name?.common }}
                    </div>
                  </div>
                </div>
                <v-btn
                  variant="flat"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                  rounded="lg"
                  size="small"
                  :to="{ name: 'country-details', params: { code: store.compareLeftCountry.cca3 } }"
                  class="details-link-btn flex-shrink-0"
                >
                  Fiche pays
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="country-head-card country-head-card--right h-100" rounded="lg" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between py-4 px-4 flex-wrap ga-3">
                <div class="d-flex align-center ga-3 min-width-0">
                  <v-avatar rounded="lg" size="48" class="country-head-flag flex-shrink-0">
                    <v-img
                      :src="rightFlagSrc"
                      :alt="store.compareRightCountry.name?.common"
                      cover
                    >
                      <template #error>
                        <v-sheet class="fill-height d-flex align-center justify-center">
                          <v-icon icon="mdi-flag-outline" />
                        </v-sheet>
                      </template>
                    </v-img>
                  </v-avatar>
                  <div class="min-width-0">
                    <div class="text-caption text-medium-emphasis mb-0">Colonne B</div>
                    <div class="text-h6 font-weight-bold text-truncate">
                      {{ store.compareRightCountry.name?.common }}
                    </div>
                  </div>
                </div>
                <v-btn
                  variant="flat"
                  color="secondary"
                  prepend-icon="mdi-open-in-new"
                  rounded="lg"
                  size="small"
                  :to="{ name: 'country-details', params: { code: store.compareRightCountry.cca3 } }"
                  class="details-link-btn flex-shrink-0"
                >
                  Fiche pays
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <CountryCompareTable :left="store.compareLeftCountry" :right="store.compareRightCountry" />
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useCountriesStore } from '@/stores/countries'
import CountryCompareTable from '@/components/CountryCompareTable.vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const store = useCountriesStore()

const leftFlagSrc = computed(() => getCountryFlagSrc(store.compareLeftCountry))
const rightFlagSrc = computed(() => getCountryFlagSrc(store.compareRightCountry))

const countryItems = computed(() => {
  return store.countries.map((c) => ({
    title: `${c.name?.common || 'Sans nom'} (${c.cca3})`,
    value: c.cca3,
  }))
})

onMounted(() => {
  if (!store.countries.length && !store.loading) {
    store.fetchCountries()
  }
})

watch(
  () => store.compareLeftCode,
  (code) => {
    if (!code) return
    store.ensureCompareCountryData(code)
  },
  { immediate: true },
)

watch(
  () => store.compareRightCode,
  (code) => {
    if (!code) return
    store.ensureCompareCountryData(code)
  },
  { immediate: true },
)
</script>

<style scoped>
.compare-page {
  max-width: 100%;
}

.compare-hero {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.18), rgba(255, 255, 255, 0.03));
}

.compare-hero-title {
  letter-spacing: 0.02em;
}

.compare-hero-sub {
  max-width: 520px;
}

.reset-btn {
  text-transform: none;
  font-weight: 600;
}

.compare-section-label {
  letter-spacing: 0.1em;
}

.compare-select-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.compare-picker-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compare-picker-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.compare-picker-badge--left {
  background: rgba(var(--v-theme-primary), 0.22);
  color: rgba(230, 255, 252, 0.95);
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
}

.compare-picker-badge--right {
  background: rgba(var(--v-theme-secondary), 0.2);
  color: rgba(230, 242, 255, 0.95);
  border: 1px solid rgba(var(--v-theme-secondary), 0.38);
}

.compare-empty-card {
  border: 1px dashed rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.02);
}

.compare-empty-icon {
  color: rgba(var(--v-theme-primary), 0.55);
  opacity: 0.95;
}

.compare-empty-lead {
  max-width: 460px;
}

.compare-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-inline: auto;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.1rem;
}

.compare-step-num--a {
  background: rgba(var(--v-theme-primary), 0.18);
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
  color: rgba(232, 255, 253, 0.95);
}

.compare-step-num--b {
  background: rgba(var(--v-theme-secondary), 0.16);
  border: 1px solid rgba(var(--v-theme-secondary), 0.35);
  color: rgba(232, 242, 255, 0.95);
}

.compare-step-num--ok {
  background: rgba(76, 175, 80, 0.14);
  border: 1px solid rgba(129, 199, 132, 0.35);
  color: rgba(200, 230, 201, 0.95);
}

.country-head-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.country-head-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.22);
}

.country-head-card--left {
  border-left: 4px solid rgba(var(--v-theme-primary), 0.65);
}

.country-head-card--right {
  border-left: 4px solid rgba(var(--v-theme-secondary), 0.65);
}

.country-head-flag {
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.details-link-btn {
  text-transform: none;
  font-weight: 600;
}

.min-width-0 {
  min-width: 0;
}

@media (max-width: 959px) {
  .compare-hero-inner {
    flex-direction: column;
    align-items: stretch !important;
  }

  .reset-btn {
    align-self: flex-start;
  }
}
</style>
