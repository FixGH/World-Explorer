<template>
  <v-card
    class="country-card country-card--interactive h-100 d-flex flex-column"
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
        height="120"
        cover
        class="country-card__img"
      >
        <template #error>
          <v-sheet height="120" class="country-card__fallback d-flex align-center justify-center">
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
          size="small"
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
          size="small"
          color="error"
          density="comfortable"
          aria-label="Supprimer ce pays personnalisé"
          class="country-card__delete"
          @click.stop="$emit('delete-country', country.cca3)"
        />
      </div>

      <ul class="country-card__stats" aria-label="Informations principales">
        <li class="country-card__stat">
          <v-icon icon="mdi-city-variant-outline" size="18" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-text">{{ capitalLabel }}</span>
        </li>
        <li class="country-card__stat">
          <v-icon icon="mdi-earth" size="18" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-text">{{ regionLabel }}</span>
        </li>
        <li class="country-card__stat">
          <v-icon icon="mdi-account-group-outline" size="18" class="country-card__stat-icon" aria-hidden="true" />
          <span class="country-card__stat-text">{{ formattedPopulation }}</span>
        </li>
      </ul>

      <div v-if="displayBadges.length" class="country-card__badges">
        <v-chip
          v-for="(b, i) in displayBadges"
          :key="i"
          size="small"
          :variant="b.outlined ? 'outlined' : 'tonal'"
          :color="b.color"
          class="country-card__chip text-none font-weight-semibold"
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
    insights.push({ label: 'Pays compact', color: 'info' })
  }

  if (area >= 1_000_000) {
    insights.push({ label: 'Grand territoire', color: 'secondary' })
  } else if (area > 0 && area <= 100_000) {
    insights.push({ label: 'Île / territoire modeste', color: 'secondary' })
  }

  if (bordersCount >= 6) {
    insights.push({ label: 'Nombreuses frontières', color: 'warning' })
  }

  return insights.slice(0, 2)
})

/** Au plus 2 pastilles : Personnalisé + 1 accent, ou jusqu’à 2 accents. */
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
  if (!props.country?.isCustom && out.length === 0) {
    if (props.country?.independent === false) {
      out.push({ label: 'Territoire lié', color: 'info', outlined: false })
    } else if (props.country?.independent === true) {
      out.push({ label: 'État souverain', color: 'success', outlined: false })
    }
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
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
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
    rgba(124, 243, 232, 0.15),
    transparent 40%,
    rgba(54, 168, 255, 0.1)
  );
  transition: opacity 0.35s ease;
}

.country-card:hover::before {
  opacity: 1;
}

.country-card:hover {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow:
    0 22px 56px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(124, 243, 232, 0.12),
    0 0 48px rgba(23, 215, 209, 0.12);
}

.country-card--interactive {
  cursor: pointer;
}

.country-card--interactive:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.7);
  outline-offset: 3px;
}

.country-card__media {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.country-card__media-glow {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 243, 232, 0.2), transparent 70%);
  opacity: 0.65;
  mix-blend-mode: screen;
}

.country-card__img {
  display: block;
}

.country-card__img :deep(img) {
  object-fit: cover;
  object-position: center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.country-card:hover .country-card__img :deep(img) {
  transform: scale(1.07);
}

.country-card__fallback {
  background: linear-gradient(145deg, rgba(15, 28, 34, 0.96), rgba(25, 48, 56, 0.88));
}

.country-card__fallback-icon {
  color: rgba(180, 230, 228, 0.45);
}

.country-card__media-scrim {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, transparent 35%, rgba(6, 12, 16, 0.55) 100%);
}

.country-card__fav {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
}

.country-card__fav-btn {
  background: rgba(6, 14, 18, 0.55) !important;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.country-card__fav-btn:hover {
  transform: scale(1.06);
  background: rgba(var(--v-theme-primary), 0.28) !important;
}

.country-card__body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.country-card__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.country-card__name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  line-height: 1.25;
  color: rgba(248, 255, 255, 0.98);
  transition: color 0.25s ease;
}

.country-card:hover .country-card__name {
  color: rgb(var(--v-theme-primary));
}

.country-card__delete {
  flex-shrink: 0;
  opacity: 0.85;
}

.country-card__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.country-card__stat {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.country-card__stat-icon {
  flex-shrink: 0;
  color: rgba(124, 243, 232, 0.75);
}

.country-card__stat-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(210, 236, 236, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.country-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 2px;
}

.country-card__chip {
  font-size: 0.7rem;
  letter-spacing: 0.02em;
}

@media (max-width: 400px) {
  .country-card__stat-text {
    white-space: normal;
  }
}
</style>
