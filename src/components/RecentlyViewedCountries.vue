<template>
  <v-card variant="tonal" rounded="lg" class="mb-6 recent-card">
    <v-card-text>
      <div class="d-flex align-center justify-space-between mb-3">
        <div>
          <div class="text-h6 font-weight-bold">Récemment consultés</div>
          <div class="text-medium-emphasis text-body-2">
            Vos derniers pays visités.
          </div>
        </div>
        <v-chip v-if="items.length" size="small" variant="tonal" color="primary">
          {{ items.length }} / 5
        </v-chip>
      </div>

      <v-alert
        v-if="!items.length"
        type="info"
        variant="tonal"
        rounded="lg"
        border="start"
      >
        Aucun pays consulté récemment.
      </v-alert>

      <v-list v-else density="compact">
        <v-list-item
          v-for="entry in items"
          :key="entry.code"
          :to="{ name: 'country-details', params: { code: entry.code } }"
          rounded="lg"
          class="recent-item"
        >
          <template #prepend>
            <v-avatar size="36" rounded="lg">
              <v-img v-if="entry.flagSrc" :src="entry.flagSrc" :alt="entry.name" cover>
                <template #error>
                  <v-icon icon="mdi-flag-outline" />
                </template>
              </v-img>
              <v-icon v-else icon="mdi-flag-outline" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ entry.name }}</v-list-item-title>
          <v-list-item-subtitle class="d-flex align-center justify-space-between">
            <span>{{ entry.code }}</span>
            <v-icon icon="mdi-arrow-right" size="16" class="text-medium-emphasis" />
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.recent-item {
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
  border: 1px solid transparent;
}

.recent-item:hover {
  transform: translateY(-1px);
  background: rgba(var(--v-theme-primary), 0.08);
  border-color: rgba(var(--v-theme-primary), 0.24);
}

.recent-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}
</style>

