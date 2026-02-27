// =============================================
// GREATER ATL HEALTH — app.js
// =============================================

// ---- Booking URL configuration ----
// Replace with your Calendly (or other scheduler) link when ready.
// e.g. 'https://calendly.com/greateratlhealth'
// Leave empty to fall back to scrolling the user to the booking widget.
const BOOKING_URL = 'https://calendly.com/lynaashu/telehealth';

// ---- Doxy.me waiting room (free tier) ----
// Sign up free at doxy.me, then replace YOUR_DOXY_USERNAME with your room name.
// e.g. 'https://doxy.me/greateratlhealth'
const DOXY_ROOM_URL = 'https://doxy.me/lynanp';

(function () {
  'use strict';

  // ---- Mobile nav toggle ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      })
    );
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // ---- Nav shadow on scroll ----
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 8
        ? '0 2px 16px rgba(0,0,0,0.08)'
        : 'none';
    }, { passive: true });
  }

  // ---- Active nav link on scroll ----
  const sections   = document.querySelectorAll('section[id], main[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if (sections.length && navAnchors.length) {
    const highlight = () => {
      const scrollY = window.scrollY + 100;
      let current = '';
      sections.forEach(s => { if (s.offsetTop <= scrollY) current = s.id; });
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
      });
    };
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 86;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  // ---- Scroll-reveal animations ----
  const revealEls = document.querySelectorAll(
    '.why-card, .service-card, .step-item, .review-card, ' +
    '.cred-badge, .provider-stats, .trust-item'
  );
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children) : [];
        const delay = Math.min(siblings.indexOf(entry.target) * 70, 350);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => { el.classList.add('reveal'); obs.observe(el); });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Open clicked (unless it was already open)
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ---- Booking: highlight selected visit type ----
  document.querySelectorAll('.visit-type-option').forEach(label => {
    const radio = label.querySelector('input[type="radio"]');
    const update = () => {
      document.querySelectorAll('.visit-type-option').forEach(l =>
        l.style.cssText = ''
      );
      if (radio.checked) {
        label.style.borderColor     = 'var(--accent)';
        label.style.background      = 'var(--accent-light)';
      }
    };
    radio.addEventListener('change', update);
    if (radio.checked) update(); // init state
  });

  // ---- Service links: pre-select visit type in booking widget ----
  document.querySelectorAll('.svc-link[data-visit-type]').forEach(link => {
    link.addEventListener('click', () => {
      const type  = link.dataset.visitType;
      const radio = document.querySelector(`input[name="visitType"][value="${type}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });
  });

  // ---- Book Now button: open booking system ----
  const bookBtn = document.getElementById('bookNowBtn');
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (BOOKING_URL) {
        window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback: scroll to the booking widget (works on both desktop & mobile)
        const bookSection = document.getElementById('book');
        if (bookSection) {
          const offset = nav ? nav.offsetHeight + 16 : 86;
          window.scrollTo({
            top: bookSection.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // ---- Back to top button ----
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // ---- Animated counters (hero provider stats) ----
  function counter(el, end, suffix = '') {
    const dur  = 1200;
    const start = performance.now();
    const run = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  const statEls = document.querySelectorAll('.pstat strong');
  if ('IntersectionObserver' in window && statEls.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const raw = el.textContent.trim();
        if (raw.includes('500')) counter(el, 500, '+');
        if (raw.includes('10'))  counter(el, 10,  '+');
        cObs.unobserve(el);
      });
    }, { threshold: .5 });
    statEls.forEach(el => cObs.observe(el));
  }

  // ---- Doxy.me join-visit buttons ----
  const doxyConfigured = DOXY_ROOM_URL && !DOXY_ROOM_URL.includes('REPLACE_WITH');

  document.querySelectorAll('.join-visit-btn').forEach(btn => {
    if (doxyConfigured) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(DOXY_ROOM_URL, '_blank', 'noopener,noreferrer');
      });
    } else {
      // Hide join-visit elements until Doxy.me is configured
      const wrapper = btn.closest('.join-appt-note, .nav-join-wrap');
      if (wrapper) wrapper.style.display = 'none';
      else btn.style.display = 'none';
    }
  });

  // ---- Email capture: async submit with inline success state ----
  const emailForm    = document.getElementById('emailCaptureForm');
  const emailSuccess = document.getElementById('emailSuccess');

  if (emailForm && emailSuccess) {
    emailForm.addEventListener('submit', async (e) => {
      const action = emailForm.getAttribute('action') || '';
      if (action.includes('REPLACE_WITH')) return; // not yet configured — let native POST through

      e.preventDefault();

      const submitBtn = emailForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(emailForm)
        });
        if (res.ok) {
          emailForm.style.display    = 'none';
          emailSuccess.style.display = 'flex';
        } else {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try again'; }
        }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try again'; }
      }
    });
  }

})();
