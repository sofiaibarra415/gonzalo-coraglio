<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <a href="#inicio" class="footer-logo" aria-label="Gonzalo Coraglio — volver al inicio">
          <span class="logo-mark" aria-hidden="true"></span>
        </a>

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
          <li>
            <a href="#" class="footer-contact-icon footer-contact-icon--link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Gonzalo Coraglio. Todos los derechos reservados.</p>
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
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  outline: none;
  width: fit-content;
  flex-shrink: 0;
}

.footer-logo .logo-mark {
  width: 350px;
  height: 200px;
}

.footer .container{
  max-width: none !important;
}

.footer-contact {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: auto;
  margin-right: 25%;
}

.footer-contact li {
  color: var(--footer-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.footer-contact-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid var(--footer-border);
  color: var(--footer-muted);
  transition: var(--transition);
}

.footer-contact-icon svg {
  width: 18px;
  height: 18px;
  display: block;
}

.footer-contact-icon--link {
  text-decoration: none;
}

.footer-contact-icon:hover {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: var(--white);
  transform: translateY(-2px);
}

.footer-bottom {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .footer-logo .logo-mark {
    width: 160px;
    height: 160px;
  }

  .footer-contact {
    align-items: center;
    gap: 0.85rem;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
