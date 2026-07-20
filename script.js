/**
 * =========================================================
 * الإخوة — لقطع غيار التبريد
 * script.js · Micro-interactions & Entrance Animations
 * =========================================================
 */

'use strict';

/* ——————————————————————————————————————
   ENTRANCE ANIMATIONS
   —————————————————————————————————————— */
const animatedElements = document.querySelectorAll('.animate-fade-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

animatedElements.forEach((el) => revealObserver.observe(el));

/* ——————————————————————————————————————
   REDUCE MOTION RESPECT
   —————————————————————————————————————— */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  animatedElements.forEach((el) => {
    el.style.transition = 'none';
    el.classList.add('is-visible');
  });
}

/* ——————————————————————————————————————
   BUTTON RIPPLE EFFECT
   —————————————————————————————————————— */
const buttons = document.querySelectorAll('.btn');

buttons.forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');

    const rect  = btn.getBoundingClientRect();
    const size  = Math.max(rect.width, rect.height) * 1.5;
    const x     = e.clientX - rect.left - size / 2;
    const y     = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${x}px`,
      top:    `${y}px`,
    });

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ——————————————————————————————————————
   INJECT RIPPLE STYLES
   —————————————————————————————————————— */
(function injectRippleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .btn { position: relative; overflow: hidden; }
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0);
      animation: ripple-anim 0.55s linear;
      pointer-events: none;
    }
    @keyframes ripple-anim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ——————————————————————————————————————
   CARD HOVER — 3D TILT (non-touch only)
   —————————————————————————————————————— */
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
  const cards = document.querySelectorAll('.contact-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -3;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ——————————————————————————————————————
   STAT NUMBER COUNT-UP ANIMATION
   —————————————————————————————————————— */
function animateCountUp(el, target, suffix, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = '+' + Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (target < 100 ? '+' : '') + target + suffix;
  };
  requestAnimationFrame(update);
}

// Trigger stat count-up when stats strip enters view
const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        const numbers = statsStrip.querySelectorAll('.stat-number');
        // +15 سنة, +500 عميل, 100%
        if (numbers[0]) animateCountUp(numbers[0], 15, '', 1200);
        if (numbers[1]) animateCountUp(numbers[1], 500, '', 1600);
        if (numbers[2]) {
          // Special case for 100%
          const start = performance.now();
          const duration = 1400;
          const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            numbers[2].textContent = Math.floor(eased * 100) + '%';
            if (progress < 1) requestAnimationFrame(update);
            else numbers[2].textContent = '100%';
          };
          requestAnimationFrame(update);
        }
        statsObserver.unobserve(statsStrip);
      }
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(statsStrip);
}

/* ——————————————————————————————————————
   ACCESSIBLE KEYBOARD NAVIGATION
   —————————————————————————————————————— */
buttons.forEach((btn) => {
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});
