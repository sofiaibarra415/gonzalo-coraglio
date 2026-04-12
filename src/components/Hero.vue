<template>
  <section id="inicio" class="hero">
    <div class="hero-motion" aria-hidden="true">
      <div class="hero-motion__mesh"></div>
      <div class="hero-motion__orb hero-motion__orb--a"></div>
      <div class="hero-motion__orb hero-motion__orb--b"></div>
    </div>
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <span class="title-line">Arquitectura</span>
          <span class="title-line accent">que transforma</span>
          <span class="title-line">espacios</span>
        </h1>
        <p class="hero-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div class="hero-buttons">
          <a href="#proyectos" class="btn btn-primary">Ver Proyectos</a>
          <a href="#contacto" class="btn btn-secondary">Contactar</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-marquee" role="img" aria-label="Galería de proyectos en movimiento continuo">
          <div class="hero-marquee-track">
            <div class="hero-marquee-group">
              <div
                v-for="(item, index) in heroImages"
                :key="'m1-' + item"
                class="hero-marquee-item"
              >
                <OptimizedPicture
                  :src="item"
                  :alt="`Proyecto ${index + 1}`"
                  img-class="hero-marquee-img"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  :fetchpriority="index === 0 ? 'high' : undefined"
                />
              </div>
            </div>
            <div class="hero-marquee-group" aria-hidden="true">
              <div
                v-for="(item, index) in heroImages"
                :key="'m2-' + item"
                class="hero-marquee-item"
              >
                <OptimizedPicture
                  :src="item"
                  alt=""
                  img-class="hero-marquee-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'Hero',
  components: { OptimizedPicture },
  setup() {
    const heroImages = [
      '/IMG random/Imagen exterior.jpg',
      '/Master plan/L1.png',
      '/Mediateca/imagen 01 axo aerea.jpg',
      '/Master plan/L2.png'
    ]

    return {
      heroImages
    }
  }
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 2rem 4rem;
  background: linear-gradient(
    125deg,
    var(--color-mint) 0%,
    var(--white) 45%,
    #f1f5f9 100%
  );
  position: relative;
  overflow: hidden;
}

/* Fondo con movimiento muy sutil (orbes + malla que respira) */
.hero-motion {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-motion__mesh {
  position: absolute;
  inset: -20%;
  background: linear-gradient(
    118deg,
    rgba(13, 148, 136, 0.08) 0%,
    rgba(255, 255, 255, 0.55) 38%,
    rgba(99, 102, 241, 0.06) 72%,
    rgba(226, 232, 240, 0.45) 100%
  );
  background-size: 200% 200%;
  animation: hero-mesh-shift 28s ease-in-out infinite;
}

.hero-motion__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(0.5px);
}

.hero-motion__orb--a {
  width: min(72vmax, 720px);
  height: min(72vmax, 720px);
  top: -18%;
  right: -12%;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(13, 148, 136, 0.12) 0%,
    rgba(241, 245, 249, 0.35) 45%,
    transparent 68%
  );
  animation: hero-orb-a 22s ease-in-out infinite;
}

.hero-motion__orb--b {
  width: min(58vmax, 560px);
  height: min(58vmax, 560px);
  bottom: -14%;
  left: -16%;
  background: radial-gradient(
    circle at 55% 55%,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(203, 213, 225, 0.22) 42%,
    transparent 65%
  );
  animation: hero-orb-b 32s ease-in-out infinite;
}

@keyframes hero-mesh-shift {
  0%,
  100% {
    background-position: 0% 40%;
    transform: scale(1);
  }
  50% {
    background-position: 100% 60%;
    transform: scale(1.03);
  }
}

@keyframes hero-orb-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-5%, 4%) scale(1.06);
    opacity: 0.92;
  }
}

@keyframes hero-orb-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(6%, -5%) scale(1.04);
    opacity: 0.88;
  }
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation: fadeInUp 1s ease-out;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 4.75rem;
  font-weight: 700;
  font-style: normal;
  line-height: 1.08;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  letter-spacing: -0.035em;
}

.title-line {
  display: block;
}

.title-line.accent {
  color: var(--accent-color);
  margin-left: 2rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
  line-height: 1.8;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2.5rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  transition: var(--transition);
  display: inline-block;
  font-size: 1rem;
}

.btn-primary {
  background: var(--accent-color);
  color: var(--white);
  border: 2px solid var(--accent-color);
}

.btn-primary:hover {
  background: transparent;
  color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(13, 148, 136, 0.2);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: var(--white);
  transform: translateY(-2px);
}

.hero-image {
  width: 100%;
  min-width: 0;
  animation: fadeIn 1.2s ease-out 0.3s both;
}

/* Cinta infinita: desplazamiento lineal continuo (sin saltos entre slides) */
.hero-marquee {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: transparent;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 6%,
    #000 94%,
    transparent
  );
}

.hero-marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: hero-marquee-x 55s linear infinite;
}

.hero-marquee:hover .hero-marquee-track {
  animation-play-state: paused;
}

.hero-marquee-group {
  display: flex;
  flex-shrink: 0;
  align-items: stretch;
  gap: 10px;
  padding: 0.4rem 10px 0.4rem 0;
  box-sizing: border-box;
}

.hero-marquee-item {
  flex: 0 0 auto;
  width: min(312px, 50vw);
  height: min(260px, 40vh);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(28, 25, 23, 0.1);
}

.hero-marquee-item :deep(picture),
.hero-marquee-item :deep(.hero-marquee-img) {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-marquee-item :deep(img.hero-marquee-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  vertical-align: top;
}

@keyframes hero-marquee-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-motion__mesh,
  .hero-motion__orb--a,
  .hero-motion__orb--b {
    animation: none !important;
  }

  .hero-motion__mesh {
    transform: none;
    background-position: 50% 50%;
  }

  .hero-marquee {
    mask-image: none;
  }

  .hero-marquee-track {
    animation: none;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .hero-marquee-group:last-child {
    display: none;
  }

  .hero-marquee-group {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    padding: 0;
    gap: 10px;
  }

  .hero-marquee-item {
    width: min(260px, 45vw);
    height: auto;
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-image {
    max-width: 600px;
    margin: 0 auto;
  }

  .hero-marquee-item {
    width: min(272px, 62vw);
    height: min(220px, 34vh);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 1rem 4rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .title-line.accent {
    margin-left: 0;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .btn {
    padding: 0.8rem 2rem;
    font-size: 0.9rem;
  }
}
</style>
