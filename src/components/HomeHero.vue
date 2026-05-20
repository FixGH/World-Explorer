<template>
  <section class="home-hero" aria-labelledby="home-hero-title">
    <div class="home-hero__aurora" aria-hidden="true" />
    <div class="home-hero__mesh" aria-hidden="true" />
    <div class="home-hero__particles" aria-hidden="true">
      <span v-for="i in 22" :key="i" class="home-hero__dot" />
    </div>

    <div class="home-hero__layout">
      <div class="home-hero__copy">
        <p class="home-hero__eyebrow">World Explorer</p>
        <h1 id="home-hero-title" class="home-hero__title">
          Explorez notre planète autrement
          <span class="home-hero__emoji" aria-hidden="true">🌍</span>
        </h1>
        <p class="home-hero__lead">
          Explorez les cultures, comparez les pays et découvrez des données fascinantes sur notre monde.
        </p>

        <div class="home-hero__actions">
          <v-btn
            color="primary"
            size="x-large"
            class="home-hero__btn home-hero__btn--primary"
            :to="{ name: 'countries' }"
            prepend-icon="mdi-earth"
            rounded="xl"
          >
            Explorer les pays
          </v-btn>
          <v-btn
            variant="outlined"
            size="x-large"
            class="home-hero__btn home-hero__btn--outline"
            :to="{ name: 'compare' }"
            prepend-icon="mdi-compare"
            rounded="xl"
          >
            Comparer deux pays
          </v-btn>
          <v-btn
            variant="text"
            size="x-large"
            class="home-hero__btn home-hero__btn--ghost"
            :to="{ name: 'statistics' }"
            prepend-icon="mdi-chart-timeline-variant"
            rounded="xl"
          >
            Voir les statistiques
          </v-btn>
        </div>
      </div>

      <div class="home-hero__stage" aria-hidden="true">
        <div class="home-hero__globe-ring" />
        <div class="home-hero__globe">
          <v-icon icon="mdi-earth" size="120" class="home-hero__globe-icon" />
        </div>
        <div class="home-hero__orbit home-hero__orbit--a" />
        <div class="home-hero__orbit home-hero__orbit--b" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: clamp(28px, 5vw, 56px) clamp(22px, 4vw, 48px);
  min-height: min(520px, 72vh);
  display: flex;
  align-items: center;
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(124, 243, 232, 0.06) inset;
  background:
    radial-gradient(ellipse 120% 80% at 50% 120%, rgba(23, 215, 209, 0.18), transparent 55%),
    linear-gradient(165deg, rgba(12, 28, 32, 0.95) 0%, rgba(6, 14, 20, 0.98) 100%);
}

.home-hero__aurora {
  position: absolute;
  inset: -40%;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 30%, rgba(124, 243, 232, 0.35) 0%, transparent 42%),
    radial-gradient(circle at 85% 20%, rgba(54, 168, 255, 0.28) 0%, transparent 38%),
    radial-gradient(circle at 70% 85%, rgba(23, 215, 209, 0.2) 0%, transparent 45%);
  animation: hero-aurora-shift 18s ease-in-out infinite alternate;
  opacity: 0.85;
}

.home-hero__mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 40%, black 20%, transparent 75%);
  opacity: 0.35;
  animation: hero-mesh-drift 40s linear infinite;
}

.home-hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.home-hero__dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 255, 252, 0.55);
  box-shadow: 0 0 12px rgba(124, 243, 232, 0.6);
  animation: hero-twinkle 4.5s ease-in-out infinite;
}

.home-hero__dot:nth-child(1) {
  top: 18%;
  left: 8%;
  animation-delay: 0s;
}
.home-hero__dot:nth-child(2) {
  top: 12%;
  left: 22%;
  animation-delay: 0.4s;
}
.home-hero__dot:nth-child(3) {
  top: 28%;
  left: 38%;
  animation-delay: 0.8s;
}
.home-hero__dot:nth-child(4) {
  top: 8%;
  left: 55%;
  animation-delay: 1.1s;
}
.home-hero__dot:nth-child(5) {
  top: 22%;
  left: 72%;
  animation-delay: 0.2s;
}
.home-hero__dot:nth-child(6) {
  top: 38%;
  left: 88%;
  animation-delay: 1.6s;
}
.home-hero__dot:nth-child(7) {
  top: 52%;
  left: 6%;
  animation-delay: 0.6s;
}
.home-hero__dot:nth-child(8) {
  top: 48%;
  left: 28%;
  animation-delay: 2s;
}
.home-hero__dot:nth-child(9) {
  top: 62%;
  left: 48%;
  animation-delay: 1.3s;
}
.home-hero__dot:nth-child(10) {
  top: 58%;
  left: 68%;
  animation-delay: 0.9s;
}
.home-hero__dot:nth-child(11) {
  top: 72%;
  left: 14%;
  animation-delay: 2.4s;
}
.home-hero__dot:nth-child(12) {
  top: 78%;
  left: 42%;
  animation-delay: 0.5s;
}
.home-hero__dot:nth-child(13) {
  top: 68%;
  left: 82%;
  animation-delay: 1.8s;
}
.home-hero__dot:nth-child(14) {
  top: 34%;
  left: 92%;
  animation-delay: 2.2s;
}
.home-hero__dot:nth-child(15) {
  top: 86%;
  left: 58%;
  animation-delay: 0.3s;
}
.home-hero__dot:nth-child(16) {
  top: 14%;
  left: 44%;
  animation-delay: 1.4s;
}
.home-hero__dot:nth-child(17) {
  top: 44%;
  left: 58%;
  animation-delay: 2.6s;
}
.home-hero__dot:nth-child(18) {
  top: 26%;
  left: 64%;
  animation-delay: 1s;
}
.home-hero__dot:nth-child(19) {
  top: 56%;
  left: 38%;
  animation-delay: 0.7s;
}
.home-hero__dot:nth-child(20) {
  top: 32%;
  left: 12%;
  animation-delay: 2.1s;
}
.home-hero__dot:nth-child(21) {
  top: 64%;
  left: 92%;
  animation-delay: 1.7s;
}
.home-hero__dot:nth-child(22) {
  top: 8%;
  left: 78%;
  animation-delay: 2.8s;
}

@keyframes hero-aurora-shift {
  0% {
    transform: translate(-4%, -2%) scale(1);
  }
  100% {
    transform: translate(5%, 3%) scale(1.08);
  }
}

@keyframes hero-mesh-drift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-24px);
  }
}

@keyframes hero-twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

.home-hero__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(220px, 0.88fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.home-hero__copy {
  min-width: 0;
}

.home-hero__eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 240, 236, 0.88);
  margin: 0 0 16px;
}

.home-hero__title {
  margin: 0 0 18px;
  font-size: clamp(2rem, 1.35rem + 2.1vw, 3.15rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: rgba(248, 255, 255, 0.98);
  text-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
}

.home-hero__emoji {
  display: inline-block;
  margin-left: 8px;
  animation: hero-emoji-bob 3.2s ease-in-out infinite;
}

@keyframes hero-emoji-bob {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-6px) rotate(6deg);
  }
}

.home-hero__lead {
  margin: 0 0 32px;
  max-width: 34rem;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.2rem);
  line-height: 1.65;
  color: rgba(200, 228, 228, 0.88);
  font-weight: 500;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 14px;
}

.home-hero__btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition:
    transform 0.25s ease,
    box-shadow 0.3s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.home-hero__btn--primary {
  box-shadow: 0 12px 36px rgba(var(--v-theme-primary), 0.35);
}

.home-hero__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(var(--v-theme-primary), 0.48);
}

.home-hero__btn--outline {
  border-color: rgba(124, 243, 232, 0.45) !important;
  color: rgba(230, 255, 253, 0.95) !important;
  background: rgba(255, 255, 255, 0.04);
}

.home-hero__btn--outline:hover {
  transform: translateY(-2px);
  border-color: rgba(124, 243, 232, 0.75) !important;
  background: rgba(124, 243, 232, 0.1);
}

.home-hero__btn--ghost {
  color: rgba(210, 245, 242, 0.92) !important;
}

.home-hero__btn--ghost:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08) !important;
}

.home-hero__stage {
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-hero__globe-ring {
  position: absolute;
  width: min(320px, 42vw);
  height: min(320px, 42vw);
  border-radius: 50%;
  border: 1px solid rgba(124, 243, 232, 0.22);
  box-shadow:
    0 0 60px rgba(23, 215, 209, 0.15),
    inset 0 0 40px rgba(23, 215, 209, 0.08);
  animation: hero-ring-pulse 5s ease-in-out infinite;
}

@keyframes hero-ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}

.home-hero__globe {
  position: relative;
  width: min(220px, 36vw);
  height: min(220px, 36vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.2), transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(23, 215, 209, 0.35), rgba(8, 22, 28, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: hero-globe-float 6s ease-in-out infinite;
}

@keyframes hero-globe-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

.home-hero__globe-icon {
  color: rgba(230, 255, 252, 0.95);
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
}

.home-hero__orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(124, 243, 232, 0.22);
  pointer-events: none;
}

.home-hero__orbit--a {
  width: min(380px, 50vw);
  height: min(380px, 50vw);
  animation: hero-spin 48s linear infinite;
}

.home-hero__orbit--b {
  width: min(440px, 58vw);
  height: min(440px, 58vw);
  border-color: rgba(54, 168, 255, 0.14);
  animation: hero-spin-reverse 64s linear infinite;
}

@keyframes hero-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes hero-spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@media (max-width: 959px) {
  .home-hero {
    min-height: unset;
    padding: 28px 20px 36px;
  }

  .home-hero__layout {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .home-hero__lead {
    margin-left: auto;
    margin-right: auto;
  }

  .home-hero__actions {
    justify-content: center;
  }

  .home-hero__btn {
    width: 100%;
    max-width: 360px;
  }

  .home-hero__stage {
    order: -1;
    min-height: 220px;
  }

  .home-hero__orbit--a,
  .home-hero__orbit--b {
    display: none;
  }
}
</style>
