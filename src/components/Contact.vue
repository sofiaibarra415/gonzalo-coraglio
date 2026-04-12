<template>
  <section id="contacto" class="contact">
    <div class="container">
      <div class="contact-content">
        <div class="contact-info">
          <span class="section-label">Contacto</span>
          <h2 class="section-title">Trabajemos juntos</h2>
          <p class="contact-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </div>
              <div>
                <h4>Email</h4>
                <p>gonzalo.coraglio@arquitecto.com</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <h4>Teléfono</h4>
                <p>+54 11 1234-5678</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4>Ubicación</h4>
                <p>Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Behance</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Contact'
}
</script>

<style scoped>
.contact {
  padding: 6rem 0;
  background: transparent;
}

.contact-content {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.contact-info {
  position: static;
}

.section-label {
  display: inline-block;
  font-family: var(--font-sans);
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}

.section-title {
  font-family: var(--font-sans);
  font-size: 2.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.contact-description {
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 3rem;
  font-size: 1.05rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.contact-details {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
}

.contact-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  column-gap: 1rem;
  row-gap: 0.25rem;
  margin-bottom: 1.75rem;
  align-items: start;
  text-align: left;
  width: 100%;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.contact-item:last-of-type {
  margin-bottom: 0;
}

.contact-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-color);
  border-radius: 8px;
  flex-shrink: 0;
  color: var(--accent-color);
  justify-self: center;
}

.contact-icon svg {
  width: 22px;
  height: 22px;
}

.contact-item h4 {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary-color);
  margin-bottom: 0.3rem;
}

.contact-item p {
  color: var(--text-light);
  font-size: 0.95rem;
}

.social-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.social-link {
  padding: 0.8rem 1.5rem;
  background: var(--secondary-color);
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: var(--transition);
  border: 2px solid transparent;
}

.social-link:hover {
  background: transparent;
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contact {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.85rem;
  }
}
</style>
