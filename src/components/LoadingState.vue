<template>
  <v-row>
    <v-col v-for="n in itemCount" :key="n" cols="12" sm="6" md="4" lg="3">
      <v-skeleton-loader type="image, heading, text" />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  itemCount: {
    type: Number,
    default: 8,
  },
})
</script>
