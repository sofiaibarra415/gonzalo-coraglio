<template>
  <section id="sobre-mi" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <span class="section-label">Sobre Mí</span>
          <h2 class="section-title">Arquitectura con visión</h2>
          <div class="about-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
          <div class="about-stats">
            <div class="stat-item" v-for="(stat, index) in stats" :key="index">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="about-image">
          <div class="image-wrapper">
            <OptimizedPicture
              :src="aboutPortrait"
              alt="Gonzalo Coraglio"
              img-class="about-portrait-img"
              loading="lazy"
            />
            <div class="image-overlay"></div>
          </div>
          <div class="floating-card">
            <div class="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
                <path d="M7 4V3a1 1 0 011-1h8a1 1 0 011 1v1M7 9l-2 2M17 9l2 2" />
              </svg>
            </div>
            <h3>Premios y Reconocimientos</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>
      <div class="about-skills">
        <div class="about-cv-wrap">
          <a
            class="about-cv-btn"
            href="/CV_Gonzalo_Coraglio.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="CV_Gonzalo_Coraglio.pdf"
            @click="onCvClick"
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
        <h3 class="skills-title">Enfoque de Trabajo</h3>
        <div class="skills-grid">
          <div class="skill-card" v-for="(skill, index) in skills" :key="index">
            <div class="skill-icon" aria-hidden="true">
              <!-- diseño -->
              <svg v-if="index === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
              <!-- planificación -->
              <svg v-else-if="index === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <!-- sostenibilidad -->
              <svg v-else-if="index === 2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22c-4-3-6-7-6-11a6 6 0 0112 0c0 4-2 8-6 11z" />
                <path d="M12 22V12M8 12c0-4 3-7 4-9M16 12c0-4-3-7-4-9" />
              </svg>
              <!-- innovación -->
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h4>{{ skill.title }}</h4>
            <p>{{ skill.description }}</p>
          </div>
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
    const stats = [
      { number: '50+', label: 'Proyectos Completados' },
      { number: '15+', label: 'Años de Experiencia' },
      { number: '30+', label: 'Clientes Satisfechos' }
    ]

    const skills = [
      {
        title: 'Diseño Arquitectónico',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.'
      },
      {
        title: 'Planificación Urbana',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.'
      },
      {
        title: 'Sostenibilidad',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.'
      },
      {
        title: 'Innovación',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.'
      }
    ]

    const aboutPortrait = '/Master plan/L2.png'

    const CV_PDF = '/CV_Gonzalo_Coraglio.pdf'
    const CV_FILENAME = 'CV_Gonzalo_Coraglio.pdf'

    /** iPhone / iPod / iPad (incl. iPadOS con UA de Mac + pantalla táctil). Safari suele mostrar PDF en pestaña nueva en negro; forzamos descarga vía blob. */
    const isAppleTouchDevice = () => {
      if (typeof navigator === 'undefined') return false
      const ua = navigator.userAgent || ''
      if (/iPhone|iPod/i.test(ua)) return true
      if (/iPad/i.test(ua)) return true
      if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
      return false
    }

    const onCvClick = async (e) => {
      if (!isAppleTouchDevice()) return
      e.preventDefault()
      try {
        const res = await fetch(CV_PDF, { credentials: 'same-origin' })
        if (!res.ok) throw new Error(String(res.status))
        const blob = await res.blob()
        const pdfBlob =
          blob.type === 'application/pdf'
            ? blob
            : new Blob([blob], { type: 'application/pdf' })
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = CV_FILENAME
        a.rel = 'noopener'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
      } catch {
        window.location.href = CV_PDF
      }
    }

    return {
      stats,
      skills,
      aboutPortrait,
      onCvClick
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

.about-description {
  margin-bottom: 3rem;
}

.about-description p {
  margin-bottom: 1.5rem;
  color: var(--text-light);
  line-height: 1.8;
  font-size: 1.05rem;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--secondary-color);
  border-radius: 8px;
  transition: var(--transition);
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-family: var(--font-sans);
  font-size: 2.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.about-image {
  position: relative;
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.image-wrapper :deep(picture),
.image-wrapper :deep(.about-portrait-img) {
  display: block;
  width: 100%;
  height: auto;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(43, 43, 43, 0.06) 0%,
    transparent 100%
  );
}

.floating-card {
  position: absolute;
  bottom: -30px;
  right: -30px;
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  z-index: 2;
}

.card-icon {
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.card-icon svg {
  width: 40px;
  height: 40px;
  display: block;
}

.floating-card h3 {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.floating-card p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.6;
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
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-decoration: none;
  color: var(--white);
  background: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 10px;
  box-shadow:
    0 4px 6px rgba(43, 43, 43, 0.08),
    0 14px 36px rgba(43, 43, 43, 0.14);
  transition: var(--transition);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
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
  margin-bottom: 3rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-card {
  padding: 2.5rem;
  background: var(--secondary-color);
  border-radius: 12px;
  text-align: center;
  transition: var(--transition);
  border: 2px solid transparent;
}

.skill-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  display: flex;
  justify-content: center;
}

.skill-icon svg {
  width: 40px;
  height: 40px;
}

.skill-card h4 {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.skill-card p {
  color: var(--text-light);
  line-height: 1.7;
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .floating-card {
    position: relative;
    bottom: 0;
    right: 0;
    margin-top: 2rem;
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

  .about-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
