<template>
  <nav class="navigation" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-text">GC</span>
        <span class="logo-name">Gonzalo Coraglio</span>
      </div>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li><a href="#inicio" @click="scrollTo('inicio')">Inicio</a></li>
        <li><a href="#sobre-mi" @click="scrollTo('sobre-mi')">Sobre Mí</a></li>
        <li><a href="#proyectos" @click="scrollTo('proyectos')">Proyectos</a></li>
        <li><a href="#contacto" @click="scrollTo('contacto')">Contacto</a></li>
      </ul>
      <button class="menu-toggle" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const isScrolled = ref(false)
    const menuOpen = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const scrollTo = (id) => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        menuOpen.value = false
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled,
      menuOpen,
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
  z-index: 1000;
  background: rgba(218, 241, 222, 0.92);
  backdrop-filter: blur(10px);
  transition: var(--transition);
  padding: 1.5rem 0;
}

.navigation.scrolled {
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-text {
  font-family: 'Major Mono Display', ui-monospace, monospace;
  font-size: 2rem;
  font-weight: 400;
  color: var(--accent-color);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent-color);
  border-radius: 4px;
}

.logo-name {
  font-family: 'Major Mono Display', ui-monospace, monospace;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  align-items: center;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: var(--transition);
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: var(--transition);
}

.nav-menu a:hover::after {
  width: 100%;
}

.nav-menu a:hover {
  color: var(--accent-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 2px;
  background: var(--primary-color);
  transition: var(--transition);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateX(-100%);
    transition: var(--transition);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    transform: translateX(0);
  }

  .logo-name {
    display: none;
  }
}
</style>
