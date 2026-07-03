<template>
  <section id="sobre-mi" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <span class="section-label">Sobre Mí</span>
          <h2 class="section-title section-title--display">
            Arquitectura<br />con visión
          </h2>
          <p class="about-lede">
            Cada proyecto nace de escuchar el lugar, el clima y a quienes lo van a
            habitar. El resultado no es solo un edificio: es un espacio que se
            siente propio desde el primer día.
          </p>

          <div class="about-stats-strip">
            <div class="stat-chip" v-for="(stat, index) in stats" :key="index">
              <span class="stat-chip-number">{{ stat.number }}</span>
              <span class="stat-chip-label">{{ stat.label }}</span>
            </div>
          </div>

          <a href="#proyectos" class="about-cta-pill">Ver proyectos</a>
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
          <button
            type="button"
            class="about-cv-btn"
            aria-label="Descargar o compartir CV en PDF"
            @click="openCvPdf"
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
          </button>
        </div>
        <h3 class="skills-title">Enfoque de Trabajo</h3>
      </div>
    </div>

    <div class="skills-band">
      <a
        v-for="(skill, index) in skills"
        :key="index"
        href="#proyectos"
        class="skill-panel"
        :style="{ background: skill.bg }"
      >
        <span class="skill-panel-kicker">
          <span class="skill-panel-dot" aria-hidden="true"></span>
          {{ skill.kicker }}
        </span>
        <h4 class="skill-panel-title">{{ skill.title }}</h4>
        <span class="skill-panel-cta">Ver proyectos</span>
      </a>
    </div>
  </section>
</template>

<script>
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'About',
  components: { OptimizedPicture },
  setup() {
    const stats = [
      { number: '50+', label: 'Proyectos Completados' },
      { number: '15+', label: 'Años de Experiencia' },
      { number: '30+', label: 'Clientes Satisfechos' }
    ]

    const skills = [
      {
        title: 'Diseño Arquitectónico',
        kicker: 'cada detalle, con intención',
        bg: '#3A362F'
      },
      {
        title: 'Planificación Urbana',
        kicker: 'pensado a escala de ciudad',
        bg: '#2B333A'
      },
      {
        title: 'Sostenibilidad',
        kicker: 'materiales y energía con conciencia',
        bg: '#2E3A33'
      },
      {
        title: 'Innovación',
        kicker: 'tecnología al servicio del espacio',
        bg: '#C1602C'
      }
    ]

    const collageImages = [
      '/Centro vacunatorio/RENDER_01.webp',
      '/Mediateca/imagen 01 axo aerea_4 - Photo.webp',
      '/Mediateca/imagen 01 axo aerea_2 - Photo.webp'
    ]

    const CV_FILENAME = 'CV_Gonzalo_Coraglio.pdf'

    /** URL absoluta del PDF (respeta `base` de Vite en GitHub Pages, etc.). */
    const cvAbsoluteUrl = () => {
      if (typeof window === 'undefined') return `/${CV_FILENAME}`
      const base = import.meta.env.BASE_URL || '/'
      const dir = new URL(base, `${window.location.origin}/`).href
      return new URL(CV_FILENAME, dir).href
    }

    /**
     * Un solo flujo en todos los navegadores:
     * 1) fetch del PDF (URL absoluta con base de Vite)
     * 2) en táctil: Web Share (archivo o enlace) — evita visor PDF en negro en Safari
     * 3) descarga forzada vía blob
     * 4) abrir URL en pestaña nueva
     */
    const openCvPdf = async () => {
      const absUrl = cvAbsoluteUrl()
      const offerShare =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(pointer: coarse)')?.matches === true

      let pdfBlob
      try {
        const res = await fetch(absUrl, { cache: 'no-store', credentials: 'omit' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw = await res.blob()
        pdfBlob =
          raw.type === 'application/pdf'
            ? raw
            : new Blob([raw], { type: 'application/pdf' })
      } catch {
        window.open(absUrl, '_blank', 'noopener,noreferrer')
        return
      }

      const nav = typeof navigator !== 'undefined' ? navigator : null

      if (offerShare) {
        try {
          if (typeof File !== 'undefined' && nav?.share && typeof nav.canShare === 'function') {
            let file
            try {
              file = new File([pdfBlob], CV_FILENAME, { type: 'application/pdf' })
            } catch {
              file = null
            }
            if (file) {
              try {
                if (nav.canShare({ files: [file] })) {
                  await nav.share({ files: [file], title: 'CV — Gonzalo Coraglio' })
                  return
                }
              } catch {
                /* continuar */
              }
            }
          }
        } catch (err) {
          if (err && err.name === 'AbortError') return
        }

        try {
          if (nav?.share) {
            await nav.share({ title: 'CV — Gonzalo Coraglio', url: absUrl })
            return
          }
        } catch (err) {
          if (err && err.name === 'AbortError') return
        }
      }

      try {
        const objectUrl = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = CV_FILENAME
        a.rel = 'noopener'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
      } catch {
        window.open(absUrl, '_blank', 'noopener,noreferrer')
      }
    }

    return {
      stats,
      skills,
      collageImages,
      openCvPdf
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
  font-size: clamp(2.6rem, 4.4vw, 3.75rem);
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

.about-stats-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 2.25rem;
  margin-bottom: 2.5rem;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-chip-number {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--primary-color);
}

.stat-chip-label {
  font-size: 0.82rem;
  color: var(--text-light);
  letter-spacing: 0.01em;
}

.about-cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 1.85rem;
  font-family: var(--font-display);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  border: 1.5px solid var(--primary-color);
  border-radius: 999px;
  transition: var(--transition);
}

.about-cta-pill:hover {
  background: var(--primary-color);
  color: var(--white);
  transform: translateY(-2px);
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

.skills-title {
  font-family: var(--font-sans);
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--primary-color);
  margin-bottom: 0;
}

/* Franja full-bleed: se sale del .container para ocupar todo el ancho de ventana */
.skills-band {
  margin-top: 3rem;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 20rem;
}

.skill-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.75rem;
  overflow: hidden;
  text-decoration: none;
  isolation: isolate;
  transition: var(--transition);
}

.skill-panel:hover {
  filter: brightness(1.08);
}

.skill-panel-kicker {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 0.01em;
}

.skill-panel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.skill-panel-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--white);
}

.skill-panel-cta {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.75rem 1.35rem;
  border-radius: 999px;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  transition: var(--transition);
}

.skill-panel:hover .skill-panel-cta {
  background: var(--white);
  border-color: var(--white);
  color: var(--color-charcoal);
  transform: translateY(-2px);
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

  .skills-band {
    grid-template-columns: repeat(2, 1fr);
    height: auto;
  }

  .skill-panel {
    height: 22rem;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.85rem;
  }

  .skills-title {
    font-size: 1.65rem;
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

  .about-stats-strip {
    gap: 1.5rem;
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

  .skills-band {
    grid-template-columns: 1fr;
  }

  .skill-panel {
    height: 18rem;
  }

  .skill-panel-title {
    font-size: 1.4rem;
  }
}
</style>
