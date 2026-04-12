<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-text">GC</span>
            <span class="logo-name">Gonzalo Coraglio</span>
          </div>
          <p class="footer-description">
            Arquitecto especializado en diseño innovador y sostenible. 
            Transformando visiones en espacios arquitectónicos excepcionales.
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Navegación</h4>
          <ul class="footer-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#sobre-mi">Sobre Mí</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Servicios</h4>
          <ul class="footer-links">
            <li>Diseño Arquitectónico</li>
            <li>Planificación Urbana</li>
            <li>Consultoría</li>
            <li>Supervisión de Obra</li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Contacto</h4>
          <ul class="footer-contact">
            <li>
              <span class="footer-contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </span>
              gonzalo.coraglio@arquitecto.com
            </li>
            <li>
              <span class="footer-contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              +54 11 1234-5678
            </li>
            <li>
              <span class="footer-contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              Buenos Aires, Argentina
            </li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Gonzalo Coraglio. Todos los derechos reservados.</p>
        <div class="footer-social">
          <a href="#" class="social-icon">LinkedIn</a>
          <a href="#" class="social-icon">Instagram</a>
          <a href="#" class="social-icon">Behance</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  setup() {
    const currentYear = new Date().getFullYear()
    return {
      currentYear
    }
  }
}
</script>

<style scoped>
.footer {
  background: var(--primary-color);
  color: var(--white);
  padding: 4rem 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.footer-logo .logo-text {
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

.footer-logo .logo-name {
  font-family: 'Major Mono Display', ui-monospace, monospace;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--white);
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-size: 0.95rem;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--white);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--accent-color);
  padding-left: 5px;
}

.footer-links li:not(:has(a)) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.footer-contact {
  list-style: none;
}

.footer-contact li {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.footer-contact-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent-color);
  opacity: 0.95;
}

.footer-contact-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.footer-social {
  display: flex;
  gap: 1.5rem;
}

.social-icon {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.social-icon:hover {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
