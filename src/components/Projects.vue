<template>
  <section id="proyectos" class="projects">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Portfolio</span>
        <h2 class="section-title">Proyectos</h2>
        <p class="section-subtitle">
          Tocá la miniatura para abrir el carrusel; podés dejar varios proyectos expandidos a la vez. En móvil, tocá el título o la primera imagen para cerrar cada uno. Escape cierra todos los detalles abiertos.
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
            'is-expanded': hasExpandedDetail(index),
            'project-block--hero-flip': heroFlippingIndex === index,
            'project-block--uniform-images': project.uniformImages
          }"
          :data-project-idx="index"
          role="listitem"
        >
          <header
            v-if="isPrimaryExpanded(index)"
            class="project-block-head"
            :class="{ 'project-block-head--collapse': isPrimaryExpanded(index) }"
            @click="onHeadClick(index)"
          >
            <ProjectLogoMark :glyph="project.logoGlyph" class="project-block-head__logo" />
            <h3 class="strip-title">{{ project.title }}</h3>
            <p class="strip-meta">{{ project.location }} · {{ project.category }}</p>
          </header>

          <div
            class="project-body"
            :class="{
              'is-expanded': hasExpandedDetail(index)
            }"
          >
            <div
              v-if="!hasExpandedDetail(index)"
              class="project-collapsed-layout"
            >
              <header class="project-block-head project-block-head--beside">
                <ProjectLogoMark :glyph="project.logoGlyph" class="project-block-head__logo" />
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
              :duration="{ enter: 0, leave: 260 }"
            >
              <div
                v-show="hasExpandedDetail(index)"
                class="project-detail-outer"
                :class="{
                  'project-detail-outer--flip': heroFlippingIndex === index,
                  'project-detail-outer--accordion-leave':
                    leavingExpandedIndex === index
                }"
              >
                <Swiper
                  :key="`carousel-${index}-${isMobileProjects}`"
                  class="project-detail-swiper"
                  :class="{
                    'project-detail-swiper--info-ready':
                      carouselInfoReady.has(index)
                  }"
                  tabindex="0"
                  :modules="swiperModules"
                  :slides-per-view="swiperSlidesPerView"
                  :space-between="swiperSpaceBetween"
                  :pagination="swiperPagination"
                  :auto-height="swiperAutoHeight"
                  :grab-cursor="swiperGrabCursor"
                  :mousewheel="swiperMousewheel"
                  :free-mode="swiperFreeMode"
                  :keyboard="{ enabled: true, onlyInViewport: false }"
                  role="region"
                  aria-roledescription="carrusel"
                  :aria-label="`Galería horizontal de ${project.title}`"
                  @swiper="(s) => onSwiperInit(s, index)"
                  @slide-change="onCarouselSlideChange"
                >
                  <SwiperSlide
                    v-for="item in visibleSlidesForProject(project, index)"
                    :key="`${project.slug}-slide-${item.origIndex}`"
                    class="carousel-slide"
                      :class="[
                      'carousel-slide--' + item.slide.type,
                      {
                        'carousel-slide--hero': item.slide.isHero,
                        'carousel-slide--dual-with-side-text':
                          item.slide.type === 'dual-image-sequence' &&
                          item.slide.sideText,
                        'carousel-slide--sequence-tall':
                          (item.slide.type === 'image-sequence' &&
                            item.slide.sequenceTall) ||
                          (item.slide.type === 'dual-image-sequence' &&
                            item.slide.sequenceTall)
                      }
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

                      <figure
                        v-else-if="item.slide.type === 'image-sequence'"
                        class="slide-figure slide-figure--inner-sequence"
                      >
                        <ImageSequencePlayer
                          :images="item.slide.images"
                          :alt-base="item.slide.alt || 'Vista'"
                          :interval-ms="2000"
                        />
                      </figure>

                      <div
                        v-else-if="
                          item.slide.type === 'dual-image-sequence' &&
                          item.slide.sideText
                        "
                        class="slide-dual-with-side-text"
                      >
                        <figure
                          class="slide-figure slide-figure--dual-sequence slide-figure--dual-with-side-text"
                        >
                          <PairedDualColumnsPlayer
                            v-if="item.slide.variant === 'sync-pairs'"
                            :pairs="item.slide.pairs"
                            :left-label="item.slide.leftLabel"
                            :right-label="item.slide.rightLabel"
                            alt-left="Detalle constructivo"
                            alt-right="Gráfico"
                            :interval-ms="2000"
                            :graphic-mini-left-align-bottom="
                              item.slide.graphicMiniLeftAlignBottom
                            "
                          />
                        </figure>
                        <div class="slide-text-inner slide-text-inner--beside">
                          <h4
                            v-if="item.slide.sideText.heading"
                            class="detail-heading detail-heading--v1"
                          >
                            {{ item.slide.sideText.heading }}
                          </h4>
                          <p
                            v-for="(para, pii) in item.slide.sideText.paragraphs"
                            :key="pii"
                            class="detail-para"
                          >
                            {{ para }}
                          </p>
                        </div>
                      </div>

                      <figure
                        v-else-if="item.slide.type === 'dual-image-sequence'"
                        class="slide-figure slide-figure--dual-sequence"
                      >
                        <PairedDualColumnsPlayer
                          v-if="item.slide.variant === 'sync-pairs'"
                          :pairs="item.slide.pairs"
                          :left-label="item.slide.leftLabel"
                          :right-label="item.slide.rightLabel"
                          alt-left="Detalle constructivo"
                          alt-right="Gráfico"
                          :interval-ms="2000"
                          :graphic-mini-left-align-bottom="
                            item.slide.graphicMiniLeftAlignBottom
                          "
                        />
                        <div
                          v-else
                          class="dual-sequence-grid"
                          role="group"
                        >
                          <div
                            v-for="(col, dci) in item.slide.columns"
                            :key="dci"
                            class="dual-sequence-col"
                          >
                            <h4
                              v-if="col.label"
                              class="detail-heading detail-heading--v1 dual-sequence-col__label"
                            >
                              {{ col.label }}
                            </h4>
                            <ImageSequencePlayer
                              :images="col.images"
                              :alt-base="col.altBase || 'Vista'"
                              :interval-ms="2000"
                            />
                          </div>
                        </div>
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
                          :class="
                            item.slide.isSideTextSplit
                              ? 'detail-heading--v1'
                              : 'detail-heading--v' + (item.origIndex % 4)
                          "
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
import { Mousewheel, Keyboard, Pagination, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { assetUrl } from '../utils/images'
import OptimizedPicture from './OptimizedPicture.vue'
import ImageSequencePlayer from './ImageSequencePlayer.vue'
import PairedDualColumnsPlayer from './PairedDualColumnsPlayer.vue'
import ProjectLogoMark from './ProjectLogoMark.vue'

export default {
  name: 'Projects',
  components: {
    OptimizedPicture,
    ImageSequencePlayer,
    PairedDualColumnsPlayer,
    ProjectLogoMark,
    Swiper,
    SwiperSlide
  },
  setup() {
    const expandedIds = ref([])
    /** Durante FLIP: el carrusel no recorta ni anima el alto en paralelo a la imagen */
    const heroFlippingIndex = ref(null)
    /** Tras el FLIP de apertura: se muestran textos y resto de slides */
    const carouselInfoReady = ref(new Set())
    const swiperInstances = ref([])
    /** Animación de cierre (FLIP) del panel */
    const leavingExpandedIndex = ref(null)

    const isPrimaryExpanded = (index) => expandedIds.value.includes(index)

    const hasExpandedDetail = (index) =>
      expandedIds.value.includes(index) ||
      leavingExpandedIndex.value === index

    const expandSideTextSlidesForMobile = (slides) => {
      if (!isMobileProjects.value) return slides
      return slides.flatMap((slide) => {
        if (slide.type === 'dual-image-sequence' && slide.sideText) {
          const { sideText, ...dualOnly } = slide
          return [
            dualOnly,
            {
              type: 'text',
              heading: sideText.heading,
              paragraphs: sideText.paragraphs,
              isSideTextSplit: true
            }
          ]
        }
        return [slide]
      })
    }

    const visibleSlidesForProject = (project, index) => {
      const slides = expandSideTextSlidesForMobile(project.carouselSlides)
      const mapWithIndex = (arr) =>
        arr.map((slide, origIndex) => ({ slide, origIndex }))
      if (!hasExpandedDetail(index)) return mapWithIndex(slides)
      if (
        carouselInfoReady.value.has(index) ||
        leavingExpandedIndex.value === index
      ) {
        return mapWithIndex(slides)
      }
      return mapWithIndex(slides.filter((s) => s.isHero))
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

    const swiperModules = computed(() => {
      const mods = [Mousewheel, Keyboard, FreeMode]
      if (isMobileProjects.value) mods.push(Pagination)
      return mods
    })

    /**
     * Desktop: el scroll (rueda/trackpad) mueve el carril de forma continua,
     * como un rollo — sin "saltar" de slide en slide. Se frena donde el
     * usuario suelta, con una leve inercia (momentum) al soltar.
     */
    const swiperFreeMode = computed(() =>
      isMobileProjects.value
        ? false
        : { enabled: true, sticky: false, momentum: true, momentumBounce: false }
    )

    /** Solo móvil: bullets debajo del carrusel */
    const swiperPagination = computed(() =>
      isMobileProjects.value ? { clickable: true } : false
    )

    const swiperSlidesPerView = computed(() =>
      isMobileProjects.value ? 1 : 'auto'
    )

    /* Desktop: aire entre slides. Móvil: 0 para que cada slide sea 100% del carril (sin ancho tipo max-content). */
    const swiperSpaceBetween = computed(() =>
      isMobileProjects.value ? 0 : 10
    )

    /** Falso: el alto lo fija CSS (--carousel-h); así los slides de texto miden lo mismo que las imágenes y el texto puede centrarse en vertical */
    const swiperAutoHeight = computed(() => false)

    const swiperGrabCursor = computed(() => isMobileProjects.value)

    const onCarouselSlideChange = (swiper) => {
      if (!isMobileProjects.value) return
      swiper?.updateAutoHeight?.(0)
    }

    const onSwiperInit = (swiper, index) => {
      swiperInstances.value[index] = swiper
      nextTick(() => {
        if (isMobileProjects.value) {
          swiper?.updateAutoHeight?.(0)
        }
      })
    }

    const onEscapeKey = (e) => {
      if (e.key === 'Escape') {
        expandedIds.value = []
        heroFlippingIndex.value = null
        carouselInfoReady.value = new Set()
        leavingExpandedIndex.value = null
      }
    }

    const syncEscapeListener = () => {
      document.removeEventListener('keydown', onEscapeKey)
      const hasOpenUi =
        expandedIds.value.length > 0 || leavingExpandedIndex.value !== null
      if (!hasOpenUi) {
        return
      }
      document.addEventListener('keydown', onEscapeKey)
      const last = expandedIds.value[expandedIds.value.length - 1]
      if (last === undefined) {
        return
      }
      nextTick(() => {
        requestAnimationFrame(() => {
          const sw = swiperInstances.value[last]
          sw?.el?.focus({ preventScroll: true })
        })
      })
    }

    watch(expandedIds, syncEscapeListener, { deep: true })
    watch(leavingExpandedIndex, syncEscapeListener)

    const onHeadClick = (index) => {
      if (isPrimaryExpanded(index)) toggleExpand(index)
    }

    /** Duración FLIP: la info extra del carrusel aparece al terminar */
    const FLIP_MS = 1100
    const FLIP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

    /**
     * Aplica de inmediato (sin transición) la transformación que hace que `el`
     * —ya ubicado en `toRect`— se vea como si estuviera en `fromRect`. Debe
     * llamarse de forma síncrona, en el mismo tick que se mide `toRect`, para
     * que el navegador nunca llegue a pintar el tamaño final sin transformar.
     */
    const primeFlipTransform = (el, fromRect, toRect) => {
      if (
        !el ||
        !fromRect ||
        !toRect ||
        fromRect.width < 2 ||
        fromRect.height < 2 ||
        toRect.width < 2 ||
        toRect.height < 2
      ) {
        return false
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
      return true
    }

    /** Anima `el` (ya "primed") de vuelta a su posición real (`transform: none`). */
    const playFlipTransform = (el, onDone) => {
      const done = () => onDone?.()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.setProperty(
            'transition',
            `transform ${FLIP_MS}ms ${FLIP_EASE}`,
            'important'
          )
          el.style.transform = 'none'

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

    /** FLIP completo (prime + play) sin fase intermedia; usado por el cierre. */
    const runFlip = (el, fromRect, toRect, onDone) => {
      if (prefersReducedMotion() || !primeFlipTransform(el, fromRect, toRect)) {
        onDone?.()
        return
      }
      playFlipTransform(el, onDone)
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

    /**
     * Encuentra el hero del carrusel recién expandido y lo "primea" (salto
     * instantáneo a la posición/tamaño de la miniatura) de forma síncrona,
     * antes de que se dispare cualquier scroll. Así la imagen nunca se ve en
     * su tamaño final antes de tiempo (sin flash ni rebote).
     * Resuelve con el elemento primado, o `null` si no se pudo animar.
     */
    const rectsMatch = (a, b) =>
      Math.abs(a.left - b.left) < 1 &&
      Math.abs(a.top - b.top) < 1 &&
      Math.abs(a.width - b.width) < 1 &&
      Math.abs(a.height - b.height) < 1

    /**
     * Centra el slide hero dentro del carril del carrusel con un margen fijo
     * en píxeles (no `margin: auto`): así el centrado no depende de si el
     * resto de los slides ya está montado ni de si el contenido total
     * desborda el carril, y no se "corre" cuando luego se revela el resto.
     */
    const centerHeroSlide = (index, heroEl) => {
      const sw = swiperInstances.value[index]
      const slideEl = heroEl.closest('.swiper-slide')
      const containerWidth = sw?.width || sw?.el?.getBoundingClientRect().width
      if (!sw || !slideEl || !containerWidth) return
      const slideWidth = slideEl.getBoundingClientRect().width
      const margin = Math.max(0, (containerWidth - slideWidth) / 2)
      slideEl.style.marginLeft = `${margin}px`
      slideEl.style.marginRight = `${margin}px`
      sw.update()
    }

    const primeOpenFlip = (index, thumbRect) =>
      new Promise((resolve) => {
        if (!thumbRect || prefersReducedMotion() || isMobileViewport()) {
          resolve(null)
          return
        }
        let lastRect = null
        const tryOnce = (attempt = 0) => {
          swiperInstances.value[index]?.update()
          const heroEl = queryHeroToggle(index)
          if (heroEl) centerHeroSlide(index, heroEl)
          const heroRect = heroEl?.getBoundingClientRect()
          const tooSmall = !heroEl || !heroRect || heroRect.width < 8 || heroRect.height < 8
          const stable = !tooSmall && lastRect && rectsMatch(lastRect, heroRect)
          if (!tooSmall) lastRect = heroRect
          if (stable) {
            resolve(primeFlipTransform(heroEl, thumbRect, heroRect) ? heroEl : null)
            return
          }
          if (attempt < 24) {
            requestAnimationFrame(() => tryOnce(attempt + 1))
          } else if (!tooSmall) {
            resolve(primeFlipTransform(heroEl, thumbRect, heroRect) ? heroEl : null)
          } else {
            resolve(null)
          }
        }
        tryOnce(0)
      })

    /**
     * Abre un proyecto: primero "primea" el FLIP (salto instantáneo, invisible
     * al usuario) y recién ahí dispara, EN SIMULTÁNEO, el scroll de centrado
     * y el crecimiento de la imagen — mismo reloj y misma curva, para que se
     * lea como un solo movimiento continuo en vez de "scroll, pausa, zoom".
     */
    const openProjectWithFlip = (index, thumbRect, onDone) => {
      primeOpenFlip(index, thumbRect).then((primedEl) => {
        const reduced = prefersReducedMotion()
        const scrollDone = animateScrollToViewportCenter(
          index,
          reduced ? 0 : FLIP_MS,
          reduced ? undefined : FLIP_EASE_FN
        )
        const finish = () => {
          revealCarouselInfoForIndex(index)
          onDone?.()
        }
        const growDone = new Promise((resolve) => {
          if (primedEl) {
            playFlipTransform(primedEl, resolve)
          } else {
            resolve()
          }
        })
        Promise.all([scrollDone, growDone]).then(finish)
      })
    }

    const runCloseFlip = (index, heroRect, onDone) => {
      if (!heroRect || prefersReducedMotion() || isMobileViewport()) {
        onDone?.()
        return
      }

      const tryOnce = (attempt = 0) => {
        const frame = queryThumbFrame(index)
        const thumbRect = frame?.getBoundingClientRect()
        if (!frame || !thumbRect || thumbRect.width < 8 || thumbRect.height < 8) {
          if (attempt < 24) requestAnimationFrame(() => tryOnce(attempt + 1))
          else onDone?.()
          return
        }
        runFlip(frame, heroRect, thumbRect, onDone)
      }

      tryOnce(0)
    }

    const LOREM =
      'Texto de relleno para maquetación. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    const LOREM2 =
      'Segundo párrafo de demostración. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    const DETALLE_REFERENCIAS = `1 - Tierra natural
2 - Suelo compactado
3 - Aislante hidrófugo
4 - H.H.R.P.
5 - Barrera de vapor
6 - Contrapiso
7 - Carpeta
8 - Piso flotante de madera + manto de polietileno
9 - Fenólico
10 - Aislante acústico
11 - Aislante térmico
12 - Placa Durlock
13 - Cielo raso
14 - Piso de granito
15 - Columna de H°A°
16 - DVH 3+3/9/4
17 - Marco de aluminio anodizado
18 - Vidrio laminado 4+4
19 - Leca / piedra partida`

    const projectsBase = [
      {
        slug: 'img-random',
        logoGlyph: 'grid',
        title: 'IMG random — galería completa',
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
        logoGlyph: 'plan',
        title: 'Master plan — láminas',
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
        logoGlyph: 'levels',
        title: 'Mediateca — imágenes y PDFs',
        category: 'Proyecto',
        location: 'Buenos Aires, Argentina',
        year: '2024',
        area: '—',
        uniformImages: false,
        pdfs: null,
        heroImage: '/Mediateca/imagen 01 axo aerea_1 - Photo.jpg',
        carouselPanels: [
          {
            image: '/Mediateca/imagen 01 axo aerea_1 - Photo.jpg',
            kicker: 'Vista 1',
            heading: 'Axonométrica — toma 1',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/Mediateca/imagen 01 axo aerea_2 - Photo.jpg',
            kicker: 'Vista 2',
            heading: 'Axonométrica — toma 2',
            paragraphs: [LOREM]
          },
          {
            image: '/Mediateca/imagen 01 axo aerea_3 - Photo.jpg',
            kicker: 'Vista 3',
            heading: 'Axonométrica — toma 3',
            paragraphs: [LOREM, LOREM2]
          },
          {
            image: '/Mediateca/imagen 01 axo aerea_4 - Photo.jpg',
            kicker: 'Vista 4',
            heading: 'Axonométrica — toma 4',
            paragraphs: [LOREM]
          },
          {
            imageCarousel: [
              '/Mediateca/Plantas y corte/Nivel 0.png',
              '/Mediateca/Plantas y corte/Nivel 1.png',
              '/Mediateca/Plantas y corte/Nivel 2.png',
              '/Mediateca/Plantas y corte/Nivel 3.png',
              '/Mediateca/Plantas y corte/Nivel 4.png',
              '/Mediateca/Plantas y corte/Nivel 5.png',
              '/Mediateca/Plantas y corte/Nivel 6 png.png',
              '/Mediateca/Plantas y corte/Corte A.png'
            ],
            skipText: true
          },
          {
            heading: 'Detalle constructivo',
            paragraphs: [
              'Detalle 0 se muestra junto al gráfico del detalle 0; Detalle 1 junto al gráfico del detalle 1. Las dos columnas cambian al unísono cada dos segundos.'
            ]
          },
          {
            dualImageCarousel: {
              syncPairs: true,
              graphicMiniLeftAlignBottom: true,
              leftLabel: 'Detalle constructivo',
              rightLabel: '',
              pairs: [
                {
                  left: '/Mediateca/Detalle ( 2 imagenes )/Detalle 0.png',
                  right:
                    '/Mediateca/Detalle ( 2 imagenes )/grafico para detalle 0 chiquito.png'
                },
                {
                  left: '/Mediateca/Detalle ( 2 imagenes )/Detalle 01.png',
                  right:
                    '/Mediateca/Detalle ( 2 imagenes )/grafico para detalle 01 chiquito.png'
                }
              ]
            },
            heading: 'Referencias',
            paragraphs: [DETALLE_REFERENCIAS],
            sideTextRight: true
          }
        ]
      },
      {
        slug: 'centro-vacunatorio',
        logoGlyph: 'cross',
        title: 'Centro vacunatorio',
        category: 'Proyecto',
        location: '—',
        year: '2024',
        area: '—',
        uniformImages: false,
        pdfs: null,
        heroImage: '/Centro vacunatorio/RENDER_01.png',
        carouselPanels: [
          {
            image: '/Centro vacunatorio/RENDER_01.png',
            kicker: 'Render',
            heading: 'Vista exterior',
            skipText: true
          },
          {
            image: '/Centro vacunatorio/detalle.png',
            heading: 'Detalle constructivo'
          }
        ]
      }
    ]

    const buildSlidesFromPanels = (p) => {
      const out = []
      for (const panel of p.carouselPanels) {
        if (
          panel.dualImageCarousel?.syncPairs &&
          panel.dualImageCarousel.pairs?.length >= 2
        ) {
          const pairs = panel.dualImageCarousel.pairs.map((pair) => ({
            left: pair.left,
            right: pair.right
          }))
          out.push({
            type: 'dual-image-sequence',
            variant: 'sync-pairs',
            pairs,
            leftLabel: panel.dualImageCarousel.leftLabel || '',
            rightLabel: panel.dualImageCarousel.rightLabel || '',
            sequenceTall: panel.imageCarouselTall === true,
            graphicMiniLeftAlignBottom:
              !!panel.dualImageCarousel.graphicMiniLeftAlignBottom,
            ...(panel.sideTextRight &&
            (panel.heading || (panel.paragraphs && panel.paragraphs.length))
              ? {
                  sideText: {
                    heading: panel.heading || '',
                    paragraphs: panel.paragraphs || []
                  }
                }
              : {})
          })
        } else if (panel.dualImageCarousel?.columns?.length >= 2) {
          const cols = panel.dualImageCarousel.columns.slice(0, 2).map((col) => ({
            images: [...(col.images || [])],
            altBase: col.altBase || col.label || 'Vista',
            label: col.label || ''
          }))
          out.push({
            type: 'dual-image-sequence',
            columns: cols,
            sequenceTall: panel.imageCarouselTall === true
          })
        } else if (panel.imageCarousel?.length) {
          const base = panel.imageCarousel
          const cycles =
            typeof panel.imageCarouselRepeat === 'number' &&
            panel.imageCarouselRepeat > 0
              ? Math.min(Math.floor(panel.imageCarouselRepeat), 12)
              : 1
          const images =
            cycles <= 1
              ? [...base]
              : Array.from({ length: cycles }, () => [...base]).flat()
          out.push({
            type: 'image-sequence',
            images,
            alt: panel.heading || 'Vista',
            sequenceTall: panel.imageCarouselTall === true
          })
        } else if (panel.image) {
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
        if (
          !panel.skipText &&
          !panel.sideTextRight &&
          (panel.kicker ||
            panel.heading ||
            (panel.paragraphs && panel.paragraphs.length))
        ) {
          out.push({
            type: 'text',
            kicker: panel.kicker,
            heading: panel.heading,
            paragraphs: panel.paragraphs || []
          })
        }
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
            sw?.updateAutoHeight?.(0)
          })
          window.setTimeout(() => {
            swiperInstances.value.forEach((sw) => {
              sw?.update?.()
              sw?.updateAutoHeight?.(0)
            })
          }, 150)
        })
      })
    }

    watch(isMobileProjects, (mobile) => {
      leavingExpandedIndex.value = null
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
          if (mobile) {
            sw?.updateAutoHeight?.(0)
          }
        })
      })
    })

    const CAROUSEL_EXPAND_MS = FLIP_MS
    const queryProjectArticle = (idx) =>
      document.querySelector(`[data-project-idx="${idx}"]`)

    /** Aproximación numérica de FLIP_EASE (cubic-bezier(0.22, 1, 0.36, 1)) para animar el scroll con el mismo reloj. */
    const FLIP_EASE_FN = (t) => 1 - Math.pow(1 - t, 5)

    /**
     * Centra el bloque del proyecto en el viewport animando el scroll nosotros
     * mismos (en vez de `scrollIntoView`), para poder correrlo en el mismo
     * reloj y la misma curva que el crecimiento de la imagen — un solo
     * movimiento continuo en vez de "scroll nativo, pausa, zoom".
     */
    const animateScrollToViewportCenter = (idx, durationMs, easingFn) =>
      new Promise((resolve) => {
        if (typeof window === 'undefined') {
          resolve()
          return
        }
        const el = queryProjectArticle(idx)
        if (!el) {
          resolve()
          return
        }
        const rect = el.getBoundingClientRect()
        const target =
          window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2
        const startY = window.scrollY
        const delta = target - startY

        if (!durationMs || Math.abs(delta) < 1) {
          if (Math.abs(delta) >= 1) window.scrollTo(0, target)
          resolve()
          return
        }

        const start = performance.now()
        const step = (now) => {
          const t = Math.min(1, (now - start) / durationMs)
          window.scrollTo(0, startY + delta * easingFn(t))
          if (t < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })

    /** Tras el FLIP: recalcula el swiper una vez asentado el tamaño final. */
    const settleSwiperAfterOpen = (index) => {
      requestAnimationFrame(() => {
        const sw = swiperInstances.value[index]
        if (sw) {
          sw.slideTo(0, 0)
          sw.update()
          window.setTimeout(() => sw.update(), CAROUSEL_EXPAND_MS + 250)
        }
      })
    }

    /**
     * Escritorio: cada apertura centra el proyecto en el viewport (protagonista) y luego FLIP.
     */
    const runDesktopOpenAfterExpand = (openIdx, thumbRect) => {
      if (!prefersReducedMotion()) {
        heroFlippingIndex.value = openIdx
      }
      nextTick(() => {
        openProjectWithFlip(openIdx, thumbRect, () => {
          heroFlippingIndex.value = null
          settleSwiperAfterOpen(openIdx)
        })
      })
    }

    const toggleExpand = (index) => {
      const wasOpen = expandedIds.value.includes(index)

      if (!wasOpen) {
        const thumb = queryThumbFrame(index)
        const thumbRect = thumb?.getBoundingClientRect()
        /* Varios proyectos pueden quedar expandidos a la vez (sin cerrar el anterior → sin saltos de layout). */
        leavingExpandedIndex.value = null
        expandedIds.value = [...new Set([...expandedIds.value, index])]
        {
          const cr = new Set(carouselInfoReady.value)
          cr.delete(index)
          carouselInfoReady.value = cr
        }
        nextTick(() => {
          if (isMobileViewport()) {
            openProjectWithFlip(index, thumbRect, () => {
              heroFlippingIndex.value = null
              settleSwiperAfterOpen(index)
            })
            return
          }
          runDesktopOpenAfterExpand(index, thumbRect)
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
      isPrimaryExpanded,
      hasExpandedDetail,
      heroFlippingIndex,
      carouselInfoReady,
      leavingExpandedIndex,
      visibleSlidesForProject,
      toggleExpand,
      onHeadClick,
      swiperModules,
      swiperPagination,
      swiperSlidesPerView,
      swiperSpaceBetween,
      swiperAutoHeight,
      swiperGrabCursor,
      swiperMousewheel,
      swiperFreeMode,
      onSwiperInit,
      onCarouselSlideChange,
      isMobileProjects,
      url: assetUrl
    }
  }
}
</script>

<style scoped>
.projects {
  padding: 6rem 0;
  background: transparent;
  --project-font: var(--font-display);
  --project-text-size: 12px;
  --project-main-title-size: 20px;
  --project-title-size: 16px;
  --project-line-height: normal;
}

/* Sin line-height custom: solo normal en toda la tipografía de proyectos */
.projects :is(
  .section-label,
  .section-title,
  .section-subtitle,
  .strip-title,
  .strip-meta,
  .detail-kicker,
  .detail-heading,
  .detail-para,
  .detail-label,
  .detail-row,
  .pdf-link,
  .pdf-open-button,
  .slide-text-inner,
  .dual-sequence-col__label
) {
  line-height: normal;
  text-transform: none;
}

.projects :deep(.slide-text-inner),
.projects :deep(.dual-sequence-col__label) {
  line-height: normal;
  text-transform: none;
}

.section-header {
  text-align: center;
  max-width: min(960px, 92vw);
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.section-label {
  display: inline-block;
  font-family: var(--project-font);
  color: var(--text-muted);
  font-weight: 500;
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  letter-spacing: 0.14em;
  text-transform: none;
  margin-bottom: 0.65rem;
}

.section-title {
  font-family: var(--project-font);
  font-size: var(--project-main-title-size);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: var(--project-line-height);
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-family: var(--project-font);
  color: var(--text-light);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
}

.projects-stack-wrap {
  width: 100%;
  margin-top: 1rem;
}

.projects-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4rem;
}

.project-block {
  scroll-margin-top: 5rem;
  padding: 1rem 0 3.5rem;
  margin-bottom: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.project-block.is-expanded {
  padding-bottom: 4.5rem;
}

.project-block:last-child {
  border-bottom: none;
}

.project-block-head {
  max-width: 1680px;
  margin: 0 auto 1.25rem;
  padding: 0 clamp(1.25rem, 4vw, 3rem);
}

.project-block-head--collapse {
  cursor: pointer;
  user-select: none;
}

.project-block-head__logo {
  margin-bottom: 0.85rem;
}

.strip-title {
  font-family: var(--project-font);
  font-size: var(--project-main-title-size);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--text-dark);
  margin: 0 0 0.35rem;
  line-height: var(--project-line-height);
}

.strip-meta {
  margin: 0;
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  color: var(--text-light);
  letter-spacing: 0.03em;
}

/* Contenedor: miniatura más grande; expandido ~950×600 (rect.) / 750 (cuadrados uniform) */
.project-body {
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 3rem);
  --project-img-radius: 12px;
  --hero-w: 400px;
  --hero-h: 253px;
  --carousel-h: 260px;
  --hero-expand-duration: 0.55s;
  --hero-expand-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --hero-open-duration: 0.55s;
  --hero-open-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.project-body.is-expanded {
  --carousel-h: min(420px, 68vw);
}

@media (min-width: 769px) {
  .project-body.is-expanded {
    --carousel-h: min(620px, 75vh);
  }
}

/* Desktop grande: franja tipo BIG — alto ~76vh, carril a ancho de ventana */
@media (min-width: 1024px) {
  .project-body.is-expanded {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    --carousel-h: min(620px, 75vh);
  }

  .project-body.is-expanded .project-detail-outer {
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(50% - 50vw);
  }

  .project-body.is-expanded .project-detail-swiper {
    padding-left: 5vw;
    padding-right: 5vw;
    box-sizing: border-box;
  }

  .project-body.is-expanded .project-detail-swiper :deep(.swiper) {
    border-radius: 0;
  }

  .project-block.is-expanded {
    overflow-x: clip;
  }
}

/* Tres columnas: texto | imagen (centrada en la página) | hueco espejo → la foto queda en el eje vertical central */
.project-collapsed-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
}

.project-block-head--beside {
  grid-column: 1;
  justify-self: end;
  margin: 0;
  padding: 0;
  max-width: min(380px, 38vw);
  text-align: right;
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
  object-position: top center;
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
  border-radius: var(--project-img-radius);
  overflow: hidden; /* el img va contenido dentro; no recortar con cover */
  background: transparent;
  transition:
    box-shadow var(--hero-expand-duration) var(--hero-expand-ease),
    width var(--hero-expand-duration) var(--hero-expand-ease),
    height var(--hero-expand-duration) var(--hero-expand-ease),
    max-width var(--hero-expand-duration) var(--hero-expand-ease),
    max-height var(--hero-expand-duration) var(--hero-expand-ease);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.project-hero :deep(picture) {
  display: flex;
  align-items: flex-start;
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
  object-position: top center;
  border-radius: var(--project-img-radius);
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

/* Escritorio: al cambiar de proyecto, el anterior se pliega sin un salto brusco */
@media (min-width: 769px) {
  .project-block {
    transition:
      padding 0.42s cubic-bezier(0.65, 0, 0.35, 1),
      padding-bottom 0.42s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .project-detail-outer--accordion-leave {
    pointer-events: none;
    overflow: hidden;
    animation: project-detail-accordion-leave 0.42s cubic-bezier(0.65, 0, 0.35, 1)
      forwards;
  }
}

@keyframes project-detail-accordion-leave {
  from {
    opacity: 1;
    max-height: min(620px, 75vh);
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }

  to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-4px) scale(0.992);
    filter: brightness(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  @media (min-width: 769px) {
    .project-detail-outer--accordion-leave {
      animation: none;
    }

    .project-block {
      transition-duration: 0.01ms;
    }
  }
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
  padding: 0;
  box-sizing: border-box;
  transition:
    height var(--hero-expand-duration) var(--hero-expand-ease),
    max-height var(--hero-expand-duration) var(--hero-expand-ease);
}

.project-detail-swiper :deep(.paired-dual-columns-player),
.project-detail-swiper :deep(.image-sequence-player) {
  align-self: flex-start;
  width: 100%;
}

.project-detail-swiper :deep(.paired-dual-columns-player__stack),
.project-detail-swiper :deep(.image-sequence-player__stack) {
  place-items: start;
}

.project-detail-swiper :deep(.paired-dual-columns-player__frame),
.project-detail-swiper :deep(.image-sequence-player__frame) {
  align-items: flex-start;
  justify-content: flex-start;
}

.carousel-slide-parallax-layer {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.carousel-slide--text .carousel-slide-parallax-layer,
.carousel-slide--docs .carousel-slide-parallax-layer,
.carousel-slide--pdf-slide .carousel-slide-parallax-layer {
  align-items: flex-start;
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

/* Escritorio: carrusel con alto fijo (--carousel-h); evita restos de autoHeight al redimensionar */
@media (min-width: 769px) {
  .project-detail-swiper {
    height: var(--carousel-h) !important;
    max-height: var(--carousel-h) !important;
  }

  .project-detail-swiper :deep(.swiper),
  .project-detail-swiper :deep(.swiper-wrapper) {
    height: 100% !important;
  }

  .project-detail-swiper :deep(.swiper-slide) {
    height: 100% !important;
  }

  .carousel-slide {
    height: 100% !important;
  }

  .carousel-slide-parallax-layer {
    height: 100% !important;
  }

  /* Alineación superior del bloque de texto dentro del slide */
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--text),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--docs),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--pdf-slide) {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
  }

  .carousel-slide--text .carousel-slide-parallax-layer,
  .carousel-slide--docs .carousel-slide-parallax-layer,
  .carousel-slide--pdf-slide .carousel-slide-parallax-layer {
    flex: 1 1 auto;
    min-height: 100% !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
  }

  .carousel-slide--text .slide-text-inner,
  .carousel-slide--docs .slide-text-inner,
  .carousel-slide--pdf-slide .slide-text-inner {
    margin-top: 0;
    margin-bottom: 0;
    flex-shrink: 0;
    align-self: stretch;
    width: 100%;
    max-height: 100%;
    min-height: 0;
    box-sizing: border-box;
  }

  /* Misma altura que el carrusel/imágenes; el bloque de copy queda centrado en la franja */
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--text),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--docs),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--pdf-slide) {
    min-height: var(--carousel-h) !important;
  }
}

/* Demos uniformes: cuadrados ~750px en desktop */
.project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image img),
.project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image .slide-img) {
  width: min(360px, 62vw) !important;
  height: min(240px, 42vw) !important;
  max-width: min(360px, 88vw) !important;
  max-height: min(240px, 55vh) !important;
  object-fit: cover !important;
}

@media (min-width: 769px) {
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--text),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--docs),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--pdf-slide) {
    width: min(450px, 92vw) !important;
    max-width: 450px;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--image:not(.carousel-slide--hero)),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--image-sequence:not(.carousel-slide--hero)) {
    width: max-content !important;
    max-width: min(88vw, 620px);
    flex-shrink: 0;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--dual-image-sequence:not(.carousel-slide--hero)) {
    width: max-content !important;
    max-width: min(94vw, 960px);
    flex-shrink: 0;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--dual-with-side-text:not(.carousel-slide--hero)) {
    width: max-content !important;
    max-width: min(96vw, 1440px) !important;
    flex-shrink: 0;
  }

  .project-detail-swiper :deep(.swiper-slide.carousel-slide--hero) {
    width: auto;
    max-width: min(85vw, 750px);
    flex-shrink: 0;
  }

  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image img),
  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image .slide-img) {
    width: min(620px, 85vw) !important;
    height: min(620px, 72vh) !important;
    max-width: min(620px, 92vw) !important;
    max-height: min(620px, 75vh) !important;
    object-fit: cover !important;
  }
}

/* ≥1024px: franja full-bleed; textos 450px máx.; imágenes ~90vw × 620px máx. */
@media (min-width: 1024px) {
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--text),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--docs),
  .project-detail-swiper :deep(.swiper-slide.carousel-slide--pdf-slide) {
    width: min(450px, 92vw) !important;
    min-width: min(450px, 92vw) !important;
    max-width: min(450px, 92vw) !important;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--image:not(.carousel-slide--hero)),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--image-sequence:not(.carousel-slide--hero)),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--dual-image-sequence:not(.carousel-slide--hero)),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--dual-with-side-text:not(.carousel-slide--hero)) {
    max-width: min(90vw, 960px) !important;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--dual-with-side-text:not(.carousel-slide--hero)) {
    max-width: min(96vw, 1440px) !important;
  }

  .project-detail-swiper :deep(.swiper-slide.carousel-slide--hero) {
    max-width: min(90vw, 960px) !important;
  }

  .project-detail-swiper :deep(.carousel-slide--image img),
  .project-detail-swiper :deep(.carousel-slide--image .slide-img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img),
  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence .slide-img) {
    max-width: min(90vw, 960px) !important;
    max-height: min(620px, 75vh) !important;
  }

  .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col img),
  .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col .slide-img) {
    max-width: min(460px, 42vw) !important;
    max-height: min(560px, 68vh) !important;
  }

  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .dual-sequence-grid--sidebar
        .dual-sequence-col--detalle
        img
    ),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .dual-sequence-grid--sidebar
        .dual-sequence-col--detalle
        .slide-img
    ) {
    max-width: min(90vw, 960px) !important;
    max-height: min(620px, 75vh) !important;
  }

  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        img
    ),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        .slide-img
    ) {
    max-width: min(240px, 100%) !important;
    max-height: min(180px, 30vh) !important;
    object-position: bottom center !important;
  }

  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image img),
  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image .slide-img) {
    width: min(620px, 90vw) !important;
    height: min(620px, 75vh) !important;
    max-width: min(620px, 92vw) !important;
    max-height: min(620px, 75vh) !important;
    object-fit: cover !important;
  }

  .project-detail-swiper :deep(.slide-text-inner) {
    font-family: var(--project-font);
    font-size: var(--project-text-size);
    line-height: var(--project-line-height);
    letter-spacing: 0.01em;
    padding: 0 clamp(1rem, 2vw, 1.75rem) 1.1rem;
  }

  .project-detail-swiper :deep(.slide-text-inner p) {
    margin-bottom: 1rem;
  }

  .project-detail-swiper :deep(.slide-text-inner p:last-child) {
    margin-bottom: 0;
  }
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

.project-detail-outer--flip .carousel-slide--image,
.project-detail-outer--flip .carousel-slide--image-sequence,
.project-detail-outer--flip .carousel-slide--dual-image-sequence {
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

.carousel-slide--image,
.carousel-slide--image-sequence,
.carousel-slide--dual-image-sequence {
  background: transparent;
  border-radius: var(--project-img-radius);
  overflow: hidden;
  border: none;
}

.slide-figure {
  margin: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

/* Imágenes del carrusel: siempre alto = 100% del carrusel (misma lectura que el hero) */
.carousel-slide--image .slide-figure,
.carousel-slide--image .slide-figure--hero-toggle,
.carousel-slide--image-sequence .slide-figure--inner-sequence,
.carousel-slide--dual-image-sequence .slide-figure--dual-sequence {
  height: 100%;
  min-height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0;
}

.carousel-slide--image .slide-figure :deep(picture),
.carousel-slide--image .slide-figure--hero-toggle :deep(picture),
.carousel-slide--image-sequence .image-sequence-player :deep(picture),
.carousel-slide--dual-image-sequence .image-sequence-player :deep(picture) {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  max-height: 100%;
  width: max-content;
  max-width: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0;
}

.slide-figure--dual-sequence {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.slide-dual-with-side-text {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: clamp(10px, 2vw, 22px);
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

.slide-figure--dual-with-side-text {
  flex: 1 1 auto;
  min-width: 0;
  width: auto;
  height: auto;
  max-height: 100%;
  margin: 0;
}

.slide-text-inner--beside {
  flex: 0 0 min(420px, 44vw);
  width: min(480px, 48vw);
  max-width: min(560px, 52vw);
  align-self: flex-start;
  overflow-y: auto;
  max-height: 100%;
  padding-top: 0;
}

@media (max-width: 768px) {
  .slide-dual-with-side-text {
    flex-direction: column;
    gap: 0.85rem;
  }

  .slide-text-inner--beside {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
}

.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .slide-figure--dual-sequence
      .paired-dual-columns-player--sidebar
  ) {
  height: 100%;
  min-height: 0;
}

.dual-sequence-grid {
  display: flex;
  flex-direction: row;
  gap: clamp(8px, 2vw, 20px);
  width: 100%;
  height: 100%;
  min-height: 0;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
}

.dual-sequence-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.35rem;
}

.dual-sequence-col .image-sequence-player {
  width: 100%;
  min-height: 0;
}

.dual-sequence-col__label {
  margin: 0 0 0.65rem;
  text-align: left;
  max-width: 100%;
}

.project-detail-swiper :deep(.dual-sequence-col__label.detail-heading) {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: var(--project-line-height);
  color: var(--text-light);
  font-style: normal;
}

@media (max-width: 768px) {
  .dual-sequence-grid {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Gráfico mini: tamaño chico, anclado abajo sin recorte */
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .dual-sequence-col--graphic-mini
      img
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .dual-sequence-col--graphic-mini
      .slide-img
  ) {
  max-height: min(130px, 22vh) !important;
  max-width: min(200px, 46vw) !important;
  object-position: bottom center !important;
}

.project-detail-swiper :deep(.carousel-slide--image img),
.project-detail-swiper :deep(.carousel-slide--image .slide-img),
.project-detail-swiper :deep(.carousel-slide--image-sequence img),
.project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img),
.project-detail-swiper :deep(.carousel-slide--dual-image-sequence img),
.project-detail-swiper :deep(.carousel-slide--dual-image-sequence .slide-img) {
  display: block;
  object-fit: contain;
  object-position: top center !important;
  width: auto;
  height: auto;
  max-width: min(400px, 74vw);
  max-height: min(300px, 48vh);
  border-radius: var(--project-img-radius);
}

@media (min-width: 769px) {
  .project-detail-swiper :deep(.carousel-slide--image img),
  .project-detail-swiper :deep(.carousel-slide--image .slide-img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img),
  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence .slide-img) {
    max-width: min(950px, 85vw);
    max-height: min(620px, 75vh);
  }
}

/* Dos columnas: cada mitad limita el ancho para que quepan lado a lado */
.project-detail-swiper
  :deep(.carousel-slide--dual-image-sequence .dual-sequence-col img),
.project-detail-swiper
  :deep(.carousel-slide--dual-image-sequence .dual-sequence-col .slide-img) {
  max-width: min(190px, 36vw);
}

@media (min-width: 769px) {
  .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col img),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence .dual-sequence-col .slide-img
    ) {
    max-width: min(460px, 42vw);
    max-height: min(560px, 68vh);
  }
}

/* Sidebar embebido: detalle grande; gráfico como miniatura */
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .dual-sequence-grid--sidebar
      .dual-sequence-col--detalle
      img
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .dual-sequence-grid--sidebar
      .dual-sequence-col--detalle
      .slide-img
  ) {
  max-width: min(400px, 74vw) !important;
  max-height: min(300px, 48vh) !important;
}

@media (min-width: 769px) {
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .dual-sequence-grid--sidebar
        .dual-sequence-col--detalle
        img
    ),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .dual-sequence-grid--sidebar
        .dual-sequence-col--detalle
        .slide-img
    ) {
    max-width: min(950px, 85vw) !important;
    max-height: min(620px, 75vh) !important;
  }
}

.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence .paired-sidebar__graphic--bottom img
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .paired-sidebar__graphic--bottom
      .slide-img
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .paired-sidebar__graphic--bottom
      .slide-img--graphic-thumb
  ) {
  max-width: min(200px, 46vw) !important;
  max-height: min(140px, 24vh) !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
  object-position: bottom center !important;
}

.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .paired-sidebar__graphic--bottom
      .paired-dual-columns-player__stack
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .paired-sidebar__graphic--bottom
      .paired-dual-columns-player__frame
  ) {
  width: fit-content !important;
  max-width: 100% !important;
  overflow: visible !important;
}

.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence .dual-sequence-col--graphic-mini
  ),
.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence .paired-sidebar__graphic--bottom
  ) {
  overflow: visible !important;
}

.project-detail-swiper
  :deep(
    .carousel-slide--dual-image-sequence
      .paired-sidebar__graphic--bottom
      picture
  ) {
  display: block;
  width: auto !important;
  max-width: min(200px, 46vw) !important;
}

@media (min-width: 769px) {
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        img
    ),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        .slide-img
    ),
  .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        .slide-img--graphic-thumb
    ) {
    max-width: min(220px, 100%) !important;
    max-height: min(170px, 28vh) !important;
    object-position: bottom center !important;
  }
}

/* Láminas verticales: misma altura máx. que las demás; ancho proporcional (sin estirar) */
.project-detail-swiper
  :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall img),
.project-detail-swiper
  :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall .slide-img) {
  width: auto !important;
  max-width: min(400px, 74vw) !important;
  max-height: min(300px, 48vh) !important;
  object-fit: contain !important;
}

@media (min-width: 769px) {
  .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall img),
  .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall .slide-img) {
    max-width: min(950px, 85vw) !important;
    max-height: min(620px, 75vh) !important;
  }
}

@media (min-width: 1024px) {
  .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall img),
  .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall .slide-img) {
    max-width: min(90vw, 960px) !important;
    max-height: min(620px, 75vh) !important;
  }
}

/*
 * Slide hero (toggle FLIP): no usar 100%/100% — anula los topes del carrusel y en
 * móvil (alto auto) el % puede equivaler a la altura intrínseca de la foto.
 * Un tope explícito un poco menor que el resto evita que un vertical domine la franja.
 */
.project-detail-swiper
  :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image img),
.project-detail-swiper
  :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image .slide-img) {
  max-width: min(400px, 74vw) !important;
  max-height: min(280px, 45vh) !important;
}

@media (min-width: 769px) {
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image img),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image .slide-img) {
    max-width: min(950px, 85vw) !important;
    max-height: min(520px, 68vh) !important;
  }
}

@media (min-width: 1024px) {
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image img),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--hero.carousel-slide--image .slide-img) {
    max-width: min(90vw, 960px) !important;
    max-height: min(520px, 68vh) !important;
  }
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
  align-items: flex-start;
  justify-content: flex-start;
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
  width: 100%;
  max-height: 100%;
  height: auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  touch-action: pan-y;
  padding: 0 0.5rem 0.85rem 0;
  box-sizing: border-box;
  background: transparent;
  scrollbar-width: thin;
  scrollbar-color: rgba(43, 43, 43, 0.35) transparent;
  align-self: flex-start;
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
}

.project-detail-swiper :deep(.slide-text-inner) {
  padding-top: 0;
}

@media (min-width: 769px) {
  .slide-text-inner {
    padding: 0 clamp(1.25rem, 2.5vw, 2.25rem) 1.1rem clamp(1.25rem, 2.5vw, 2.25rem);
  }

  .project-detail-swiper :deep(.slide-text-inner) {
    padding-top: 0;
  }
}

.slide-text-inner::-webkit-scrollbar {
  width: 5px;
}

.slide-text-inner::-webkit-scrollbar-thumb {
  background: rgba(43, 43, 43, 0.28);
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
  border-radius: 999px;
  background: var(--color-forest);
  color: var(--white) !important;
  text-decoration: none;
  font-family: var(--project-font);
  font-weight: 600;
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
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
  font-family: var(--project-font);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: none;
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  color: var(--text-muted);
}

.detail-kicker--v0 {
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.detail-kicker--v1 {
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--text-light);
}

.detail-kicker--v2 {
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.detail-kicker--v3 {
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-light);
}

.detail-heading {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--primary-color);
  margin: 0 0 0.65rem;
  line-height: var(--project-line-height);
}

.detail-heading--v0 {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary-color);
}

.detail-heading--v1 {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: var(--project-line-height);
  color: var(--text-light);
}

.projects .detail-heading.detail-heading--v1,
.projects :deep(.detail-heading.detail-heading--v1) {
  text-transform: uppercase;
}

.detail-heading--v2 {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0;
  color: var(--text-dark);
}

.detail-heading--v3 {
  font-family: var(--project-font);
  font-size: var(--project-title-size);
  font-weight: 500;
  font-style: normal;
  letter-spacing: 0.01em;
  color: var(--text-light);
}

.detail-para {
  margin: 0 0 0.75rem;
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  color: var(--text-dark);
  white-space: pre-line;
}

/* Ritmo al deslizar: tres tonos/tamaños que se repiten */
.detail-para--tone-0 {
  font-size: var(--project-text-size);
  color: var(--color-deep);
  font-weight: 400;
}

.detail-para--tone-1 {
  font-size: var(--project-text-size);
  color: var(--color-slate);
  line-height: var(--project-line-height);
  font-weight: 400;
}

.detail-para--tone-2 {
  font-size: var(--project-text-size);
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
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
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
  border-top: 1px solid rgba(179, 179, 179, 0.55);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  font-family: var(--project-font);
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  color: var(--text-dark);
}

.detail-row dd {
  margin: 0;
}

.detail-label {
  font-family: var(--project-font);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: none;
  font-size: var(--project-text-size);
  line-height: var(--project-line-height);
  color: var(--text-light);
}

.detail-reveal-enter-active {
  transition: none;
}

.detail-reveal-leave-active {
  transition: opacity 0.26s ease;
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
    font-size: var(--project-main-title-size);
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
    object-position: top center;
  }

  /* Móvil: franja baja para no dominar la pantalla */
  .project-body.is-expanded {
    --carousel-h: min(340px, 46dvh);
  }

  .projects-stack {
    gap: 0;
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

  /* Carrusel: espacio inferior para bullets (solo móvil activa Pagination) */
  .project-detail-swiper {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 0 2.35rem;
    padding-left: 0;
    padding-right: 0;
    height: auto !important;
    max-height: none !important;
    min-height: 0;
    touch-action: pan-x pan-y pinch-zoom;
    transition: none;
  }

  .project-detail-swiper :deep(.swiper) {
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    height: auto !important;
  }

  .project-detail-swiper :deep(.swiper-wrapper) {
    height: auto !important;
    align-items: stretch;
  }

  /* Móvil: no forzar width en slides — Swiper asigna ancho en px y translate; !important rompía el encuadre */
  .project-detail-swiper :deep(.swiper-slide) {
    box-sizing: border-box;
    height: auto !important;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--text),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--docs),
  .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--pdf-slide) {
    background: var(--bg-page);
  }

  .carousel-slide--text,
  .carousel-slide--docs,
  .carousel-slide--pdf-slide {
    background: var(--bg-page);
    overflow: hidden;
  }

  .carousel-slide--text .carousel-slide-parallax-layer,
  .carousel-slide--docs .carousel-slide-parallax-layer,
  .carousel-slide--pdf-slide .carousel-slide-parallax-layer {
    background: var(--bg-page);
  }

  .project-detail-swiper :deep(.carousel-slide--text .slide-text-inner),
  .project-detail-swiper :deep(.carousel-slide--docs .slide-text-inner),
  .project-detail-swiper :deep(.carousel-slide--pdf-slide .slide-text-inner) {
    max-width: 450px;
    margin-left: 0;
    margin-right: 0;
  }

  .carousel-slide {
    height: auto !important;
    min-height: 0;
    min-width: 0;
    max-width: 100%;
    touch-action: pan-x pan-y pinch-zoom;
  }

  .carousel-slide-parallax-layer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 0;
    height: auto !important;
    touch-action: pan-x pan-y pinch-zoom;
    overflow-x: hidden;
  }

  /* Un slide = un encuadre: nada de la imagen/secuencia puede dibujarse sobre el slide vecino */
  .carousel-slide--image,
  .carousel-slide--image-sequence,
  .carousel-slide--dual-image-sequence {
    overflow: hidden;
  }

  .carousel-slide--image .slide-figure,
  .carousel-slide--image .slide-figure--hero-toggle,
  .carousel-slide--image-sequence .slide-figure--inner-sequence,
  .carousel-slide--dual-image-sequence .slide-figure--dual-sequence {
    flex-shrink: 0;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    box-sizing: border-box;
  }

  .carousel-slide--image .slide-figure :deep(picture),
  .carousel-slide--image .slide-figure--hero-toggle :deep(picture),
  .carousel-slide--image-sequence .image-sequence-player :deep(picture),
  .carousel-slide--dual-image-sequence .image-sequence-player :deep(picture),
  .carousel-slide--dual-image-sequence .paired-dual-columns-player :deep(picture) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    height: auto !important;
    max-height: none !important;
    box-sizing: border-box;
  }

  .carousel-slide--dual-image-sequence
    .paired-sidebar__graphic--bottom
    .paired-dual-columns-player
    :deep(picture) {
    width: auto !important;
    max-width: min(120px, 32vw) !important;
    max-height: min(130px, 22vh) !important;
  }

  .carousel-slide--dual-image-sequence
    .paired-sidebar__graphic--bottom
    .paired-dual-columns-player
    :deep(.paired-dual-columns-player__stack),
  .carousel-slide--dual-image-sequence
    .paired-sidebar__graphic--bottom
    .paired-dual-columns-player
    :deep(.paired-dual-columns-player__frame) {
    width: fit-content !important;
    max-width: 100% !important;
  }

  .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-grid--sidebar.dual-sequence-grid--graphic-left) {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: stretch !important;
    height: 100%;
    min-height: 0;
  }

  .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-col--detalle) {
    order: 1;
    height: 100%;
    min-height: 0;
  }

  .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-col--graphic-mini) {
    order: 2;
    justify-content: flex-end !important;
    align-self: stretch !important;
  }

  .carousel-slide--image-sequence .image-sequence-player,
  .carousel-slide--dual-image-sequence .paired-dual-columns-player {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  .carousel-slide--image-sequence .image-sequence-player :deep(.image-sequence-player__stack),
  .carousel-slide--dual-image-sequence .paired-dual-columns-player :deep(.paired-dual-columns-player__stack) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  .carousel-slide--image-sequence .image-sequence-player :deep(picture img),
  .carousel-slide--image-sequence .image-sequence-player :deep(picture .slide-img),
  .carousel-slide--dual-image-sequence .paired-dual-columns-player :deep(picture img),
  .carousel-slide--dual-image-sequence .paired-dual-columns-player :deep(picture .slide-img) {
    max-width: 100% !important;
    flex-shrink: 1;
  }

  .project-detail-swiper :deep(.carousel-slide--image img),
  .project-detail-swiper :deep(.carousel-slide--image .slide-img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img) {
    display: block !important;
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    max-height: min(340px, 46dvh) !important;
    object-fit: contain !important;
    object-position: top center !important;
  }

  /* contain + max ancho/alto: evita recortes (width:100% forzaba escala mala con alto fijo) */
  .project-body.is-expanded .project-detail-swiper :deep(.carousel-slide--image img),
  .project-body.is-expanded .project-detail-swiper :deep(.carousel-slide--image .slide-img),
  .project-body.is-expanded .project-detail-swiper :deep(.carousel-slide--image-sequence img),
  .project-body.is-expanded .project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img) {
    width: auto !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: var(--carousel-h) !important;
    object-fit: contain !important;
    object-position: top center !important;
    margin-left: 0;
    margin-right: 0;
  }

  .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col--detalle img),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col--detalle .slide-img) {
    width: auto !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: min(calc(var(--carousel-h) * 0.68), 52dvh) !important;
    object-fit: contain !important;
    object-position: top center !important;
    margin-left: 0;
    margin-right: 0;
  }

  .project-body.is-expanded
    .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence .paired-sidebar__graphic--bottom img
    ),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        .slide-img
    ),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(
      .carousel-slide--dual-image-sequence
        .paired-sidebar__graphic--bottom
        .slide-img--graphic-thumb
    ) {
    width: auto !important;
    max-width: min(100%, 280px) !important;
    height: auto !important;
    max-height: min(calc(var(--carousel-h) * 0.28), 22dvh) !important;
    object-fit: contain !important;
    object-position: bottom center !important;
    margin-left: 0;
    margin-right: 0;
  }

  .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall img),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall .slide-img) {
    width: auto !important;
    max-width: min(92vw, 960px) !important;
    max-height: var(--carousel-h) !important;
    object-fit: contain !important;
  }

  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence img),
  .project-detail-swiper :deep(.carousel-slide--dual-image-sequence .slide-img) {
    display: block !important;
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    max-height: min(340px, 46dvh) !important;
    object-fit: contain !important;
    object-position: top center !important;
  }

  .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col img),
  .project-detail-swiper
    :deep(.carousel-slide--dual-image-sequence .dual-sequence-col .slide-img) {
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    max-height: min(300px, 44dvh) !important;
    object-fit: contain !important;
    object-position: top center !important;
  }

  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image img),
  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image .slide-img),
  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image-sequence img),
  .project-block--uniform-images .project-detail-swiper :deep(.carousel-slide--image-sequence .slide-img) {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    max-height: min(340px, 46dvh) !important;
    object-fit: contain !important;
  }

  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image img),
  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image .slide-img),
  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence img),
  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence .slide-img) {
    width: auto !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: var(--carousel-h) !important;
    object-fit: contain !important;
    object-position: top center !important;
    margin-left: 0;
    margin-right: 0;
  }

  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall img),
  .project-block--uniform-images
    .project-body.is-expanded
    .project-detail-swiper
    :deep(.carousel-slide--image-sequence.carousel-slide--sequence-tall .slide-img) {
    width: auto !important;
    max-width: min(92vw, 960px) !important;
    max-height: var(--carousel-h) !important;
    object-fit: contain !important;
  }

  .project-detail-swiper :deep(.swiper-pagination) {
    bottom: 0.35rem;
    line-height: 1;
  }

  .project-detail-swiper :deep(.swiper-pagination-bullet) {
    width: 7px;
    height: 7px;
    background: var(--text-dark, #2b2b2b);
    opacity: 0.28;
    vertical-align: middle;
  }

  .project-detail-swiper :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    background: var(--primary-color, #2b2b2b);
  }

  /* Proyecto expandido: alto fijo como las fotos → texto centrado en la misma franja */
  .project-body.is-expanded .project-detail-swiper {
    height: var(--carousel-h) !important;
    max-height: var(--carousel-h) !important;
    min-height: var(--carousel-h);
  }

  .project-body.is-expanded .project-detail-swiper :deep(.swiper) {
    height: 100% !important;
  }

  .project-body.is-expanded .project-detail-swiper :deep(.swiper-wrapper) {
    height: 100% !important;
  }

  .project-body.is-expanded .project-detail-swiper :deep(.swiper-slide) {
    height: 100% !important;
    overflow: hidden;
  }

  .project-body.is-expanded .carousel-slide {
    height: 100% !important;
  }

  /* Carrusel a alto fijo: figuras y stacks de secuencia no expanden el slide ni se salen */
  .project-body.is-expanded .carousel-slide--image .slide-figure,
  .project-body.is-expanded .carousel-slide--image .slide-figure--hero-toggle,
  .project-body.is-expanded .carousel-slide--image-sequence .slide-figure--inner-sequence,
  .project-body.is-expanded .carousel-slide--dual-image-sequence .slide-figure--dual-sequence {
    max-height: 100% !important;
    overflow: hidden;
  }

  .project-body.is-expanded .carousel-slide--dual-image-sequence .slide-figure--dual-sequence {
    flex: 1 1 auto;
    height: 100% !important;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .slide-figure--dual-sequence
    .paired-dual-columns-player--sidebar {
    flex: 1 1 auto;
    height: 100% !important;
    min-height: 0;
  }

  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-grid--sidebar.dual-sequence-grid--graphic-left) {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: stretch !important;
    height: 100%;
    min-height: 0;
  }

  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-col--detalle) {
    order: 1;
    height: 100%;
    min-height: 0;
  }

  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-dual-columns-player--sidebar
    :deep(.dual-sequence-col--graphic-mini),
  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-sidebar__graphic--bottom {
    order: 2;
    justify-content: flex-end !important;
    align-self: stretch !important;
    align-items: flex-start !important;
  }

  .project-body.is-expanded .carousel-slide--image-sequence .image-sequence-player,
  .project-body.is-expanded .carousel-slide--dual-image-sequence .image-sequence-player,
  .project-body.is-expanded .carousel-slide--dual-image-sequence .paired-dual-columns-player {
    max-height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-dual-columns-player
    :deep(.paired-dual-columns-player__stack--small),
  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .dual-sequence-col--graphic-mini,
  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-sidebar__graphic--bottom {
    max-height: none !important;
    overflow: visible !important;
  }

  .project-body.is-expanded .carousel-slide--image-sequence .image-sequence-player :deep(.image-sequence-player__stack),
  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .image-sequence-player
    :deep(.image-sequence-player__stack),
  .project-body.is-expanded
    .carousel-slide--dual-image-sequence
    .paired-dual-columns-player
    :deep(.paired-dual-columns-player__stack) {
    max-height: 100%;
    overflow: hidden;
  }

  .project-body.is-expanded .carousel-slide-parallax-layer {
    height: 100% !important;
    min-height: 100% !important;
    justify-content: flex-start;
  }

  .project-body.is-expanded
    .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--text),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--docs),
  .project-body.is-expanded
    .project-detail-swiper
    :deep(.swiper-slide.carousel-slide--pdf-slide) {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
  }

  .project-body.is-expanded .carousel-slide--text .carousel-slide-parallax-layer,
  .project-body.is-expanded .carousel-slide--docs .carousel-slide-parallax-layer,
  .project-body.is-expanded .carousel-slide--pdf-slide .carousel-slide-parallax-layer {
    flex: 1 1 auto;
    min-height: 100% !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    background: var(--bg-page);
  }

  .project-body.is-expanded .carousel-slide--text .slide-text-inner,
  .project-body.is-expanded .carousel-slide--docs .slide-text-inner,
  .project-body.is-expanded .carousel-slide--pdf-slide .slide-text-inner {
    margin-top: 0;
    margin-bottom: 0;
    flex-shrink: 0;
    max-height: 100%;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: var(--bg-page);
  }

  .slide-text-inner {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    flex: 0 0 auto;
    touch-action: pan-x pan-y pinch-zoom;
    padding: 0 0.75rem 1rem;
    scrollbar-width: none;
    overscroll-behavior: auto;
  }

  .project-body.is-expanded .slide-text-inner {
    max-height: 100% !important;
  }

  .slide-text-inner::-webkit-scrollbar {
    display: none;
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
