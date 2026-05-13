<template>
  <v-row :class="marginBottom">
    <v-col
      v-for="item in items"
      :key="item.label"
      cols="12"
      :sm="smBreakpoint"
      :md="md"
    >
      <v-card class="summary-card h-100" :class="{ 'summary-card--insight': Boolean(item.headline) }">
        <v-card-text class="d-flex justify-space-between align-start ga-3 pa-5">
          <div class="summary-text flex-grow-1 min-width-0">
            <div class="text-medium-emphasis text-subtitle-2 mb-3 summary-label">{{ item.label }}</div>

            <template v-if="hasHeadline(item)">
              <div class="summary-headline font-weight-bold text-break">{{ item.headline }}</div>
              <div v-if="item.detail" class="summary-detail text-body-2 text-medium-emphasis mt-2">
                {{ item.detail }}
              </div>
            </template>
            <div v-else class="summary-value text-h5 font-weight-bold text-break">
              {{ item.value }}
            </div>
          </div>
          <div class="summary-icon-wrap flex-shrink-0">
            <v-icon :icon="item.icon" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  md: {
    type: Number,
    default: 3,
  },
  marginBottom: {
    type: String,
    default: 'mb-6',
  },
})

const smBreakpoint = computed(() => (props.md >= 6 ? 12 : 6))

function hasHeadline(item) {
  return item?.headline != null && String(item.headline).trim() !== ''
}
</script>

<style scoped>
.summary-card {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.025);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.summary-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.28);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.22);
}

.summary-card--insight {
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
}

.summary-label {
  letter-spacing: 0.04em;
  font-size: 0.75rem !important;
  text-transform: uppercase;
}

.summary-headline {
  font-size: 1.15rem;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: rgba(240, 255, 255, 0.96);
}

.summary-detail {
  line-height: 1.45;
}

.summary-value {
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

.summary-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
}
</style>
