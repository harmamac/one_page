/**
 * =========================================================
 * AUTOMOTIVE SPARE PARTS — QR LANDING PAGE
 * script.js · Micro-interactions & Entrance Animations
 * =========================================================
 */

'use strict';

/* ——————————————————————————————————————
   ENTRANCE ANIMATIONS
   Triggers fade-up reveal on page load
   using IntersectionObserver for performance.
   —————————————————————————————————————— */
const animatedElements = document.querySelectorAll('.animate-fade-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after reveal — no need to re-trigger
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

animatedElements.forEach((el) => revealObserver.observe(el));

/* ——————————————————————————————————————
   BUTTON RIPPLE EFFECT
   Adds a subtle material-style ripple
   on button click for premium tactile feel.
   —————————————————————————————————————— */
const buttons = document.querySelectorAll('.btn');

buttons.forEach((btn) => {
  btn.addEventListener('click', function (e) {
    // Create ripple span
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');

    // Position ripple at click point
    const rect  = btn.getBoundingClientRect();
    const size  = Math.max(rect.width, rect.height) * 1.5;
    const x     = e.clientX - rect.left - size / 2;
    const y     = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      width:    `${size}px`,
      height:   `${size}px`,
      left:     `${x}px`,
      top:      `${y}px`,
    });

    btn.appendChild(ripple);

    // Remove ripple element after animation
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ——————————————————————————————————————
   INJECT RIPPLE STYLES DYNAMICALLY
   Keeps CSS self-contained but adds the
   ripple keyframe via JS to avoid any
   extra CSS file dependency.
   —————————————————————————————————————— */
(function injectRippleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.28);
      transform: scale(0);
      animation: ripple-anim 0.52s linear;
      pointer-events: none;
    }
    @keyframes ripple-anim {
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* ——————————————————————————————————————
   CARD HOVER — SUBTLE TILT (OPTIONAL)
   Adds a slight 3-D perspective tilt
   on mouse move for premium feel.
   Only runs on non-touch devices for
   performance and UX reasons.
   —————————————————————————————————————— */
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
  const cards = document.querySelectorAll('.contact-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4; // max 4deg
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ——————————————————————————————————————
   ACCESSIBLE KEYBOARD NAVIGATION
   Ensures Enter/Space key triggers
   the button link action for full
   keyboard accessibility.
   —————————————————————————————————————— */
buttons.forEach((btn) => {
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

/* ——————————————————————————————————————
   REDUCE MOTION RESPECT
   Disables animations for users who
   prefer reduced motion (accessibility).
   —————————————————————————————————————— */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Immediately show all animated elements without transition
  animatedElements.forEach((el) => {
    el.style.transition = 'none';
    el.classList.add('is-visible');
  });
}
