<template>
  <section class="closing-cta" aria-labelledby="closing-cta-title">
    <div class="closing-cta__inner">
      <h2 id="closing-cta-title" class="closing-cta__title">Prêt à explorer le monde ?</h2>
      <p class="closing-cta__text">
        Chaque pays raconte une histoire. Où irez-vous en premier ?
      </p>
      <div class="closing-cta__actions">
        <v-btn
          color="primary"
          size="x-large"
          rounded="xl"
          class="closing-cta__btn"
          :to="{ name: 'countries' }"
          prepend-icon="mdi-earth"
        >
          Explorer les pays
        </v-btn>
        <v-btn
          variant="outlined"
          size="x-large"
          rounded="xl"
          class="closing-cta__btn closing-cta__btn--line"
          :to="{ name: 'compare' }"
          prepend-icon="mdi-compare"
        >
          Comparer deux pays
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-large"
          rounded="xl"
          class="closing-cta__btn"
          :to="{ name: 'statistics' }"
          prepend-icon="mdi-chart-bell-curve"
        >
          Voir les statistiques
        </v-btn>
      </div>
    </div>
  </section>
</template>

<style scoped>
.closing-cta {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  padding: clamp(32px, 5vw, 52px) clamp(20px, 4vw, 40px);
  border: 1px solid rgba(124, 243, 232, 0.22);
  background:
    radial-gradient(ellipse 80% 120% at 50% 0%, rgba(23, 215, 209, 0.22), transparent 55%),
    linear-gradient(165deg, rgba(14, 36, 40, 0.95), rgba(6, 14, 18, 0.98));
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.38);
  text-align: center;
}

.closing-cta__inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.closing-cta__title {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
}

.closing-cta__text {
  margin: 0 0 28px;
  font-size: 1.08rem;
  line-height: 1.6;
  color: rgba(190, 222, 222, 0.9);
  font-weight: 500;
}

.closing-cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 14px;
}

.closing-cta__btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.closing-cta__btn:hover {
  transform: translateY(-2px);
}

.closing-cta__btn--line {
  border-color: rgba(124, 243, 232, 0.45) !important;
  color: rgba(236, 255, 253, 0.95) !important;
}

@media (max-width: 600px) {
  .closing-cta__btn {
    width: 100%;
    max-width: 360px;
  }
}
</style>
