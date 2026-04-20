<template>
  <section id="inicio" class="hero">
    <div class="hero-media" aria-hidden="true">
      <OptimizedPicture
        :src="heroImageSrc"
        alt=""
        img-class="hero-media__img"
        loading="eager"
        fetchpriority="high"
      />
      <div class="hero-media__scrim" />
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
    </div>
  </section>
</template>

<script>
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'Hero',
  components: { OptimizedPicture },
  setup() {
    const heroImageSrc = '/IMG random/imagen interior 1.jpg'

    return {
      heroImageSrc
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  min-height: 650px;
  height: auto;
  background: var(--white);
  overflow: hidden;
}

.hero-media {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  width: 100%;
  height: fit-content;
}

.hero-media :deep(picture) {
  display: block;
  width: 100%;
  height: fit-content;
}

/* El <img> vive en OptimizedPicture: sin :deep() el scoped de Hero no lo alcanza */
.hero-media :deep(img.hero-media__img) {
  width: 100vw;
}

/* Velo para leer el texto (referencia: bloque inferior más oscuro) */
.hero-media__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(43, 43, 43, 0.82) 0%,
    rgba(43, 43, 43, 0.35) 42%,
    rgba(43, 43, 43, 0.08) 65%,
    transparent 100%
  );
}

.hero-content {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 7rem 2rem 3.5rem;
  box-sizing: border-box;
}

/* Texto sobre la imagen: abajo-izquierda */
.hero-text {
  max-width: 38rem;
  margin-right: auto;
  margin-left: 0;
  animation: fadeInUp 1s ease-out;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5.5vw, 4.25rem);
  font-weight: 700;
  font-style: normal;
  line-height: 1.08;
  margin-bottom: 1.25rem;
  color: var(--white);
  letter-spacing: -0.03em;
  text-shadow: 0 2px 28px rgba(0, 0, 0, 0.35);
}

.title-line {
  display: block;
}

.title-line.accent {
  color: rgba(255, 255, 255, 0.96);
  margin-left: 0;
}

.hero-subtitle {
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 2rem;
  line-height: 1.75;
  max-width: 32rem;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.95rem 2.25rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  transition: var(--transition);
  display: inline-block;
  font-size: 0.98rem;
  border: 2px solid transparent;
}

.hero .btn-primary {
  background: var(--white);
  color: var(--color-charcoal);
  border-color: var(--white);
}

.hero .btn-primary:hover {
  background: transparent;
  color: var(--white);
  border-color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
}

.hero .btn-secondary {
  background: transparent;
  color: var(--white);
  border-color: rgba(255, 255, 255, 0.95);
}

.hero .btn-secondary:hover {
  background: var(--white);
  color: var(--color-charcoal);
  border-color: var(--white);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  /* Fondo solo en móvil (desktop sigue con picture + interior) */
  .hero {
    min-height: 450px;
    background-image: url('/IMG%20random/Imagen%20exterior.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero-media {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
  }

  .hero-media :deep(picture) {
    display: none;
  }

  .hero-content {
    padding: 6rem 1rem 2.5rem;
  }

  .hero-text {
    max-width: none;
  }

  .btn {
    padding: 0.8rem 1.75rem;
    font-size: 0.92rem;
  }
}

@media (min-width: 1024px) {
  /* Opcional: un poco de sangría como en referencias editoriales */
  .hero-text {
    padding-bottom: 0.25rem;
  }
}
</style>
