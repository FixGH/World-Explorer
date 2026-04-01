<template>
  <v-alert type="error" variant="tonal" class="my-4">
    {{ message }}
    <template v-if="retryable" #append>
      <v-btn variant="text" @click="$emit('retry')">Retry</v-btn>
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
