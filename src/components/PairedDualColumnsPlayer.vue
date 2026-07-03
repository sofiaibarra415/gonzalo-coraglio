<template>
  <div
    class="paired-dual-columns-player"
    :class="{ 'paired-dual-columns-player--sidebar': graphicMiniLeftAlignBottom }"
    role="img"
    :aria-label="ariaLabel"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <div
      class="dual-sequence-grid"
      :class="{
        'dual-sequence-grid--sidebar': graphicMiniLeftAlignBottom,
        'dual-sequence-grid--graphic-left': graphicMiniLeftAlignBottom
      }"
      role="group"
    >
      <template v-if="graphicMiniLeftAlignBottom">
        <div class="dual-sequence-col dual-sequence-col--graphic-mini">
          <div class="paired-sidebar__graphic paired-sidebar__graphic--bottom">
            <div
              class="paired-dual-columns-player__stack paired-dual-columns-player__stack--small"
            >
              <div
                v-for="(pair, i) in pairs"
                :key="'r-' + i"
                class="paired-dual-columns-player__frame"
                :class="{ 'is-active': i === currentIndex }"
                :aria-hidden="i !== currentIndex"
              >
                <OptimizedPicture
                  :src="pair.right"
                  :alt="`${altRight} — ${i + 1}`"
                  img-class="slide-img slide-img--graphic-thumb"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="dual-sequence-col dual-sequence-col--detalle">
          <h4 v-if="leftLabel" class="detail-heading detail-heading--v1 dual-sequence-col__label">
            {{ leftLabel }}
          </h4>
          <div class="paired-dual-columns-player__stack">
            <div
              v-for="(pair, i) in pairs"
              :key="'l-' + i"
              class="paired-dual-columns-player__frame"
              :class="{ 'is-active': i === currentIndex }"
              :aria-hidden="i !== currentIndex"
            >
              <OptimizedPicture
                :src="pair.left"
                :alt="`${altLeft} — ${i + 1}`"
                img-class="slide-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="dual-sequence-col dual-sequence-col--detalle">
          <h4 v-if="leftLabel" class="detail-heading detail-heading--v1 dual-sequence-col__label">
            {{ leftLabel }}
          </h4>
          <div class="paired-dual-columns-player__stack">
            <div
              v-for="(pair, i) in pairs"
              :key="'l-' + i"
              class="paired-dual-columns-player__frame"
              :class="{ 'is-active': i === currentIndex }"
              :aria-hidden="i !== currentIndex"
            >
              <OptimizedPicture
                :src="pair.left"
                :alt="`${altLeft} — ${i + 1}`"
                img-class="slide-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div class="dual-sequence-col">
          <h4 v-if="rightLabel" class="detail-heading detail-heading--v1 dual-sequence-col__label">
            {{ rightLabel }}
          </h4>
          <div class="paired-dual-columns-player__stack">
            <div
              v-for="(pair, i) in pairs"
              :key="'r-' + i"
              class="paired-dual-columns-player__frame"
              :class="{ 'is-active': i === currentIndex }"
              :aria-hidden="i !== currentIndex"
            >
              <OptimizedPicture
                :src="pair.right"
                :alt="`${altRight} — ${i + 1}`"
                img-class="slide-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'PairedDualColumnsPlayer',
  components: { OptimizedPicture },
  props: {
    pairs: { type: Array, required: true },
    leftLabel: { type: String, default: '' },
    rightLabel: { type: String, default: '' },
    altLeft: { type: String, default: 'Detalle constructivo' },
    altRight: { type: String, default: 'Gráfico' },
    intervalMs: { type: Number, default: 2000 },
    pauseOnHover: { type: Boolean, default: true },
    /** Gráfico mini a la izquierda, alineado abajo con la imagen principal (detalle a la derecha). Sin texto. */
    graphicMiniLeftAlignBottom: { type: Boolean, default: false }
  },
  setup(props) {
    const currentIndex = ref(0)
    const hoverPaused = ref(false)
    let timer = null

    const reducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ariaLabel = computed(
      () =>
        `${props.altLeft} y ${props.altRight}, vista ${currentIndex.value + 1} de ${props.pairs.length}`
    )

    const clearTimer = () => {
      if (timer != null) {
        clearInterval(timer)
        timer = null
      }
    }

    const shouldRun = () =>
      props.pairs.length > 1 &&
      !reducedMotion() &&
      !(props.pauseOnHover && hoverPaused.value)

    const tick = () => {
      const n = props.pairs.length
      if (n <= 1 || !shouldRun()) return
      currentIndex.value = (currentIndex.value + 1) % n
    }

    const start = () => {
      clearTimer()
      if (!shouldRun()) return
      timer = window.setInterval(tick, props.intervalMs)
    }

    const onHoverEnter = () => {
      if (!props.pauseOnHover) return
      hoverPaused.value = true
      clearTimer()
    }

    const onHoverLeave = () => {
      if (!props.pauseOnHover) return
      hoverPaused.value = false
      start()
    }

    watch(
      () => props.pairs,
      () => {
        currentIndex.value = 0
        start()
      },
      { deep: true }
    )

    watch(
      () => props.intervalMs,
      () => {
        start()
      }
    )

    onMounted(() => {
      start()
    })

    onUnmounted(() => {
      clearTimer()
    })

    return {
      currentIndex,
      ariaLabel,
      onHoverEnter,
      onHoverLeave
    }
  }
}
</script>

<style scoped>
.paired-dual-columns-player {
  width: 100%;
  max-width: 100%;
}

.paired-dual-columns-player--sidebar,
.paired-dual-columns-player--sidebar .dual-sequence-grid--graphic-left {
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

.dual-sequence-col .paired-dual-columns-player__stack {
  width: 100%;
  min-height: 0;
}

.dual-sequence-col__label {
  margin: 0 0 0.65rem;
  font-family: var(--project-font, var(--font-display));
  font-size: var(--project-title-size, 16px);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: var(--project-line-height, normal);
  color: var(--text-light);
  font-style: normal;
  text-align: left;
  max-width: 100%;
}

@media (max-width: 768px) {
  .dual-sequence-grid:not(.dual-sequence-grid--graphic-left) {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Mini gráfico izquierda | detalle principal derecha; gráfico abajo */
.dual-sequence-grid--sidebar.dual-sequence-grid--graphic-left {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: clamp(10px, 2.5vw, 20px);
  align-items: stretch;
  height: 100%;
  min-height: 0;
}

.dual-sequence-col--graphic-mini {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  align-self: stretch;
  width: fit-content;
  max-width: min(200px, 100%);
  min-height: 0;
  overflow: visible;
}

.dual-sequence-col--detalle {
  min-height: 120px;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: start;
}

.paired-sidebar__graphic--bottom {
  width: fit-content;
  max-width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  min-height: 0;
  margin-top: auto;
  overflow: visible;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__stack--small {
  width: fit-content;
  max-width: 100%;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame {
  width: fit-content;
  max-width: 100%;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img--graphic-thumb),
.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img) {
  display: block;
  max-width: min(200px, 100%) !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
  object-position: bottom center !important;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(picture) {
  display: block;
  width: auto;
  max-width: min(200px, 100%);
  margin: 0;
  overflow: visible;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__stack--small,
.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame {
  overflow: visible;
}

@media (min-width: 769px) {
  .paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img--graphic-thumb),
  .paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img),
  .paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(picture) {
    max-width: min(220px, 100%) !important;
  }
}

@media (max-width: 768px) {
  .paired-dual-columns-player--sidebar,
  .paired-dual-columns-player--sidebar .dual-sequence-grid--graphic-left {
    height: 100%;
    min-height: 0;
  }

  .dual-sequence-grid--sidebar.dual-sequence-grid--graphic-left {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: 1fr;
    align-items: stretch;
    height: 100%;
    min-height: 0;
    gap: clamp(6px, 2vw, 12px);
  }

  .dual-sequence-col--detalle {
    order: 1;
    min-height: 0;
    height: 100%;
    justify-content: flex-start;
    align-self: stretch;
  }

  .dual-sequence-col--graphic-mini {
    order: 2;
    width: fit-content;
    max-width: min(120px, 32vw);
    justify-content: flex-end;
    align-items: flex-start;
    align-self: stretch;
    margin-top: 0;
    min-height: 0;
  }

  .paired-sidebar__graphic--bottom {
    margin-top: auto;
    align-items: flex-end;
  }
}

.paired-dual-columns-player__stack--small {
  max-width: 100%;
  width: fit-content;
}

.paired-dual-columns-player__stack {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: start;
  width: 100%;
  min-height: 0;
}

.paired-dual-columns-player__frame {
  grid-area: 1 / 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  opacity: 0;
  transition: opacity 0.55s ease;
  pointer-events: none;
  z-index: 0;
}

.paired-dual-columns-player__frame.is-active {
  opacity: 1;
  z-index: 1;
  pointer-events: auto;
}

.paired-dual-columns-player__frame :deep(picture) {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  margin: 0;
}
</style>
