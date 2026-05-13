<template>
  <v-card class="country-card h-100 d-flex flex-column" rounded="lg">
    <div class="country-flag-wrap">
      <v-img
        :src="flagSrc"
        :alt="`Drapeau ou visuel — ${country.name?.common || ''}`"
        height="172"
        cover
        class="country-flag-img"
      >
        <template #error>
          <v-sheet height="172" class="country-flag-fallback d-flex align-center justify-center">
            <v-icon icon="mdi-flag-outline" size="44" class="country-flag-fallback-icon" />
          </v-sheet>
        </template>
      </v-img>
      <div class="country-flag-edge" aria-hidden="true" />
    </div>

    <div class="country-card-body flex-grow-1 d-flex flex-column">
      <div class="country-card-head px-4 pt-4 pb-3">
        <div class="country-title-row">
          <div class="country-names min-width-0">
            <h3 class="country-name text-h6 font-weight-bold">
              {{ country.name?.common }}
            </h3>
            <p v-if="officialSubtitle" class="country-official text-caption text-medium-emphasis mb-0">
              {{ officialSubtitle }}
            </p>
          </div>
          <v-chip
            v-if="country.isCustom"
            size="x-small"
            variant="outlined"
            class="custom-country-badge flex-shrink-0"
          >
            Personnalisé
          </v-chip>
        </div>
      </div>

      <v-divider class="country-divider mx-4 opacity-40" />

      <div class="country-meta px-4 py-3 flex-grow-1">
        <dl class="country-meta-list">
          <div class="country-meta-row">
            <dt class="meta-label">Capitale</dt>
            <dd class="meta-value">{{ capitalLabel }}</dd>
          </div>
          <div class="country-meta-row">
            <dt class="meta-label">Région</dt>
            <dd class="meta-value">{{ regionLabel }}</dd>
          </div>
          <div class="country-meta-row">
            <dt class="meta-label">Population</dt>
            <dd class="meta-value">{{ formattedPopulation }}</dd>
          </div>
        </dl>

        <div class="country-chips d-flex flex-wrap ga-2 mt-3">
          <v-chip size="x-small" variant="tonal" color="primary" class="country-chip">
            {{ independenceLabel }}
          </v-chip>
          <v-chip
            v-for="insight in quickInsights"
            :key="insight.label"
            size="x-small"
            variant="tonal"
            :color="insight.color"
            class="country-chip"
          >
            {{ insight.label }}
          </v-chip>
        </div>
      </div>

      <v-card-actions class="country-actions px-4 pb-4 pt-1 mt-auto">
        <v-btn
          color="primary"
          variant="flat"
          :to="{ name: 'country-details', params: { code: country.cca3 } }"
          rounded="lg"
          size="default"
          prepend-icon="mdi-information-outline"
          class="details-btn"
        >
          Fiche pays
        </v-btn>

        <div class="country-actions-icons d-inline-flex align-center ga-1">
          <v-btn
            :icon="favoriteIcon"
            :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            variant="tonal"
            rounded="lg"
            class="favorite-btn"
            @click="$emit('toggle-favorite', country.cca3)"
          />
          <v-btn
            v-if="canDelete"
            icon="mdi-delete-outline"
            variant="tonal"
            color="error"
            rounded="lg"
            aria-label="Supprimer ce pays personnalisé"
            class="delete-btn"
            @click="$emit('delete-country', country.cca3)"
          />
        </div>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { getCountryFlagSrc } from '@/utils/countryFlagSrc'

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
  return `${Number(value).toLocaleString('fr-FR')}`
})

const capitalLabel = computed(() => {
  const c = props.country?.capital?.[0]
  return c && String(c).trim() ? String(c).trim() : '—'
})

/** Sous-titre : évite de répéter le nom courant quand il est identique à l’officiel */
const officialSubtitle = computed(() => {
  const official = props.country?.name?.official?.trim()
  const common = props.country?.name?.common?.trim()
  if (!official) return ''
  if (common && official === common) return ''
  return official
})

const regionLabel = computed(() => {
  const region = props.country?.region
  return regionMap[region] || region || '—'
})

const independenceLabel = computed(() => {
  if (props.country?.independent === true) return 'État indépendant'
  if (props.country?.independent === false) return 'Territoire dépendant'
  return 'Statut non précisé'
})

const quickInsights = computed(() => {
  const population = Number(props.country?.population || 0)
  const area = Number(props.country?.area || 0)
  const bordersCount = Number(props.country?.borders?.length || 0)
  const insights = []

  if (population >= 80_000_000) {
    insights.push({ label: 'Très peuplé', color: 'success' })
  } else if (population > 0 && population <= 2_000_000) {
    insights.push({ label: 'Population modeste', color: 'info' })
  }

  if (area >= 1_000_000) {
    insights.push({ label: 'Vaste territoire', color: 'secondary' })
  } else if (area > 0 && area <= 100_000) {
    insights.push({ label: 'Territoire compact', color: 'secondary' })
  }

  if (bordersCount >= 6) {
    insights.push({ label: 'Nombreuses frontières', color: 'warning' })
  }

  return insights.slice(0, 2)
})

const favoriteIcon = computed(() => (props.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'))
</script>

<style scoped>
.country-card {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: linear-gradient(168deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.014));
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.country-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--v-theme-primary), 0.28);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
}

.country-flag-wrap {
  position: relative;
  flex-shrink: 0;
}

.country-flag-img {
  display: block;
}

.country-flag-img :deep(img) {
  object-fit: cover;
  object-position: center;
}

.country-flag-fallback {
  background: linear-gradient(145deg, rgba(15, 28, 34, 0.96), rgba(25, 48, 56, 0.88));
}

.country-flag-fallback-icon {
  color: rgba(180, 230, 228, 0.45);
}

.country-flag-edge {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 55%,
    rgba(8, 14, 18, 0.35) 100%
  );
}

.country-card-body {
  min-height: 0;
}

.country-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.country-name {
  letter-spacing: 0.02em;
  line-height: 1.25;
  color: rgba(240, 255, 255, 0.98);
}

.country-official {
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}

.country-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.country-meta-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.country-meta-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px 16px;
}

.meta-label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(190, 222, 222, 0.72);
}

.meta-value {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 600;
  text-align: right;
  color: rgba(238, 252, 252, 0.95);
  line-height: 1.35;
}

.country-chips {
  padding-top: 2px;
}

.country-chip {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.country-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px !important;
}

.country-actions-icons {
  margin-left: auto;
}

.details-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.02em;
  min-height: 40px;
}

.favorite-btn,
.delete-btn {
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.favorite-btn:hover,
.delete-btn:hover {
  transform: scale(1.04);
}

.custom-country-badge {
  opacity: 0.92;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-color: rgba(124, 243, 232, 0.35) !important;
  color: rgba(210, 248, 246, 0.88) !important;
}

@media (max-width: 400px) {
  .country-meta-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .meta-value {
    text-align: left;
  }

  .country-actions-icons {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
