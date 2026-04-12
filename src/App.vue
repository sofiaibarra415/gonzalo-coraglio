<template>
  <div id="app">
    <Navigation />
    <Hero />
    <About />
    <Projects />
    <Contact />
    <Footer />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Hero,
    About,
    Projects,
    Contact,
    Footer
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
