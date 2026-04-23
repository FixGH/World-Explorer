<template>
  <v-row class="mb-4">
    <v-col v-for="item in items" :key="item.label" cols="12" sm="6" md="3">
      <v-card class="h-100">
        <v-card-text>
          <div class="text-medium-emphasis text-subtitle-2 mb-2">{{ item.label }}</div>
          <div class="text-h5 font-weight-bold mb-1">{{ item.value }}</div>
          <v-icon :icon="item.icon" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>
