<template>
  <v-card
    class="country-card country-card--interactive h-100 d-flex flex-column flex-md-row"
    rounded="xl"
    role="link"
    :tabindex="0"
    :aria-label="`Ouvrir la fiche — ${country.name?.common || 'Pays'}`"
    @click="openCountryDetails"
    @keydown.enter.prevent="openCountryDetails"
    @keydown.space.prevent="openCountryDetails"
  >
    <div class="country-card__media">
      <div class="country-card__media-glow" aria-hidden="true" />
      <v-img
        :src="flagSrc"
        :alt="`Drapeau — ${country.name?.common || ''}`"
        cover
        class="country-card__img"
      >
        <template #error>
          <v-sheet class="country-card__fallback d-flex align-center justify-center">
            <v-icon icon="mdi-flag-outline" size="40" class="country-card__fallback-icon" />
          </v-sheet>
        </template>
      </v-img>
      <div class="country-card__media-scrim" aria-hidden="true" />
      <div class="country-card__fav">
        <v-btn
          :icon="favoriteIcon"
          :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          variant="flat"
          size="x-small"
          class="country-card__fav-btn"
          @click.stop="$emit('toggle-favorite', country.cca3)"
        />
      </div>
    </div>

    <div class="country-card__body">
      <div class="country-card__title-row">
        <h3 class="country-card__name">{{ country.name?.common }}</h3>
        <v-btn
          v-if="canDelete"
          icon="mdi-delete-outline"
          variant="text"
          size="x-small"
          color="error"
          density="compact"
          aria-label="Supprimer ce pays personnalisé"
          class="country-card__delete"
          @click.stop="$emit('delete-country', country.cca3)"
        />
      </div>

      <ul class="country-card__stats" aria-label="Informations principales">
        <li class="country-card__stat">
          <v-icon icon="mdi-city-variant-outline" size="16" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-label">Capitale</span>
          <span class="country-card__stat-value">{{ capitalLabel }}</span>
        </li>
        <li class="country-card__stat">
          <v-icon icon="mdi-earth" size="16" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-label">Région</span>
          <span class="country-card__stat-value">{{ regionLabel }}</span>
        </li>
        <li class="country-card__stat">
          <v-icon icon="mdi-account-group-outline" size="16" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-label">Population</span>
          <span class="country-card__stat-value">{{ formattedPopulation }}</span>
        </li>
      </ul>

      <div v-if="displayBadges.length" class="country-card__badges">
        <v-chip
          v-for="(b, i) in displayBadges"
          :key="i"
          size="x-small"
          :variant="b.outlined ? 'outlined' : 'tonal'"
          :color="b.color"
          class="country-card__chip text-none"
        >
          {{ b.label }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

const router = useRouter()

const props = defineProps({
  country: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  canDelete: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-favorite', 'delete-country'])

function openCountryDetails() {
  router.push({ name: 'country-details', params: { code: props.country.cca3 } })
}

const flagSrc = computed(() => getCountryFlagSrc(props.country))

const regionMap = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

const formattedPopulation = computed(() => {
  const value = props.country?.population
  if (!value && value !== 0) return '—'
  return Number(value).toLocaleString('fr-FR')
})

const capitalLabel = computed(() => {
  const c = props.country?.capital?.[0]
  return c && String(c).trim() ? String(c).trim() : '—'
})

const regionLabel = computed(() => {
  const region = props.country?.region
  return regionMap[region] || region || '—'
})

const quickInsights = computed(() => {
  const population = Number(props.country?.population || 0)
  const area = Number(props.country?.area || 0)
  const bordersCount = Number(props.country?.borders?.length || 0)
  const insights = []

  if (population >= 80_000_000) {
    insights.push({ label: 'Très peuplé', color: 'success' })
  } else if (population > 0 && population <= 2_000_000) {
    insights.push({ label: 'Peuplé modestement', color: 'info' })
  }

  if (area >= 1_000_000) {
    insights.push({ label: 'Grand territoire', color: 'secondary' })
  } else if (area > 0 && area <= 100_000) {
    insights.push({ label: 'Superficie réduite', color: 'secondary' })
  }

  if (bordersCount >= 6) {
    insights.push({ label: 'Nombreuses frontières', color: 'warning' })
  }

  return insights.slice(0, 2)
})

/** Pastilles optionnelles : Personnalisé + jusqu’à 2 faits ; pas de badge « statut » par défaut. */
const displayBadges = computed(() => {
  const out = []
  if (props.country?.isCustom) {
    out.push({ label: 'Personnalisé', color: 'primary', outlined: true })
  }
  const qi = quickInsights.value
  const maxExtra = props.country?.isCustom ? 1 : 2
  for (let i = 0; i < Math.min(maxExtra, qi.length); i += 1) {
    out.push({ label: qi[i].label, color: qi[i].color, outlined: false })
  }
  return out.slice(0, 2)
})

const favoriteIcon = computed(() => (props.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'))
</script>

<style scoped>
.country-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.06), rgba(8, 18, 22, 0.92));
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.26);
  align-items: stretch;
  transition:
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.32s ease,
    border-color 0.32s ease;
}

.country-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    125deg,
    rgba(124, 243, 232, 0.12),
    transparent 45%,
    rgba(54, 168, 255, 0.08)
  );
  transition: opacity 0.35s ease;
}

.country-card:hover::before {
  opacity: 1;
}

.country-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.38);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(124, 243, 232, 0.1),
    0 0 36px rgba(23, 215, 209, 0.1);
}

.country-card--interactive {
  cursor: pointer;
}

.country-card--interactive:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.7);
  outline-offset: 3px;
}

/* --- Média : bandeau haut sur mobile, colonne gauche sur tablette + --- */
.country-card__media {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  min-height: 108px;
}

@media (min-width: 960px) {
  .country-card__media {
    flex: 0 0 40%;
    max-width: 240px;
    min-height: 0;
    align-self: stretch;
    border-radius: 16px 0 0 16px;
  }
}

.country-card__media-glow {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 243, 232, 0.18), transparent 70%);
  opacity: 0.55;
  mix-blend-mode: screen;
}

.country-card__img {
  display: block;
  height: 108px;
}

@media (min-width: 960px) {
  .country-card__img {
    height: 100%;
    min-height: 156px;
  }
}

.country-card__img :deep(img) {
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.country-card:hover .country-card__img :deep(img) {
  transform: scale(1.04);
}

.country-card__fallback {
  min-height: 108px;
  height: 100%;
  background: linear-gradient(145deg, rgba(15, 28, 34, 0.96), rgba(25, 48, 56, 0.88));
}

@media (min-width: 960px) {
  .country-card__fallback {
    min-height: 156px;
  }
}

.country-card__fallback-icon {
  color: rgba(180, 230, 228, 0.45);
}

.country-card__media-scrim {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 16, 0.45) 100%);
}

.country-card__fav {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
}

.country-card__fav-btn {
  background: rgba(6, 14, 18, 0.58) !important;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.country-card__fav-btn:hover {
  transform: scale(1.05);
  background: rgba(var(--v-theme-primary), 0.26) !important;
}

.country-card__body {
  flex: 1 1 auto;
  min-width: 0;
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 960px) {
  .country-card__body {
    padding: 18px 20px 20px;
    justify-content: center;
    gap: 10px;
  }
}

.country-card__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px 10px;
}

.country-card__name {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  font-size: clamp(1.02rem, 0.95rem + 0.35vw, 1.2rem);
  font-weight: 800;
  letter-spacing: 0.01em;
  line-height: 1.28;
  color: rgba(248, 255, 255, 0.98);
  transition: color 0.25s ease;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.country-card:hover .country-card__name {
  color: rgb(var(--v-theme-primary));
}

.country-card__delete {
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.9;
}

.country-card__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.country-card__stat {
  display: grid;
  grid-template-columns: 18px minmax(0, 5.2rem) 1fr;
  align-items: baseline;
  column-gap: 8px;
  row-gap: 2px;
  min-width: 0;
}

@media (max-width: 959px) {
  .country-card__stat {
    grid-template-columns: 18px 1fr;
    grid-template-rows: auto auto;
  }

  .country-card__stat-icon {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: start;
    margin-top: 3px;
  }

  .country-card__stat-label {
    grid-column: 2;
    grid-row: 1;
  }

  .country-card__stat-value {
    grid-column: 2;
    grid-row: 2;
    text-align: left;
  }
}

.country-card__stat-icon {
  color: rgba(124, 243, 232, 0.65);
  margin-top: 2px;
}

.country-card__stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(150, 188, 188, 0.75);
}

.country-card__stat-value {
  font-size: 0.84rem;
  font-weight: 600;
  color: rgba(210, 236, 236, 0.9);
  min-width: 0;
  text-align: right;
}

.country-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  max-width: 100%;
}

.country-card__chip {
  max-width: 100%;
  font-weight: 600;
  font-size: 0.65rem !important;
  letter-spacing: 0.03em;
  height: 22px !important;
}
</style>
