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
          <p v-if="leftLabel" class="dual-sequence-col__label">{{ leftLabel }}</p>
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
          <p v-if="leftLabel" class="dual-sequence-col__label">{{ leftLabel }}</p>
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
          <p v-if="rightLabel" class="dual-sequence-col__label">{{ rightLabel }}</p>
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
    altLeft: { type: String, default: 'Detalle' },
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

.dual-sequence-grid {
  display: flex;
  flex-direction: row;
  gap: clamp(8px, 2vw, 20px);
  width: 100%;
  height: 100%;
  min-height: 0;
  align-items: stretch;
  justify-content: center;
  box-sizing: border-box;
}

.dual-sequence-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.dual-sequence-col .paired-dual-columns-player__stack {
  width: 100%;
  min-height: 0;
}

.dual-sequence-col__label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.88;
  text-align: center;
  max-width: 100%;
}

@media (max-width: 768px) {
  .dual-sequence-grid:not(.dual-sequence-grid--graphic-left) {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Mini gráfico izquierda | detalle principal derecha; bases alineadas abajo */
.dual-sequence-grid--sidebar.dual-sequence-grid--graphic-left {
  display: grid;
  grid-template-columns: minmax(88px, 200px) minmax(0, 1fr);
  gap: clamp(10px, 2.5vw, 20px);
  align-items: end;
}

.dual-sequence-col--graphic-mini {
  justify-content: flex-end;
  align-items: center;
  align-self: end;
  max-width: 200px;
}

.dual-sequence-col--detalle {
  min-height: 120px;
  justify-content: flex-end;
  align-items: center;
  align-self: end;
}

.paired-sidebar__graphic--bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 0;
}

.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img),
.paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(picture) {
  max-width: min(200px, 100%) !important;
  max-height: min(130px, 22vh) !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
}

@media (min-width: 769px) {
  .paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(.slide-img),
  .paired-sidebar__graphic--bottom .paired-dual-columns-player__frame :deep(picture) {
    max-width: min(220px, 100%) !important;
    max-height: min(160px, 26vh) !important;
  }
}

@media (max-width: 768px) {
  .dual-sequence-grid--graphic-left {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .dual-sequence-col--graphic-mini {
    order: 2;
    max-width: none;
    justify-content: center;
    align-self: center;
  }

  .dual-sequence-col--detalle {
    order: 1;
    justify-content: flex-start;
  }
}

.paired-dual-columns-player__stack--small {
  max-width: 100%;
  width: 100%;
}

.paired-dual-columns-player__stack {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
  width: 100%;
  min-height: 0;
}

.paired-dual-columns-player__frame {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  margin: 0;
}
</style>
