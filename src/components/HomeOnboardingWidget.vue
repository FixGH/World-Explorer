<template>
  <v-expand-transition>
    <v-card v-if="visible" class="onboarding-widget" rounded="lg">
      <v-card-text class="pa-4 pa-md-5">
        <div class="d-flex align-start justify-space-between mb-3">
          <div class="d-flex align-center ga-2">
            <span class="widget-icon-wrap">
              <v-icon icon="mdi-earth" />
            </span>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Guide de démarrage</div>
              <div class="text-caption text-medium-emphasis">World Explorer Assistant</div>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            aria-label="Fermer le guide"
            @click="dismiss"
          />
        </div>

        <p class="text-body-2 text-medium-emphasis mb-4">
          Commencez en quelques clics : explorez les pays, comparez-les, sauvegardez vos favoris et consultez
          les statistiques globales.
        </p>

        <v-list density="compact" class="widget-list">
          <v-list-item prepend-icon="mdi-earth" title="Explorer les pays" />
          <v-list-item prepend-icon="mdi-compare" title="Comparer deux pays" />
          <v-list-item prepend-icon="mdi-heart" title="Créer vos favoris" />
          <v-list-item prepend-icon="mdi-chart-bar" title="Voir les statistiques" />
        </v-list>

        <div class="d-flex flex-wrap ga-2 mt-2">
          <v-btn size="small" color="primary" variant="tonal" :to="{ name: 'countries' }">
            Commencer
          </v-btn>
          <v-btn size="small" variant="text" :to="{ name: 'statistics' }">
            Voir les stats
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script setup>
import { ref } from 'vue'

const ONBOARDING_STORAGE_KEY = 'world-explorer-onboarding-dismissed'

const visible = ref(!isDismissed())

function isDismissed() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return false
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function dismiss() {
  visible.value = false
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
  } catch {
    // Pas bloquant : le guide peut reapparaitre si le stockage est indisponible.
  }
}
</script>

<style scoped>
.onboarding-widget {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    radial-gradient(circle at 100% 0%, rgba(var(--v-theme-primary), 0.24), rgba(var(--v-theme-primary), 0)),
    rgba(9, 22, 27, 0.84);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);
}

.onboarding-widget::after {
  content: '';
  position: absolute;
  right: -70px;
  top: -70px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.24), rgba(var(--v-theme-primary), 0));
  animation: widgetPulse 6s ease-in-out infinite;
}

.widget-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.16);
}

.widget-list :deep(.v-list-item) {
  min-height: 34px;
}

@keyframes widgetPulse {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>
