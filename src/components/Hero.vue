<template>
  <section id="inicio" ref="sectionRef" class="hero">
    <div class="hero-sticky">
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
            <span
              v-for="(line, i) in titleLines"
              :key="i"
              class="title-line"
              :class="{ accent: line.accent }"
              :style="{ opacity: lineOpacity(i) }"
            >{{ line.text }}</span>
          </h1>
          <p class="hero-subtitle">
            <span
              v-for="(word, i) in subtitleWords"
              :key="i"
              class="subtitle-word"
              :style="{ opacity: wordOpacity(i) }"
            >{{ word }}<span v-if="i < subtitleWords.length - 1">&nbsp;</span></span>
          </p>
          <div class="hero-buttons" :style="buttonsStyle">
            <a href="#proyectos" class="btn btn-primary">Ver Proyectos</a>
            <a href="#contacto" class="btn btn-secondary">Contactar</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'Hero',
  components: { OptimizedPicture },
  setup() {
    const heroImageSrc = '/IMG random/imagen interior 1.jpg'

    const titleLines = [
      { text: 'Arquitectura', accent: false },
      { text: 'que transforma', accent: true },
      { text: 'espacios', accent: false }
    ]

    const subtitleText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const subtitleWords = subtitleText.split(' ')

    const sectionRef = ref(null)
    const progress = ref(1)
    let ticking = false

    const prefersReducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const updateProgress = () => {
      const el = sectionRef.value
      if (!el || prefersReducedMotion()) {
        progress.value = 1
        return
      }
      const rect = el.getBoundingClientRect()
      const scrollableDist = rect.height - window.innerHeight
      const p = scrollableDist > 0 ? -rect.top / scrollableDist : 1
      progress.value = Math.min(1, Math.max(0, p))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateProgress()
        ticking = false
      })
    }

    onMounted(() => {
      updateProgress()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    })

    /* Reparto del scroll: 3 líneas de título -> subtítulo palabra a palabra -> botones */
    const TITLE_END = 0.42
    const SUBTITLE_END = 0.82

    const lineOpacity = (i) => {
      const n = titleLines.length
      const bandSize = TITLE_END / n
      const start = i * bandSize
      const t = (progress.value - start) / bandSize
      const w = Math.min(1, Math.max(0, t))
      return 0.12 + 0.88 * w
    }

    const wordOpacity = (i) => {
      const n = subtitleWords.length
      const span = SUBTITLE_END - TITLE_END
      const target = ((progress.value - TITLE_END) / span) * n
      const w = Math.min(1, Math.max(0, target - i))
      return 0.14 + 0.86 * w
    }

    const buttonsStyle = computed(() => {
      const t = Math.min(1, Math.max(0, (progress.value - SUBTITLE_END) / (1 - SUBTITLE_END)))
      return {
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px)`
      }
    })

    return {
      heroImageSrc,
      titleLines,
      subtitleWords,
      sectionRef,
      lineOpacity,
      wordOpacity,
      buttonsStyle
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 230vh;
}

.hero-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--white);
}

.hero-media {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.hero-media :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

/* El <img> vive en OptimizedPicture: sin :deep() el scoped de Hero no lo alcanza */
.hero-media :deep(img.hero-media__img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
  bottom: 0;
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
  transition: opacity 0.05s linear;
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

.subtitle-word {
  display: inline-block;
  transition: opacity 0.05s linear;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  transition: opacity 0.15s linear, transform 0.15s linear;
}

.btn {
  padding: 0.95rem 2.25rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 999px;
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

@media (prefers-reduced-motion: reduce) {
  .hero {
    height: auto;
  }

  .hero-sticky {
    position: relative;
    height: auto;
    min-height: 650px;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 200vh;
  }

  .hero-sticky {
    height: 100dvh;
    background-image: url('/IMG%20random/Imagen%20exterior.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero-media {
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
