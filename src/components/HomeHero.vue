<template>
  <v-card class="home-hero mb-6" rounded="lg">
    <v-card-text class="hero-content py-10 py-md-12">
      <div class="text-overline mb-2 hero-overline">Explorer mondial</div>
      <h1 class="text-h3 text-md-h2 font-weight-bold mb-3">Explorez le monde simplement</h1>
      <p class="text-body-1 text-medium-emphasis mb-6 hero-description">
        Une application moderne pour découvrir les pays, comparer leurs données et garder vos favoris.
      </p>
      <div class="d-flex flex-wrap ga-3 hero-actions">
        <v-btn
          color="primary"
          size="large"
          class="hero-btn hero-btn-primary"
          :to="{ name: 'countries' }"
          prepend-icon="mdi-earth"
        >
          Explorer les pays
        </v-btn>
        <v-btn
          variant="outlined"
          size="large"
          class="hero-btn"
          :to="{ name: 'compare' }"
          prepend-icon="mdi-compare"
        >
          Comparer des pays
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.home-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    radial-gradient(circle at 12% 10%, rgba(146, 255, 250, 0.22) 0%, rgba(146, 255, 250, 0) 36%),
    linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.28) 0%,
    rgba(11, 30, 36, 0.76) 48%,
    rgba(8, 20, 24, 0.84) 100%
  );
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

.home-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0));
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-overline {
  color: rgba(227, 255, 255, 0.82);
  letter-spacing: 1.2px;
}

.hero-description {
  max-width: 760px;
  line-height: 1.7;
}

.hero-actions {
  margin-top: 4px;
}

.hero-btn {
  border-radius: 13px;
  text-transform: none;
  min-width: 180px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn-primary:hover {
  box-shadow: 0 14px 30px rgba(var(--v-theme-primary), 0.32);
}
</style>
