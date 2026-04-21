<template>
  <div
    class="image-sequence-player"
    role="img"
    :aria-label="ariaLabel"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <div class="image-sequence-player__stack">
      <div
        v-for="(src, i) in images"
        :key="`${i}-${src}`"
        class="image-sequence-player__frame"
        :class="{ 'is-active': i === currentIndex }"
        :aria-hidden="i !== currentIndex"
      >
        <OptimizedPicture
          :src="src"
          :alt="`${altBase} — ${i + 1}`"
          img-class="slide-img"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import OptimizedPicture from './OptimizedPicture.vue'

export default {
  name: 'ImageSequencePlayer',
  components: { OptimizedPicture },
  props: {
    images: { type: Array, required: true },
    altBase: { type: String, default: 'Vista' },
    intervalMs: { type: Number, default: 2000 },
    pauseOnHover: { type: Boolean, default: true }
  },
  setup(props) {
    const currentIndex = ref(0)
    const hoverPaused = ref(false)
    let timer = null

    const reducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ariaLabel = computed(
      () => `${props.altBase}, imagen ${currentIndex.value + 1} de ${props.images.length}`
    )

    const clearTimer = () => {
      if (timer != null) {
        clearInterval(timer)
        timer = null
      }
    }

    const shouldRun = () =>
      props.images.length > 1 && !reducedMotion() && !(props.pauseOnHover && hoverPaused.value)

    const tick = () => {
      const n = props.images.length
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
      () => props.images,
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
.image-sequence-player {
  width: 100%;
  max-width: 100%;
}

.image-sequence-player__stack {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
  width: 100%;
  min-height: 0;
}

.image-sequence-player__frame {
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

.image-sequence-player__frame.is-active {
  opacity: 1;
  z-index: 1;
  pointer-events: auto;
}

.image-sequence-player__frame :deep(picture) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  margin: 0;
}
</style>
