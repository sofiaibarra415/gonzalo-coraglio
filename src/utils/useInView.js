import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Sigue si el elemento está a la vista (también cuenta los recortes del carrusel horizontal
 * y los bloques ocultos con v-show). `onEnter` se llama cada vez que vuelve a aparecer.
 */
export function useInView(elRef, { threshold = 0.25, onEnter, onLeave } = {}) {
  const inView = ref(false)
  let observer = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined' || !elRef.value) {
      inView.value = true
      onEnter?.()
      return
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= threshold
        if (visible === inView.value) return
        inView.value = visible
        if (visible) onEnter?.()
        else onLeave?.()
      },
      { threshold: [0, threshold] }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { inView }
}
