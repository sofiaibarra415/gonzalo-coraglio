<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <a href="#inicio" class="footer-logo" aria-label="Gonzalo Coraglio — volver al inicio">
            <span class="logo-text">
              <span class="logo-letter">G</span>
              <span class="logo-letter">C</span>
            </span>
          </a>
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
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 4rem 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.5rem;
  text-decoration: none;
  outline: none;
  width: fit-content;
}

.footer-logo:focus-visible .logo-text {
  outline: 2px solid var(--accent-color);
  outline-offset: 3px;
}

.footer-logo .logo-text {
  font-family: var(--font-display);
  font-size: 2.15rem;
  font-weight: 700;
  font-style: normal;
  color: var(--accent-2-color);
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.02em;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.45);
}

.footer-logo .logo-letter {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.footer-logo:hover .logo-letter:nth-child(1) {
  transform: translateY(-5px) rotate(-10deg);
}

.footer-logo:hover .logo-letter:nth-child(2) {
  transform: translateY(5px) rotate(10deg);
  transition-delay: 0.04s;
}

@media (prefers-reduced-motion: reduce) {
  .footer-logo .logo-letter {
    transition: none;
  }

  .footer-logo:hover .logo-letter:nth-child(1),
  .footer-logo:hover .logo-letter:nth-child(2) {
    transform: none;
    transition-delay: 0s;
  }
}

.footer-description {
  color: var(--footer-muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

.footer-section h4 {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: var(--footer-text);
  opacity: 0.85;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: var(--footer-muted);
  text-decoration: none;
  transition: var(--transition);
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--accent-color);
  padding-left: 5px;
}

.footer-links li:not(:has(a)) {
  color: var(--footer-muted);
  font-size: 0.95rem;
}

.footer-contact {
  list-style: none;
}

.footer-contact li {
  margin-bottom: 1rem;
  color: var(--footer-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.footer-contact-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent-2-color);
  opacity: 0.95;
}

.footer-contact-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}

.footer-bottom {
  border-top: 1px solid var(--footer-border);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.footer-social {
  display: flex;
  gap: 1.5rem;
}

.social-icon {
  color: var(--footer-muted);
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
