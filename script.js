/* ============================================================
   GrocerQuick POS — JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Año dinámico en el footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Menú móvil ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Cerrar el menú al pulsar un enlace (en móvil)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Sombra del header al hacer scroll ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? "var(--shadow-sm)" : "none";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Formulario de contacto (demo, sin backend) ---- */
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (form && msg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        msg.textContent = "Introduce un correo válido.";
        msg.className = "form-msg is-error";
        form.email.focus();
        return;
      }

      msg.textContent = "¡Gracias! Te contactaremos para agendar tu demo.";
      msg.className = "form-msg is-ok";
      form.reset();
    });
  }

  /* ---- Animación de entrada de las tarjetas ---- */
  const observed = document.querySelectorAll(".card, .quote");
  if ("IntersectionObserver" in window && observed.length) {
    observed.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observed.forEach((el) => io.observe(el));
  }
});