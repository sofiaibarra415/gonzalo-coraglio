<template>
  <section id="sobre-mi" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="section-title section-title--display">
            Sobre mí
          </h2>
          <p class="about-lede">
            Estudiante avanzado de Arquitectura (FAU-UNLP), actualmente cursando el
            Trabajo Final de Carrera (TFC). Desde 2022 desarrollo trabajo freelance
            en documentación técnica y visualización arquitectónica: elaboración de
            planos, renders fotorrealistas y entregables para clientes particulares.
            Manejo avanzado de AutoCAD, SketchUp, Lumion, D5 Render y Photoshop, con
            incorporación progresiva de Revit y flujo BIM.
          </p>
          <p class="about-lede">
            Mi interés particular está en la escala del detalle: el diseño de
            interiores y de mobiliario, donde la atención a cada elemento define la
            experiencia del espacio. Me atrae la sustentabilidad como criterio de
            diseño, y busco constantemente incorporar herramientas y enfoques que
            aporten valor a cada proyecto.
          </p>
        </div>

        <div class="about-collage" aria-hidden="true">
          <div class="collage-item collage-item--a">
            <OptimizedPicture
              :src="collageImages[0]"
              alt=""
              img-class="collage-img"
              loading="lazy"
            />
          </div>
          <div class="collage-item collage-item--b">
            <OptimizedPicture
              :src="collageImages[1]"
              alt=""
              img-class="collage-img"
              loading="lazy"
            />
          </div>
          <div class="collage-item collage-item--c">
            <OptimizedPicture
              :src="collageImages[2]"
              alt=""
              img-class="collage-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div class="about-skills">
        <div class="about-cv-wrap">
          <a
            :href="cvUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="about-cv-btn"
            aria-label="Abrir CV en PDF en una pestaña nueva"
          >
            <svg
              class="about-cv-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Descargar CV</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'About',
  components: { OptimizedPicture },
  setup() {
    const collageImages = [
      '/Centro vacunatorio/RENDER_01.webp',
      '/Mediateca/imagen 01 axo aerea_4 - Photo.webp',
      '/Mediateca/imagen 01 axo aerea_2 - Photo.webp'
    ]

    /** PDF en `public/`; respeta `base` de Vite (GitHub Pages, etc.). */
    const cvUrl = `${import.meta.env.BASE_URL || '/'}CV_Gonzalo_Coraglio.pdf`

    return {
      collageImages,
      cvUrl
    }
  }
}
</script>

<style scoped>
.about {
  padding: 6rem 0;
  background: transparent;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 6rem;
  align-items: center;
}

.section-label {
  display: inline-block;
  font-family: var(--font-sans);
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.section-title--display {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 1.75rem;
}

.about-lede {
  color: var(--text-light);
  line-height: 1.75;
  font-size: 1.1rem;
  max-width: 32rem;
  margin-bottom: 2.5rem;
}

.about-collage {
  position: relative;
  min-height: 30rem;
}

.collage-item {
  position: absolute;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(43, 43, 43, 0.16);
}

.collage-item :deep(picture),
.collage-item :deep(.collage-img) {
  display: block;
  width: 100%;
  height: 100%;
}

.collage-item :deep(.collage-img) {
  object-fit: cover;
}

.collage-item--a {
  top: 0;
  right: 0;
  width: 72%;
  height: 20rem;
  z-index: 1;
}

.collage-item--b {
  top: 9.5rem;
  left: 0;
  width: 58%;
  height: 14.5rem;
  z-index: 2;
}

.collage-item--c {
  bottom: 0;
  right: 12%;
  width: 44%;
  height: 12.5rem;
  z-index: 3;
}

.about-skills {
  margin-top: 6rem;
}

.about-cv-wrap {
  display: flex;
  justify-content: center;
  padding: 2.75rem 0 3.25rem;
  margin-bottom: 0.5rem;
}

.about-cv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-width: min(100%, 19rem);
  padding: 1.15rem 2.35rem;
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: center;
  color: var(--white);
  background: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 999px;
  box-shadow:
    0 4px 6px rgba(43, 43, 43, 0.08),
    0 14px 36px rgba(43, 43, 43, 0.14);
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  -webkit-appearance: none;
  appearance: none;
}

.about-cv-icon {
  flex-shrink: 0;
  opacity: 0.95;
}

.about-cv-btn:hover {
  background: var(--color-ironclad);
  border-color: var(--color-ironclad);
  color: var(--white);
  transform: translateY(-3px);
  box-shadow:
    0 8px 16px rgba(43, 43, 43, 0.12),
    0 22px 48px rgba(43, 43, 43, 0.18);
}

.about-cv-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 4px;
}

@media (max-width: 1024px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-collage {
    min-height: 26rem;
    max-width: 32rem;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.85rem;
  }

  .about-cv-wrap {
    padding: 2.25rem 0 2.75rem;
  }

  .about-cv-btn {
    width: 100%;
    max-width: 22rem;
    min-width: 0;
    padding: 1.05rem 1.5rem;
    font-size: 1rem;
  }

  .about-collage {
    min-height: 20rem;
    max-width: 100%;
  }

  .collage-item--a {
    height: 13rem;
  }

  .collage-item--b {
    top: 8.5rem;
    height: 9.5rem;
  }

  .collage-item--c {
    height: 8rem;
  }
}
</style>
