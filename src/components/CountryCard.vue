<template>
  <v-card class="country-card h-100 d-flex flex-column" hover rounded="lg">
    <v-img :src="flagSrc" :alt="country.name?.common" height="184" cover class="country-flag" rounded="lg">
      <template #error>
        <v-sheet height="180" class="d-flex align-center justify-center">
          <v-icon icon="mdi-flag-outline" size="48" />
        </v-sheet>
      </template>
    </v-img>

    <v-card-title class="text-wrap font-weight-bold text-body-1 pt-4">
      {{ country.name?.common }}
      <v-chip
        v-if="country.isCustom"
        size="x-small"
        variant="outlined"
        class="custom-country-badge ml-2"
      >
        Personnalisé
      </v-chip>
    </v-card-title>

    <v-card-subtitle class="pb-0 text-medium-emphasis">
      {{ country.name?.official || 'Nom officiel non disponible' }}
    </v-card-subtitle>

    <v-card-text class="flex-grow-1 country-meta">
      <div class="country-meta-item">
        <span class="meta-label">Capitale</span>
        <span class="meta-value">{{ country.capital?.[0] || 'Non disponible' }}</span>
      </div>
      <div class="country-meta-item">
        <span class="meta-label">Région</span>
        <span class="meta-value">{{ regionLabel }}</span>
      </div>
      <div class="country-meta-item">
        <span class="meta-label">Population</span>
        <span class="meta-value">{{ formattedPopulation }}</span>
      </div>

      <div class="d-flex flex-wrap ga-2 mt-1">
        <v-chip size="x-small" variant="tonal" color="primary">
          {{ independenceLabel }}
        </v-chip>
        <v-chip
          v-for="insight in quickInsights"
          :key="insight.label"
          size="x-small"
          variant="tonal"
          :color="insight.color"
        >
          {{ insight.label }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="country-actions px-4 pb-4">
      <v-btn
        color="primary"
        variant="tonal"
        :to="{ name: 'country-details', params: { code: country.cca3 } }"
        rounded="lg"
        class="details-btn"
      >
        Détails
      </v-btn>
      <v-spacer />
      <v-btn
        :icon="favoriteIcon"
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
        @click="$emit('delete-country', country.cca3)"
      />
    </v-card-actions>
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
  return value ? value.toLocaleString('fr-FR') : 'Non disponible'
})

const regionLabel = computed(() => {
  const region = props.country?.region
  return regionMap[region] || region || 'Non disponible'
})

const independenceLabel = computed(() => {
  if (props.country?.independent === true) return 'Pays indépendant'
  if (props.country?.independent === false) return 'Territoire non indépendant'
  return 'Statut politique non précisé'
})

const quickInsights = computed(() => {
  const population = Number(props.country?.population || 0)
  const area = Number(props.country?.area || 0)
  const bordersCount = Number(props.country?.borders?.length || 0)
  const insights = []

  if (population >= 80_000_000) {
    insights.push({ label: 'Population élevée', color: 'success' })
  } else if (population > 0 && population <= 2_000_000) {
    insights.push({ label: 'Population modérée', color: 'info' })
  }

  if (area >= 1_000_000) {
    insights.push({ label: 'Grande superficie', color: 'secondary' })
  } else if (area > 0 && area <= 100_000) {
    insights.push({ label: 'Petit territoire', color: 'secondary' })
  }

  if (bordersCount >= 6) {
    insights.push({ label: 'Pays très frontalier', color: 'warning' })
  }

  return insights.slice(0, 2)
})

const favoriteIcon = computed(() => (props.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'))
</script>

<style scoped>
.country-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}

.country-card:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--v-theme-primary), 0.38);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.36);
}

.country-flag :deep(img) {
  object-position: center;
}

.country-meta {
  display: grid;
  gap: 8px;
  line-height: 1.4;
}

.country-meta-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.meta-label {
  font-size: 0.78rem;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  color: rgba(232, 248, 248, 0.66);
}

.meta-value {
  color: rgba(235, 250, 250, 0.94);
  font-weight: 600;
}

.country-actions {
  margin-top: auto;
}

.details-btn {
  text-transform: none;
  font-weight: 600;
}

.favorite-btn {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.05);
}

.custom-country-badge {
  opacity: 0.88;
  font-weight: 500;
  border-color: rgba(255, 255, 255, 0.22) !important;
  color: rgba(235, 250, 250, 0.82) !important;
}
</style>
