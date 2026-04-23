/* =============================================
   PUBLICA ADM 2026 — script.js
============================================= */

// ── Mobile nav toggle ─────────────────────
const navToggle = document.querySelector('.nav-toggle');
const mainNav   = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Active nav highlight on scroll ────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');

function setActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// ── Fade-in on scroll ─────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

// ── Stagger child cards ───────────────────
document.querySelectorAll('.dates-grid, .docs-grid, .rules-grid').forEach(grid => {
  grid.querySelectorAll('.date-card, .doc-card, .rule-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
  });
});
