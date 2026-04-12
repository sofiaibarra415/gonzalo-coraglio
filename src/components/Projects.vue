<template>
  <section id="proyectos" class="projects">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Portfolio</span>
        <h2 class="section-title">Proyectos</h2>
        <p class="section-subtitle">
          En escritorio, tocá la miniatura para abrir el carrusel horizontal con imágenes y textos. En móvil, cada proyecto muestra ya el carrusel; tocá el título o la primera imagen para cerrarlo. Podés tener varios abiertos a la vez; Escape cierra todos.
        </p>
      </div>
    </div>

    <div class="projects-stack-wrap">
      <div class="projects-stack" role="list">
        <article
          v-for="(project, index) in projects"
          :key="project.slug"
          class="project-block"
          :class="{
            'is-expanded': isExpanded(index),
            'project-block--hero-flip': heroFlippingIndex === index,
            'project-block--uniform-images': project.uniformImages
          }"
          :data-project-idx="index"
          role="listitem"
        >
          <header
            v-if="isExpanded(index)"
            class="project-block-head"
            :class="{ 'project-block-head--collapse': isExpanded(index) }"
            @click="onHeadClick(index)"
          >
            <span class="strip-badge">{{ project.badge }}</span>
            <h3 class="strip-title">{{ project.title }}</h3>
            <p class="strip-meta">{{ project.location }} · {{ project.category }}</p>
          </header>

          <div
            class="project-body"
            :class="{ 'is-expanded': isExpanded(index) }"
          >
            <div
              v-if="!isExpanded(index)"
              class="project-collapsed-layout"
            >
              <header class="project-block-head project-block-head--beside">
                <span class="strip-badge">{{ project.badge }}</span>
                <h3 class="strip-title">{{ project.title }}</h3>
                <p class="strip-meta">{{ project.location }} · {{ project.category }}</p>
              </header>
              <div class="project-hero-col">
                <button
                  type="button"
                  class="project-hero"
                  :aria-expanded="false"
                  :aria-label="`Ampliar ${project.title} y ver detalle`"
                  @click="toggleExpand(index)"
                >
                  <div class="project-hero-frame">
                    <OptimizedPicture
                      :src="project.heroImage"
                      :alt="`Imagen principal — ${project.title}`"
                      img-class="project-hero-img"
                      :loading="index === 0 ? 'eager' : 'lazy'"
                    />
                  </div>
                </button>
              </div>
              <div class="project-collapsed-spacer" aria-hidden="true" />
            </div>

            <Transition
              name="detail-reveal"
              :duration="{ enter: 0, leave: 360 }"
            >
              <div
                v-show="isExpanded(index)"
                class="project-detail-outer"
                :class="{
                  'project-detail-outer--flip': heroFlippingIndex === index
                }"
              >
                <Swiper
                  class="project-detail-swiper"
                  :class="{
                    'project-detail-swiper--info-ready':
                      carouselInfoReady.has(index)
                  }"
                  tabindex="0"
                  :modules="swiperModules"
                  :slides-per-view="swiperSlidesPerView"
                  :space-between="swiperSpaceBetween"
                  :grab-cursor="false"
                  :mousewheel="swiperMousewheel"
                  :keyboard="{ enabled: true, onlyInViewport: false }"
                  :pagination="swiperPagination"
                  role="region"
                  aria-roledescription="carrusel"
                  :aria-label="`Galería horizontal de ${project.title}`"
                  @swiper="(s) => onSwiperInit(s, index)"
                >
                  <SwiperSlide
                    v-for="item in visibleSlidesForProject(project, index)"
                    :key="`${project.slug}-slide-${item.origIndex}`"
                    class="carousel-slide"
                    :class="[
                      'carousel-slide--' + item.slide.type,
                      { 'carousel-slide--hero': item.slide.isHero }
                    ]"
                  >
                    <div class="carousel-slide-parallax-layer">
                      <button
                        v-if="item.slide.type === 'image' && item.slide.isHero"
                        type="button"
                        class="slide-figure slide-figure--hero-toggle"
                        :aria-label="`Cerrar ${project.title}`"
                        @click="toggleExpand(index)"
                      >
                        <OptimizedPicture
                          :src="item.slide.src"
                          :alt="item.slide.alt || `Imagen ${item.origIndex + 1}`"
                          img-class="slide-img"
                          loading="lazy"
                        />
                      </button>
                      <figure
                        v-else-if="item.slide.type === 'image'"
                        class="slide-figure"
                      >
                        <OptimizedPicture
                          :src="item.slide.src"
                          :alt="item.slide.alt || `Imagen ${item.origIndex + 1}`"
                          img-class="slide-img"
                          loading="lazy"
                        />
                      </figure>

                      <div
                        v-else-if="item.slide.type === 'text'"
                        class="slide-text-inner"
                      >
                        <p
                          v-if="item.slide.kicker"
                          class="detail-kicker"
                          :class="'detail-kicker--v' + (item.origIndex % 4)"
                        >
                          {{ item.slide.kicker }}
                        </p>
                        <h4
                          v-if="item.slide.heading"
                          class="detail-heading"
                          :class="'detail-heading--v' + (item.origIndex % 4)"
                        >
                          {{ item.slide.heading }}
                        </h4>
                        <p
                          v-for="(para, pii) in item.slide.paragraphs"
                          :key="pii"
                          class="detail-para"
                          :class="'detail-para--tone-' + (pii % 3)"
                        >
                          {{ para }}
                        </p>
                      </div>

                      <div
                        v-else-if="item.slide.type === 'pdf-slide'"
                        class="slide-text-inner slide-text-inner--pdf-slide"
                      >
                        <p
                          v-if="item.slide.kicker"
                          class="detail-kicker"
                          :class="'detail-kicker--v' + (item.origIndex % 4)"
                        >
                          {{ item.slide.kicker }}
                        </p>
                        <h4
                          v-if="item.slide.heading"
                          class="detail-heading"
                          :class="'detail-heading--v' + (item.origIndex % 4)"
                        >
                          {{ item.slide.heading }}
                        </h4>
                        <p
                          v-for="(para, pii) in item.slide.paragraphs"
                          :key="pii"
                          class="detail-para"
                          :class="'detail-para--tone-' + (pii % 3)"
                        >
                          {{ para }}
                        </p>
                        <a
                          :href="url(item.slide.pdf.path)"
                          class="pdf-open-button"
                          target="_blank"
                          rel="noopener noreferrer"
                          @click.stop
                        >
                          <svg
                            class="pdf-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            aria-hidden="true"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                          </svg>
                          {{ item.slide.pdf.label }}
                        </a>
                      </div>

                      <div
                        v-else-if="item.slide.type === 'docs'"
                        class="slide-text-inner slide-text-inner--docs"
                      >
                        <h4
                          class="detail-heading"
                          :class="'detail-heading--v' + (index % 4)"
                        >
                          Documentación
                        </h4>
                        <p class="detail-para">
                          Planos y archivos asociados al proyecto. Podés abrirlos en una nueva pestaña.
                        </p>
                        <ul class="pdfs-list">
                          <li v-for="(pdf, pi) in project.pdfs" :key="pi">
                            <a
                              :href="url(pdf.path)"
                              class="pdf-link"
                              target="_blank"
                              rel="noopener noreferrer"
                              @click.stop
                            >
                              <svg
                                class="pdf-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                aria-hidden="true"
                              >
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                              </svg>
                              {{ pdf.label }}
                            </a>
                          </li>
                        </ul>
                        <dl class="ficha-meta">
                          <div class="detail-row">
                            <dt class="detail-label">Ubicación</dt>
                            <dd>{{ project.location }}</dd>
                          </div>
                          <div class="detail-row">
                            <dt class="detail-label">Año</dt>
                            <dd>{{ project.year }}</dd>
                          </div>
                          <div class="detail-row">
                            <dt class="detail-label">Superficie</dt>
                            <dd>{{ project.area }}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </Transition>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watch, nextTick, onUnmounted, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel, Keyboard, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { assetUrl } from '../utils/images'
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'Projects',
  components: { OptimizedPicture, Swiper, SwiperSlide },
  setup() {
    const expandedIds = ref([])
    /** Durante FLIP: el carrusel no recorta ni anima el alto en paralelo a la imagen */
    const heroFlippingIndex = ref(null)
    /** Tras el FLIP de apertura: se muestran textos y resto de slides */
    const carouselInfoReady = ref(new Set())
    const swiperInstances = ref([])

    const isExpanded = (index) => expandedIds.value.includes(index)

    const visibleSlidesForProject = (project, index) => {
      const slides = project.carouselSlides
      const mapWithIndex = (arr) =>
        arr.map((slide, origIndex) => ({ slide, origIndex }))
      if (!expandedIds.value.includes(index)) return mapWithIndex(slides)
      if (carouselInfoReady.value.has(index)) return mapWithIndex(slides)
      return mapWithIndex(slides.filter((s) => s.isHero))
    }

    const swiperModules = [Mousewheel, Keyboard, Pagination]

    const swiperPagination = {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5
    }

    const swiperMousewheel = {
      forceToAxis: true,
      sensitivity: 1,
      releaseOnEdges: true
    }

    const prefersReducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const isMobileViewport = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches

    const isMobileProjects = ref(
      typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 768px)').matches
    )
    const updateMobileProjects = () => {
      if (typeof window === 'undefined') return
      isMobileProjects.value = window.matchMedia('(max-width: 768px)').matches
    }

    const swiperSlidesPerView = computed(() =>
      isMobileProjects.value ? 1 : 'auto'
    )

    const swiperSpaceBetween = computed(() =>
      isMobileProjects.value ? 22 : 40
    )

    const onSwiperInit = (swiper, index) => {
      swiperInstances.value[index] = swiper
    }

    const onEscapeKey = (e) => {
      if (e.key === 'Escape') {
        expandedIds.value = []
        heroFlippingIndex.value = null
        carouselInfoReady.value = new Set()
      }
    }

    watch(
      expandedIds,
      (ids) => {
        document.removeEventListener('keydown', onEscapeKey)
        if (!ids.length) {
          return
        }
        document.addEventListener('keydown', onEscapeKey)
        const last = ids[ids.length - 1]
        nextTick(() => {
          requestAnimationFrame(() => {
            const sw = swiperInstances.value[last]
            sw?.el?.focus({ preventScroll: true })
          })
        })
      },
      { deep: true }
    )

    const onHeadClick = (index) => {
      if (isExpanded(index)) toggleExpand(index)
    }

    /** Duración FLIP: la info extra del carrusel aparece al terminar; 2s equilibra fluidez y espera */
    const FLIP_MS = 2000
    const FLIP_EASE = 'cubic-bezier(0.18, 0.9, 0.22, 1)'

    /**
     * El elemento `el` está en `toRect`; lo mostramos como si estuviera en `fromRect` y animamos a su posición real.
     * `onPlayStart` se llama en el mismo frame en que arranca la transición (útil para sincronizar timers).
     */
    const runFlip = (el, fromRect, toRect, onDone, onPlayStart) => {
      const done = () => {
        onDone?.()
      }
      if (prefersReducedMotion() || !el || !fromRect || !toRect) {
        done()
        return
      }
      if (
        fromRect.width < 2 ||
        fromRect.height < 2 ||
        toRect.width < 2 ||
        toRect.height < 2
      ) {
        done()
        return
      }

      const dx = fromRect.left - toRect.left
      const dy = fromRect.top - toRect.top
      const sx = fromRect.width / toRect.width
      const sy = fromRect.height / toRect.height

      el.classList.add('hero-flip-el')
      el.style.transformOrigin = 'top left'
      el.style.willChange = 'transform'
      el.style.transition = 'none'
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.setProperty(
            'transition',
            `transform ${FLIP_MS}ms ${FLIP_EASE}`,
            'important'
          )
          el.style.transform = 'none'
          onPlayStart?.()

          const cleanup = () => {
            el.classList.remove('hero-flip-el')
            el.style.removeProperty('transition')
            el.style.transform = ''
            el.style.transformOrigin = ''
            el.style.willChange = ''
          }

          let fallbackTimer = null
          const onEnd = (e) => {
            if (e.propertyName !== 'transform') return
            window.clearTimeout(fallbackTimer)
            el.removeEventListener('transitionend', onEnd)
            cleanup()
            done()
          }
          fallbackTimer = window.setTimeout(() => {
            el.removeEventListener('transitionend', onEnd)
            cleanup()
            done()
          }, FLIP_MS + 150)

          el.addEventListener('transitionend', onEnd)
        })
      })
    }

    const queryHeroToggle = (index) =>
      document.querySelector(
        `[data-project-idx="${index}"] .slide-figure--hero-toggle`
      )

    const queryThumbFrame = (index) =>
      document.querySelector(`[data-project-idx="${index}"] .project-hero-frame`)

    const revealCarouselInfoForIndex = (index) => {
      if (carouselInfoReady.value.has(index)) return
      const cr = new Set(carouselInfoReady.value)
      cr.add(index)
      carouselInfoReady.value = cr
      nextTick(() => {
        const sw = swiperInstances.value[index]
        sw?.slideTo(0, 0)
        sw?.update()
        window.setTimeout(() => sw?.update(), 80)
      })
    }

    const runOpenFlip = (index, thumbRect, onDone) => {
      if (!thumbRect || prefersReducedMotion() || isMobileViewport()) {
        revealCarouselInfoForIndex(index)
        onDone?.()
        return
      }

      const tryOnce = (attempt = 0) => {
        const heroEl = queryHeroToggle(index)
        if (!heroEl) {
          if (attempt < 24) requestAnimationFrame(() => tryOnce(attempt + 1))
          else {
            revealCarouselInfoForIndex(index)
            onDone?.()
          }
          return
        }
        const heroRect = heroEl.getBoundingClientRect()
        if (heroRect.width < 8 || heroRect.height < 8) {
          if (attempt < 24) requestAnimationFrame(() => tryOnce(attempt + 1))
          else {
            revealCarouselInfoForIndex(index)
            onDone?.()
          }
          return
        }

        runFlip(heroEl, thumbRect, heroRect, () => {
          revealCarouselInfoForIndex(index)
          onDone?.()
        })
      }
      requestAnimationFrame(() => tryOnce(0))
    }

    const runCloseFlip = (index, heroRect, onDone) => {
      if (!heroRect || prefersReducedMotion() || isMobileViewport()) {
        onDone?.()
        return
      }

      const tryOnce = (attempt = 0) => {
        const frame = queryThumbFrame(index)
        if (!frame) {
          if (attempt < 24) requestAnimationFrame(() => tryOnce(attempt + 1))
          else onDone?.()
          return
        }
        const thumbRect = frame.getBoundingClientRect()
        if (thumbRect.width < 8 || thumbRect.height < 8) {
          if (attempt < 24) requestAnimationFrame(() => tryOnce(attempt + 1))
          else onDone?.()
          return
        }
        runFlip(frame, heroRect, thumbRect, onDone)
      }

      requestAnimationFrame(() => tryOnce(0))
    }

    const LOREM =
      'Texto de relleno para maquetación. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const LOREM2 =
      'Segundo párrafo de demostración. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    const projectsBase = [
      {
        slug: 'img-random',
        title: 'IMG random — galería completa',
        badge: 'Carpeta',
        category: 'Galería',
        location: '—',
        year: '2024',
        area: '—',
        uniformImages: false,
        pdfs: null,
        heroImage: '/IMG random/Imagen exterior.jpg',
        carouselPanels: [
          {
            image: '/IMG random/Imagen exterior.jpg',
            kicker: 'Vista 1 / exterior',
            heading: 'Fachada y contexto',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/IMG random/imagen interior 1.jpg',
            kicker: 'Vista 2 / interior',
            heading: 'Espacio interior',
            paragraphs: [LOREM]
          }
        ]
      },
      {
        slug: 'master-plan',
        title: 'Master plan — láminas',
        badge: 'Carpeta',
        category: 'Planificación',
        location: 'Argentina',
        year: '2024',
        area: '—',
        uniformImages: false,
        pdfs: null,
        heroImage: '/Master plan/L0.png',
        carouselPanels: [
          {
            image: '/Master plan/L0.png',
            kicker: 'L0',
            heading: 'Suelo y trama base',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/Master plan/L1.png',
            kicker: 'L1',
            heading: 'Nivel intermedio',
            paragraphs: [LOREM]
          },
          {
            image: '/Master plan/L2.png',
            kicker: 'L2',
            heading: 'Densidad programática',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/Master plan/L3.png',
            kicker: 'L3',
            heading: 'Cubierta y equipamiento',
            paragraphs: [LOREM]
          }
        ]
      },
      {
        slug: 'mediateca',
        title: 'Mediateca — imágenes y PDFs',
        badge: 'Carpeta',
        category: 'Proyecto',
        location: 'Buenos Aires, Argentina',
        year: '2024',
        area: '—',
        uniformImages: false,
        pdfs: null,
        heroImage: '/Mediateca/imagen 01 axo aerea.jpg',
        carouselPanels: [
          {
            image: '/Mediateca/imagen 01 axo aerea.jpg',
            kicker: 'Vista 1',
            heading: 'Axonométrica general',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/Mediateca/imagen 02.jpg',
            kicker: 'Vista 2',
            heading: 'Interior',
            paragraphs: [LOREM]
          },
          {
            kicker: 'Plano',
            heading: 'Corte A.A (PDF)',
            paragraphs: [LOREM],
            pdfLink: {
              label: 'Abrir PDF — Corte A.A',
              path: '/Mediateca/CORTE A.A - IND.pdf'
            }
          },
          {
            kicker: 'Plano',
            heading: 'Nivel 2 (PDF)',
            paragraphs: [LOREM],
            pdfLink: {
              label: 'Abrir PDF — Nivel 2',
              path: '/Mediateca/NIVEL 2 TP IND - FINAL .pdf'
            }
          },
          {
            kicker: 'Plano',
            heading: 'Planta baja (PDF)',
            paragraphs: [LOREM],
            pdfLink: {
              label: 'Abrir PDF — Planta baja',
              path: '/Mediateca/PLANTA BAJA TP IND - FINAL .pdf'
            }
          }
        ]
      },
      {
        slug: 'demo-uniforme-a',
        title: 'Demo — mismo tamaño A',
        badge: 'Uniforme',
        category: 'Demostración',
        location: '—',
        year: '2024',
        area: '—',
        uniformImages: true,
        pdfs: null,
        heroImage: '/IMG random/Imagen exterior.jpg',
        carouselPanels: [
          {
            image: '/IMG random/Imagen exterior.jpg',
            kicker: 'Toma A',
            heading: 'Encuadre fijo 3∶2',
            paragraphs: [LOREM]
          },
          {
            image: '/IMG random/imagen interior 1.jpg',
            kicker: 'Toma B',
            heading: 'Misma caja, otra imagen',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/IMG random/Imagen exterior.jpg',
            kicker: 'Toma C',
            heading: 'Continuidad visual',
            paragraphs: [LOREM]
          },
          {
            image: '/IMG random/imagen interior 1.jpg',
            kicker: 'Toma D',
            heading: 'Cierre de serie',
            paragraphs: [LOREM]
          }
        ]
      },
      {
        slug: 'demo-uniforme-b',
        title: 'Demo — mismo tamaño B',
        badge: 'Uniforme',
        category: 'Demostración',
        location: '—',
        year: '2024',
        area: '—',
        uniformImages: true,
        pdfs: null,
        heroImage: '/IMG random/imagen interior 1.jpg',
        carouselPanels: [
          {
            image: '/IMG random/imagen interior 1.jpg',
            kicker: 'Serie 1',
            heading: 'Rectángulos alineados',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/IMG random/Imagen exterior.jpg',
            kicker: 'Serie 2',
            heading: 'Misma grilla horizontal',
            paragraphs: [LOREM]
          },
          {
            image: '/IMG random/imagen interior 1.jpg',
            kicker: 'Serie 3',
            heading: 'Carrusel homogéneo',
            paragraphs: [LOREM]
          },
          {
            image: '/IMG random/Imagen exterior.jpg',
            kicker: 'Serie 4',
            heading: 'Última vista',
            paragraphs: [LOREM, LOREM2]
          }
        ]
      }
    ]

    const buildSlidesFromPanels = (p) => {
      const out = []
      for (const panel of p.carouselPanels) {
        if (panel.image) {
          out.push({
            type: 'image',
            src: panel.image,
            alt: panel.heading || 'Vista'
          })
        }
        if (panel.pdfLink) {
          out.push({
            type: 'pdf-slide',
            pdf: panel.pdfLink,
            kicker: panel.kicker,
            heading: panel.heading,
            paragraphs: panel.paragraphs || []
          })
          continue
        }
        out.push({
          type: 'text',
          kicker: panel.kicker,
          heading: panel.heading,
          paragraphs: panel.paragraphs || []
        })
      }
      if (p.pdfs && p.pdfs.length) {
        out.push({ type: 'docs' })
      }
      return out
    }

    const buildCarouselSlides = (p) => {
      const base = buildSlidesFromPanels(p)
      const heroSlide = {
        type: 'image',
        src: p.heroImage,
        alt: p.title,
        isHero: true
      }
      const skipFirst =
        base.length > 0 &&
        base[0].type === 'image' &&
        base[0].src === p.heroImage
      const rest = skipFirst ? base.slice(1) : base
      return [heroSlide, ...rest]
    }

    const projects = projectsBase.map((proj) => ({
      ...proj,
      slides: buildSlidesFromPanels(proj),
      carouselSlides: buildCarouselSlides(proj)
    }))

    /** En móvil el carrusel debe verse sin paso extra de “tocar para abrir” */
    const expandAllMobile = () => {
      if (!isMobileProjects.value) return
      const n = projects.length
      expandedIds.value = Array.from({ length: n }, (_, i) => i)
      carouselInfoReady.value = new Set(Array.from({ length: n }, (_, i) => i))
      nextTick(() => {
        requestAnimationFrame(() => {
          swiperInstances.value.forEach((sw) => {
            sw?.slideTo?.(0, 0)
            sw?.update?.()
          })
          window.setTimeout(() => {
            swiperInstances.value.forEach((sw) => sw?.update?.())
          }, 150)
        })
      })
    }

    watch(isMobileProjects, (mobile) => {
      nextTick(() => {
        if (mobile) {
          expandAllMobile()
        } else {
          expandedIds.value = []
          carouselInfoReady.value = new Set()
          heroFlippingIndex.value = null
        }
        swiperInstances.value.forEach((sw) => {
          sw?.update?.()
        })
      })
    })

    const CAROUSEL_EXPAND_MS = FLIP_MS

    const toggleExpand = (index) => {
      const wasOpen = expandedIds.value.includes(index)

      if (!wasOpen) {
        const thumb = queryThumbFrame(index)
        const thumbRect = thumb?.getBoundingClientRect()
        {
          const cr = new Set(carouselInfoReady.value)
          cr.delete(index)
          carouselInfoReady.value = cr
        }
        if (!prefersReducedMotion() && !isMobileViewport()) {
          heroFlippingIndex.value = index
        }
        expandedIds.value = [...new Set([...expandedIds.value, index])]
        nextTick(() => {
          runOpenFlip(index, thumbRect, () => {
            heroFlippingIndex.value = null
          })
          requestAnimationFrame(() => {
            const sw = swiperInstances.value[index]
            if (sw) {
              sw.slideTo(0, 0)
              sw.update()
              window.setTimeout(() => sw.update(), CAROUSEL_EXPAND_MS + 250)
            }
          })
        })
        return
      }

      {
        const cr = new Set(carouselInfoReady.value)
        cr.delete(index)
        carouselInfoReady.value = cr
      }

      if (prefersReducedMotion() || isMobileViewport()) {
        expandedIds.value = expandedIds.value.filter((i) => i !== index)
        heroFlippingIndex.value = null
        return
      }

      nextTick(() => {
        requestAnimationFrame(() => {
          const heroEl = queryHeroToggle(index)
          const heroRect = heroEl?.getBoundingClientRect()
          if (!heroRect || heroRect.width < 8 || heroRect.height < 8) {
            expandedIds.value = expandedIds.value.filter((i) => i !== index)
            heroFlippingIndex.value = null
            return
          }
          heroFlippingIndex.value = index
          expandedIds.value = expandedIds.value.filter((i) => i !== index)
          nextTick(() => {
            runCloseFlip(index, heroRect, () => {
              heroFlippingIndex.value = null
            })
          })
        })
      })
    }

    onMounted(() => {
      updateMobileProjects()
      window.addEventListener('resize', updateMobileProjects, { passive: true })
      nextTick(() => {
        if (isMobileProjects.value) expandAllMobile()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateMobileProjects)
      document.removeEventListener('keydown', onEscapeKey)
      document.body.style.overflow = ''
    })

    return {
      projects,
      isExpanded,
      heroFlippingIndex,
      carouselInfoReady,
      visibleSlidesForProject,
      toggleExpand,
      onHeadClick,
      swiperModules,
      swiperPagination,
      swiperSlidesPerView,
      swiperSpaceBetween,
      swiperMousewheel,
      onSwiperInit,
      url: assetUrl
    }
  }
}
</script>

<style scoped>
.projects {
  padding: 6rem 0;
  background: transparent;
}

.section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3rem;
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
  font-family: var(--font-sans);
  font-size: 2.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  color: var(--text-light);
  font-size: 1.05rem;
  line-height: 1.75;
}

.projects-stack-wrap {
  width: 100%;
  margin-top: 1rem;
}

.projects-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3.25rem;
}

.project-block {
  scroll-margin-top: 5rem;
  padding: 0.75rem 0 1.5rem;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.project-block:last-child {
  border-bottom: none;
}

.project-block-head {
  max-width: 1400px;
  margin: 0 auto 1.25rem;
  padding: 0 2rem;
}

.project-block-head--collapse {
  cursor: pointer;
  user-select: none;
}

.strip-badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-light);
  display: block;
  margin-bottom: 0.35rem;
}

.strip-title {
  font-family: var(--font-sans);
  font-size: 0.98rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--text-dark);
  margin: 0 0 0.35rem;
  line-height: 1.35;
}

.strip-meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-light);
  letter-spacing: 0.03em;
}

/* Contenedor: miniatura 400×300; expandido crece mucho + animación visible */
.project-body {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  --hero-w: 260px;
  --hero-h: 195px;
  --carousel-h: 260px;
  --hero-expand-duration: 2s;
  --hero-expand-ease: cubic-bezier(0.18, 0.9, 0.22, 1);
  --hero-open-duration: 2s;
  --hero-open-ease: cubic-bezier(0.18, 0.9, 0.22, 1);
}

.project-body.is-expanded {
  --carousel-h: min(420px, 68vw);
}

/* Tres columnas: texto | imagen (centrada en la página) | hueco espejo → la foto queda en el eje vertical central */
.project-collapsed-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.25rem);
  width: 100%;
}

.project-block-head--beside {
  grid-column: 1;
  justify-self: end;
  margin: 0;
  padding: 0;
  max-width: min(300px, 36vw);
  text-align: right;
  align-self: center;
}

.project-collapsed-spacer {
  grid-column: 3;
  min-width: 0;
  pointer-events: none;
}

.project-body:not(.is-expanded) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.project-body.is-expanded {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.project-hero-col {
  grid-column: 2;
  justify-self: center;
  flex-shrink: 0;
  transition:
    width var(--hero-expand-duration) var(--hero-expand-ease),
    flex-basis var(--hero-expand-duration) var(--hero-expand-ease),
    max-width var(--hero-expand-duration) var(--hero-expand-ease);
}

/* Miniatura: tamaño base por variables */
.project-body:not(.is-expanded) .project-hero-col {
  width: var(--hero-w);
  max-width: min(var(--hero-w), 100%);
}

.project-body:not(.is-expanded) .project-hero-frame {
  width: var(--hero-w);
  max-width: 100%;
  height: var(--hero-h);
  box-sizing: border-box;
}

.project-body:not(.is-expanded) .project-hero-img,
.project-body:not(.is-expanded) .project-hero :deep(img) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}

.project-hero {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: zoom-in;
  text-align: center;
}

.project-hero-frame {
  border-radius: 4px;
  overflow: hidden; /* el img va contenido dentro; no recortar con cover */
  background: transparent;
  transition:
    box-shadow var(--hero-expand-duration) var(--hero-expand-ease),
    width var(--hero-expand-duration) var(--hero-expand-ease),
    height var(--hero-expand-duration) var(--hero-expand-ease),
    max-width var(--hero-expand-duration) var(--hero-expand-ease),
    max-height var(--hero-expand-duration) var(--hero-expand-ease);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-hero :deep(picture) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0;
  background: transparent;
}

/* Ver imagen completa: no forzar 100%×100% en el img (evita sensación de zoom/crop) */
.project-hero-img,
.project-hero :deep(img) {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  transition:
    max-height var(--hero-expand-duration) var(--hero-expand-ease),
    max-width var(--hero-expand-duration) var(--hero-expand-ease);
}

/* Panel expandido: solo carrusel (textos e imágenes en slides) */
.project-detail-outer {
  flex: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  position: relative;
}

/* Swiper: bullets abajo; arrastre y rueda vía módulos */
.project-detail-swiper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: var(--carousel-h);
  max-height: var(--carousel-h);
  overflow: visible;
  touch-action: pan-x;
  outline: none;
  cursor: pointer;
  padding: 0 0 2.35rem;
  box-sizing: border-box;
  transition:
    height var(--hero-expand-duration) var(--hero-expand-ease),
    max-height var(--hero-expand-duration) var(--hero-expand-ease);
}

.project-detail-swiper :deep(.swiper-pagination) {
  bottom: 0.15rem !important;
  line-height: 1;
}

.project-detail-swiper :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: var(--color-slate);
  opacity: 0.35;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.project-detail-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: var(--color-forest);
  transform: scale(1.15);
}

.project-detail-swiper :deep(.swiper-pagination-bullet-active-main) {
  background: var(--color-ink);
}

.carousel-slide-parallax-layer {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.carousel-slide--text .carousel-slide-parallax-layer,
.carousel-slide--docs .carousel-slide-parallax-layer,
.carousel-slide--pdf-slide .carousel-slide-parallax-layer {
  align-items: stretch;
  justify-content: flex-start;
}

.project-detail-swiper :deep(.swiper) {
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer !important;
}

.project-detail-swiper :deep(.swiper),
.project-detail-swiper :deep(.swiper-wrapper) {
  height: 100%;
}

.project-detail-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
  box-sizing: border-box;
}

.project-detail-swiper :deep(.swiper-slide) {
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  align-self: stretch;
}

/* Texto / docs / pdf-slide: ancho fijo tipo columna */
.project-detail-swiper :deep(.swiper-slide.carousel-slide--text),
.project-detail-swiper :deep(.swiper-slide.carousel-slide--docs),
.project-detail-swiper :deep(.swiper-slide.carousel-slide--pdf-slide) {
  width: min(320px, 50vw) !important;
  max-width: 360px;
  flex-shrink: 0;
}

/* Imágenes: ancho según proporción a alto completo del carrusel (no igual al texto) */
.project-detail-swiper
  :deep(.swiper-slide.carousel-slide--image:not(.carousel-slide--hero)) {
  width: max-content !important;
  max-width: min(88vw, 620px);
  flex-shrink: 0;
}

.project-detail-swiper :deep(.swiper-slide.carousel-slide--hero) {
  width: auto;
  max-width: min(380px, 78vw);
  flex-shrink: 0;
}

/* Demos: todas las imágenes del carrusel con el mismo encuadre (3∶2) */
.project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image img),
.project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image .slide-img) {
  width: min(360px, 62vw) !important;
  height: min(240px, 42vw) !important;
  max-width: min(360px, 88vw) !important;
  max-height: min(240px, 55vh) !important;
  object-fit: cover !important;
}

/* Transición FLIP (translate+scale) desde JS; sin keyframes para no pisar transform */

@media (prefers-reduced-motion: reduce) {
  .project-detail-swiper {
    transition: none;
  }
}

.hero-flip-el {
  z-index: 25;
  position: relative;
}

/* Cierre: el FLIP anima transform en este nodo; no poner transition:none (anulaba la animación) */
.project-hero-frame.hero-flip-el {
  overflow: visible;
}

.project-detail-swiper :deep(.slide-figure--hero-toggle.hero-flip-el) {
  backface-visibility: hidden;
}

/*
 * Durante FLIP: Swiper suele usar overflow:hidden y la altura del carrusel animaba
 * en la misma duración que el transform → recorte y rect “en movimiento”.
 * Aquí se congela la transición de alto y se permite overflow visible solo en esta fase.
 */
.project-detail-outer--flip .project-detail-swiper {
  overflow: visible !important;
  transition: none !important;
}

.project-detail-outer--flip .project-detail-swiper :deep(.swiper),
.project-detail-outer--flip .project-detail-swiper :deep(.swiper-wrapper) {
  overflow: visible !important;
}

.project-detail-outer--flip .project-detail-swiper :deep(.swiper-slide) {
  overflow: visible !important;
}

.project-detail-outer--flip .carousel-slide--image {
  overflow: visible !important;
}

/* Cierre: la miniatura no recorta la animación hacia el origen */
.project-block--hero-flip:not(.is-expanded) .project-collapsed-layout,
.project-block--hero-flip:not(.is-expanded) .project-hero-col,
.project-block--hero-flip:not(.is-expanded) .project-hero {
  overflow: visible;
}

.project-block--hero-flip:not(.is-expanded) .project-hero-frame {
  overflow: visible !important;
}

.project-detail-swiper:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.carousel-slide {
  height: 100%;
  box-sizing: border-box;
}

.carousel-slide--image {
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  border: none;
}

.slide-figure {
  margin: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Imágenes del carrusel: siempre alto = 100% del carrusel (misma lectura que el hero) */
.carousel-slide--image .slide-figure,
.carousel-slide--image .slide-figure--hero-toggle {
  height: 100%;
  min-height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.carousel-slide--image .slide-figure :deep(picture),
.carousel-slide--image .slide-figure--hero-toggle :deep(picture) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 100%;
  width: max-content;
  max-width: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0;
}

.project-detail-swiper :deep(.carousel-slide--image img),
.project-detail-swiper :deep(.carousel-slide--image .slide-img) {
  display: block;
  object-fit: contain;
  object-position: center !important;
  width: auto;
  height: auto;
  max-width: min(400px, 74vw);
  max-height: min(300px, 48vh);
}

.project-detail-swiper
  :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image img) {
  max-width: 100% !important;
  max-height: 100% !important;
}

.slide-figure--hero-toggle {
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: inherit;
}

.slide-figure--hero-toggle:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 3px;
}

.slide-figure :deep(picture) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0;
}

/* Texto / docs: imágenes internas (iconos PDF, etc.) */
.slide-text-inner .slide-img,
.slide-text-inner img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.carousel-slide--text,
.carousel-slide--docs,
.carousel-slide--pdf-slide {
  background: transparent;
}

.slide-text-inner {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  touch-action: pan-y;
  padding: 0.35rem 0.5rem 0.85rem 0;
  box-sizing: border-box;
  background: transparent;
  scrollbar-width: thin;
  scrollbar-color: rgba(13, 148, 136, 0.35) transparent;
}

.slide-text-inner::-webkit-scrollbar {
  width: 5px;
}

.slide-text-inner::-webkit-scrollbar-thumb {
  background: rgba(13, 148, 136, 0.28);
  border-radius: 3px;
}

.slide-text-inner--docs {
  background: transparent;
}

.slide-text-inner--pdf-slide {
  background: transparent;
}

.pdf-open-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.65rem 1.1rem;
  border-radius: 6px;
  background: var(--color-forest);
  color: var(--white) !important;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  transition: filter 0.2s ease, transform 0.15s ease, background 0.2s ease;
}

.pdf-open-button:hover {
  background: var(--color-slate);
  color: var(--white) !important;
}

.pdf-open-button .pdf-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke: currentColor;
}

.detail-kicker {
  margin: 0 0 0.4rem;
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.62rem;
  color: var(--text-muted);
}

.detail-kicker--v0 {
  font-family: var(--font-sans);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.detail-kicker--v1 {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--text-light);
}

.detail-kicker--v2 {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.detail-kicker--v3 {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-light);
}

.detail-heading {
  font-family: var(--font-sans);
  font-size: 1.125rem;
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--primary-color);
  margin: 0 0 0.65rem;
  line-height: 1.4;
}

.detail-heading--v0 {
  font-family: var(--font-sans);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary-color);
}

.detail-heading--v1 {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--text-light);
}

.detail-heading--v2 {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0;
  color: var(--text-dark);
}

.detail-heading--v3 {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0.01em;
  color: var(--text-light);
}

.detail-para {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.78;
  color: var(--text-dark);
}

/* Ritmo al deslizar: tres tonos/tamaños que se repiten */
.detail-para--tone-0 {
  font-size: 1rem;
  color: var(--color-deep);
  font-weight: 400;
}

.detail-para--tone-1 {
  font-size: 0.88rem;
  color: var(--color-slate);
  line-height: 1.85;
  font-weight: 400;
}

.detail-para--tone-2 {
  font-size: 1.05rem;
  color: var(--color-forest);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.detail-para:last-child {
  margin-bottom: 0;
}

.pdfs-list {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}

.pdfs-list li {
  margin-bottom: 0.5rem;
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.pdf-link:hover {
  color: var(--primary-color);
}

.pdf-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.ficha-meta {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-dark);
}

.detail-row dd {
  margin: 0;
}

.detail-label {
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: var(--text-light);
}

.detail-reveal-enter-active {
  transition: none;
}

.detail-reveal-leave-active {
  transition: opacity 0.36s ease;
}

.detail-reveal-enter-from,
.detail-reveal-enter-to {
  opacity: 1;
}

.detail-reveal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .projects {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.85rem;
  }

  .project-block {
    scroll-margin-top: 4.25rem;
    padding: 2rem 0 2.5rem;
  }

  .project-block-head,
  .project-body {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .project-collapsed-layout {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.85rem;
  }

  .project-block-head--beside {
    grid-column: 1;
    justify-self: center;
    max-width: 100%;
    text-align: center;
  }

  .project-hero-col {
    grid-column: 1;
  }

  .project-collapsed-spacer {
    display: none;
  }

  .project-body:not(.is-expanded) .project-hero-col,
  .project-body:not(.is-expanded) .project-hero-frame {
    width: min(260px, 100%);
  }

  .project-body:not(.is-expanded) .project-hero-frame {
    height: auto;
    aspect-ratio: 260 / 195;
    min-height: 0;
  }

  .project-body:not(.is-expanded) .project-hero-img,
  .project-body:not(.is-expanded) .project-hero :deep(img) {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .project-body.is-expanded {
    --carousel-h: min(420px, 58vh);
  }

  .project-detail-swiper {
    padding: 0 0 2.1rem;
    height: var(--carousel-h);
    max-height: var(--carousel-h);
  }

  .projects-stack-wrap,
  .projects-stack,
  .project-block {
    max-width: 100%;
    overflow-x: hidden;
  }

  .project-body {
    max-width: 100%;
    overflow-x: hidden;
    min-width: 0;
  }

  .project-detail-outer {
    max-width: 100%;
    overflow-x: hidden;
    min-width: 0;
  }

  .project-detail-swiper {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding-left: 0;
    padding-right: 0;
  }

  .project-detail-swiper :deep(.swiper) {
    max-width: 100%;
    overflow: hidden;
  }

  .project-detail-swiper :deep(.swiper-slide) {
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--image:not(.carousel-slide--hero)) {
    width: 100% !important;
    max-width: 100% !important;
  }

  .project-detail-swiper :deep(.swiper-slide.carousel-slide--hero) {
    width: 100% !important;
    max-width: 100% !important;
  }

  .project-detail-swiper :deep(.carousel-slide--image img),
  .project-detail-swiper :deep(.carousel-slide--image .slide-img) {
    max-width: 100% !important;
    width: 100% !important;
    height: auto !important;
    max-height: min(52vh, 360px) !important;
    object-fit: contain !important;
  }

  .project-detail-swiper :deep(.swiper-pagination) {
    position: relative;
    bottom: auto !important;
    margin-top: 0.75rem;
  }
}
</style>

<style>
#proyectos .project-block {
  scroll-margin-top: 5rem;
}

@media (max-width: 768px) {
  #proyectos .project-block {
    scroll-margin-top: 4.25rem;
  }
}
</style>
