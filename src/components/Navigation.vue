<template>
  <Teleport to="body">
    <div
      v-show="menuOpen"
      class="nav-backdrop"
      aria-hidden="true"
      @click="closeMenu"
    />
  </Teleport>
  <nav class="navigation" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <a
        href="#inicio"
        class="logo"
        aria-label="Gonzalo Coraglio — inicio"
        @click.prevent="scrollTo('inicio')"
      >
        <span class="logo-mark" aria-hidden="true"></span>
      </a>
      <button
        type="button"
        class="menu-toggle"
        :class="{ 'is-open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-controls="nav-menu-panel"
        aria-label="Abrir o cerrar menú"
        @click.stop="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <aside
      id="nav-menu-panel"
      class="nav-drawer"
      :class="{ active: menuOpen }"
      :aria-hidden="!menuOpen"
      aria-label="Menú de navegación"
      @click.stop
    >
      <ul class="nav-drawer-list">
        <li>
          <a href="#inicio" @click.prevent="scrollTo('inicio')">Inicio</a>
        </li>
        <li>
          <a href="#sobre-mi" @click.prevent="scrollTo('sobre-mi')">Sobre Mí</a>
        </li>
        <li>
          <a href="#proyectos" @click.prevent="scrollTo('proyectos')">Proyectos</a>
        </li>
        <li>
          <a href="#contacto" @click.prevent="scrollTo('contacto')">Contacto</a>
        </li>
      </ul>
    </aside>
  </nav>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const isScrolled = ref(false)
    const menuOpen = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const closeMenu = () => {
      menuOpen.value = false
    }

    const scrollTo = (id) => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        menuOpen.value = false
      }
    }

    const onEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }

    watch(menuOpen, (open) => {
      if (typeof document === 'undefined') return
      document.body.style.overflow = open ? 'hidden' : ''
      if (open) {
        document.addEventListener('keydown', onEscape)
      } else {
        document.removeEventListener('keydown', onEscape)
      }
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    })

    return {
      isScrolled,
      menuOpen,
      closeMenu,
      scrollTo
    }
  }
}
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1002;
  /* Arriba: totalmente transparente, sin blur */
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transition:
    background 0.35s ease,
    backdrop-filter 0.35s ease,
    -webkit-backdrop-filter 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    padding 0.3s ease;
  padding: 1.25rem 0;
}

.navigation.scrolled {
  padding: 0.85rem 0;
  /* Más transparente y menos “chapa blanca”: tono neutro suave */
  background: rgba(245, 246, 248, 0.22);
  backdrop-filter: blur(20px) saturate(1.05);
  -webkit-backdrop-filter: blur(20px) saturate(1.05);
  border-bottom-color: rgba(43, 43, 43, 0.06);
  box-shadow: 0 2px 14px rgba(43, 43, 43, 0.03);
}

.nav-container {
  position: relative;
  /* Por encima de .nav-drawer (1001): si no, el panel tapa el botón y la “cruz” no recibe clics */
  z-index: 1005;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Menú a la derecha */
.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  padding: 10px;
  margin: 0 -6px 0 0;
  flex-shrink: 0;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    filter 0.35s ease;
  -webkit-tap-highlight-color: transparent;
  /* Ayuda a leer el icono blanco sobre el hero */
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.55));
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.14);
}

.menu-toggle:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: #ffffff;
  border-radius: 1px;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease,
    background 0.35s ease;
  transform-origin: center;
}

/* Barra con blur: fondo claro → líneas oscuras para contraste */
.navigation.scrolled .menu-toggle {
  filter: none;
}

.navigation.scrolled .menu-toggle:hover {
  background: rgba(43, 43, 43, 0.06);
}

.navigation.scrolled .menu-toggle span {
  background: var(--color-charcoal);
}

.menu-toggle.is-open span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.is-open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.is-open span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  outline: none;
}

/* Panel desde la derecha (junto al icono del menú) */
.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  left: auto;
  z-index: 1001;
  width: min(100%, 380px);
  max-width: 100%;
  height: 100vh;
  height: 100dvh;
  margin: 0;
  padding: 5.75rem 2rem 2rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px) saturate(1.1);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
  border-left: 1px solid rgba(43, 43, 43, 0.08);
  box-shadow: -8px 0 40px rgba(43, 43, 43, 0.08);
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translateX(100%);
  visibility: hidden;
  pointer-events: none;
  transition:
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.38s;
}

.nav-drawer.active {
  transform: translateX(0);
  visibility: visible;
  pointer-events: auto;
}

.nav-drawer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.nav-drawer-list a {
  display: block;
  padding: 0.85rem 0.25rem;
  text-decoration: none;
  color: var(--color-charcoal);
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  border-radius: 6px;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.nav-drawer-list a:hover {
  color: var(--accent-color);
  background: rgba(43, 43, 43, 0.04);
}

.nav-drawer-list a:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .nav-drawer {
    width: 100%;
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navigation,
  .nav-drawer {
    transition-duration: 0.01ms;
  }

  .menu-toggle span {
    transition-duration: 0.15ms;
  }
}
</style>

<style>
/* Debajo de la barra, encima del contenido */
.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(43, 43, 43, 0.38);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
