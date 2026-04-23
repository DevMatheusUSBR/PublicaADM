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
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
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

// ── Header shadow ao rolar ─────────────────
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// ── Easing ────────────────────────────────
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// ── Hero: animação de entrada na carga ─────
function heroEntrance() {
  const ease = 'cubic-bezier(.22,1,.36,1)';

  // Texto esquerdo — slide up em cascata
  [
    document.querySelector('.eyebrow'),
    document.querySelector('.hero h1'),
    document.querySelector('.hero-desc'),
    document.querySelector('.hero-actions'),
  ].forEach((el, i) => {
    if (!el) return;
    Object.assign(el.style, {
      opacity: '0',
      transform: 'translateY(30px)',
      transition: `opacity .75s ${ease} ${i * 130}ms, transform .75s ${ease} ${i * 130}ms`,
    });
  });

  // Cards direita — slide da direita em cascata
  document.querySelectorAll('.hero-info-card').forEach((card, i) => {
    Object.assign(card.style, {
      opacity: '0',
      transform: 'translateX(40px)',
      transition: `opacity .7s ${ease} ${180 + i * 110}ms, transform .7s ${ease} ${180 + i * 110}ms`,
    });
  });

  // Acionar no próximo frame (garante que os estilos iniciais foram aplicados)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll(
      '.eyebrow, .hero h1, .hero-desc, .hero-actions, .hero-info-card'
    ).forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
  }));
}

window.addEventListener('DOMContentLoaded', heroEntrance);

// ── Scroll reveal universal ────────────────
function revealOnScroll(selector, direction = 'up', stepMs = 80) {
  const ease    = 'cubic-bezier(.22,1,.36,1)';
  const initTx  = { up: 'translateY(26px)', left: 'translateX(-26px)', right: 'translateX(26px)' };

  document.querySelectorAll(selector).forEach((el, i) => {
    Object.assign(el.style, {
      opacity: '0',
      transform: initTx[direction],
      transition: `opacity .65s ${ease} ${i * stepMs}ms, transform .65s ${ease} ${i * stepMs}ms`,
    });

    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        el.style.opacity   = '1';
        el.style.transform = 'none';
        obs.disconnect();
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' }).observe(el);
  });
}

revealOnScroll('.section-header',    'up',    0);
revealOnScroll('.stat-item',         'up',  100);
revealOnScroll('.date-card',         'up',   70);
revealOnScroll('.rule-card',         'up',   80);
revealOnScroll('.doc-card',          'up',   90);
revealOnScroll('.area-chip',         'left', 30);
revealOnScroll('.area-note',         'up',    0);
revealOnScroll('.split-left',        'left',  0);
revealOnScroll('.cta-content',       'left',  0);
revealOnScroll('.cta-card',          'right', 80);

// ── Counter animation nos stats ────────────
function animateCount(el, end, suffix, duration = 1500) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(end * easeOutExpo(t)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = end + suffix;
  }
  requestAnimationFrame(tick);
}

// Um único observer por stat-item, com flag para disparar só uma vez
document.querySelectorAll('.stat-item').forEach(item => {
  const numEl = item.querySelector('.stat-number');
  if (!numEl) return;

  // Só anima padrões numéricos simples (ex: "80h") — ignora "Top 3", "03/08" etc.
  const raw  = numEl.textContent.trim();
  const match = raw.match(/^(\d+)(h?)$/);
  if (!match) return; // não é um número simples, não anima

  let fired = false;
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || fired) return;
      fired = true;
      animateCount(numEl, parseInt(match[1]), match[2]);
      obs.disconnect();
    });
  }, { threshold: 0.7 }).observe(item);
});

// ── Fade-in legado (backward compat) ───────
document.querySelectorAll('.fade-in').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.disconnect();
    });
  }, { threshold: 0.12 }).observe(el);
});
