<template>
  <v-alert type="error" variant="tonal" class="my-4 error-state" rounded="lg">
    {{ message }}
    <template v-if="retryable" #append>
      <v-btn variant="tonal" color="error" @click="$emit('retry')">Réessayer</v-btn>
    </template>
  </v-alert>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  retryable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  border: 1px solid rgba(var(--v-theme-error), 0.3);
}
</style>
