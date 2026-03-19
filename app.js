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

  // ---- Scroll-reveal animations (GSAP ScrollTrigger) ----
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.hero-text > *', {
      opacity: 0, y: 32, duration: 0.7, stagger: 0.12,
      ease: 'power2.out', delay: 0.15
    });
    gsap.from('.hero-card', {
      opacity: 0, x: 48, duration: 0.8, ease: 'power2.out', delay: 0.35
    });

    // Staggered section reveals
    [
      { targets: '.why-card',          trigger: '.why-grid' },
      { targets: '.service-card',      trigger: '.services-grid' },
      { targets: '.step-item',         trigger: '.steps-row' },
      { targets: '.carousel-slide .review-card', trigger: '.carousel-track' },
      { targets: '.faq-item',          trigger: '.faq-list' },
      { targets: '.cred-badge',        trigger: '.about-creds' },
      { targets: '.trust-item',        trigger: '.trust-row' },
      { targets: '.email-capture-inner', trigger: '.email-capture-section' },
    ].forEach(({ targets, trigger }) => {
      const els = document.querySelectorAll(targets);
      if (!els.length || !document.querySelector(trigger)) return;
      gsap.from(els, {
        scrollTrigger: { trigger, start: 'top 82%', once: true },
        opacity: 0, y: 36, duration: 0.6, stagger: 0.09, ease: 'power2.out'
      });
    });
  } else {
    // Fallback: simple IntersectionObserver reveal
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
    document.querySelectorAll(
      '.why-card, .service-card, .step-item, .review-card, .cred-badge, .provider-stats, .trust-item'
    ).forEach(el => { el.classList.add('reveal'); obs.observe(el); });
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
  document.querySelectorAll('.pstat strong').forEach(el => {
    const raw = el.textContent.trim();
    const targets = raw.includes('500') ? { end: 500, suffix: '+',  dec: 0 }
                  : raw.includes('10')  ? { end: 10,  suffix: '+',  dec: 0 }
                  : raw.includes('4.9') ? { end: 4.9, suffix: '\u2605', dec: 1 }
                  : null;
    if (!targets) return;

    const fmt = (v) => (targets.dec ? v.toFixed(targets.dec) : Math.round(v)) + targets.suffix;

    const animate = () => {
      if (window.gsap) {
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: targets.end, duration: 1.4, ease: 'power2.out',
          onUpdate() { el.textContent = fmt(proxy.val); }
        });
      } else {
        // Fallback RAF counter
        const dur = 1200, t0 = performance.now();
        const run = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = fmt(targets.end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        animate(); obs.unobserve(el);
      }, { threshold: 0.5 });
      obs.observe(el);
    }
  });

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

  // ---- #10 Scroll progress bar ----
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
    }, { passive: true });
  }

  // ---- #5 Toast notification system ----
  function showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.textContent = msg;
    container.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 350);
    }, 3500);
  }

  // ---- #4 Sticky booking bar ----
  const stickyBar = document.getElementById('stickyBookBar');
  if (stickyBar) {
    const heroSection = document.querySelector('.hero');
    const checkSticky = () => {
      if (!heroSection) return;
      const threshold = heroSection.offsetTop + heroSection.offsetHeight;
      stickyBar.classList.toggle('visible', window.scrollY > threshold);
    };
    window.addEventListener('scroll', checkSticky, { passive: true });
    checkSticky();
  }

  // ---- #3 Review carousel — all screen sizes ----
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselDots  = document.querySelectorAll('.carousel-dot');
  const prevBtn       = document.getElementById('carouselPrev');
  const nextBtn       = document.getElementById('carouselNext');

  if (carouselTrack && carouselDots.length) {
    let current   = 0;
    const total   = carouselDots.length;
    let autoTimer = null;

    const goTo = (idx) => {
      current = (idx + total) % total;
      carouselTrack.style.transform = `translateX(-${current * 100}%)`;
      carouselDots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    carouselDots.forEach(dot =>
      dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAuto(); })
    );

    // Touch/swipe support
    let touchStartX = 0;
    carouselTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carouselTrack.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    startAuto();
  }

  // ---- #6 FAQ search / filter ----
  const faqSearch = document.getElementById('faqSearch');
  const faqNoResults = document.getElementById('faqNoResults');
  if (faqSearch) {
    faqSearch.addEventListener('input', () => {
      const q = faqSearch.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const show = !q || text.includes(q);
        item.classList.toggle('faq-hidden', !show);
        if (show) visible++;
      });
      if (faqNoResults) faqNoResults.classList.toggle('show', visible === 0 && q !== '');
    });
  }

  // ---- #8 Service card expand / collapse (visible by default, toggle to collapse) ----
  document.querySelectorAll('.svc-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card      = btn.closest('.service-card');
      const collapsed = card.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.innerHTML = collapsed
        ? 'Show details <span class="svc-expand-arrow">&#8964;</span>'
        : 'Hide details <span class="svc-expand-arrow">&#8964;</span>';
    });
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
          showToast('✓ You\'re subscribed — thanks for joining!', 'success');
        } else {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Stay Informed →'; }
          showToast('Something went wrong. Please try again.', 'error');
        }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Stay Informed →'; }
        showToast('Network error. Please check your connection.', 'error');
      }
    });
  }

  // ---- Service Finder Quiz ----
  const quizOverlay  = document.getElementById('quizOverlay');
  const quizClose    = document.getElementById('quizClose');
  const quizTrigger  = document.getElementById('quizTrigger');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizRestart  = document.getElementById('quizRestart');

  const quizResults = {
    ondemand:  { name: 'On-Demand Video Visit', price: '$75 self-pay', desc: 'Connect in minutes for urgent concerns. No appointment needed — join the virtual queue and I\'ll see you as soon as possible.', type: 'ondemand' },
    notwell:   { name: 'Illness Visit', price: '$75 self-pay', desc: 'For non-emergency illnesses: UTIs, sinus infections, pink eye, allergies, COVID guidance and more.', type: 'notwell' },
    dot:       { name: 'DOT Physical Exam', price: '$125 self-pay', desc: 'FMCSA-compliant exam with same-day medical certificate for CDL drivers.', type: 'dot' },
    sports:    { name: 'Sports Physical & Clearance', price: '$40 self-pay', desc: 'School & NCAA clearance forms, cardiac screening, and return-to-play evaluations.', type: 'sports' },
    preventive:{ name: 'Preventive & Ongoing Care', price: '$100 self-pay', desc: 'Annual wellness visits, chronic condition management, labs, and personalized care plans.', type: 'preventive' },
    weightloss:{ name: 'Weight Loss Program', price: 'Starting at $100+', desc: 'Medically supervised with GLP-1 options, nutrition coaching, and regular progress check-ins.', type: 'weightloss' },
  };

  function openQuiz() {
    quizOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    showQuizStep('quizStep1');
    if (quizProgressBar) quizProgressBar.style.width = '33%';
  }
  function closeQuiz() {
    quizOverlay.hidden = true;
    document.body.style.overflow = '';
  }
  function showQuizStep(id, progress) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById(id);
    if (step) step.classList.add('active');
    if (progress && quizProgressBar) quizProgressBar.style.width = progress;
  }
  function showQuizResult(resultKey) {
    const r = quizResults[resultKey];
    if (!r) return;
    const el = document.getElementById('quizResult');
    if (!el) return;
    el.innerHTML = `
      <div class="quiz-result-tag">&#10003; Best Match</div>
      <h4>${r.name}</h4>
      <div class="quiz-result-price">${r.price}</div>
      <p>${r.desc}</p>
      <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary">Book ${r.name} &rarr;</a>
    `;
    showQuizStep('quizStep3', '100%');
  }

  if (quizTrigger)  quizTrigger.addEventListener('click', openQuiz);
  if (quizClose)    quizClose.addEventListener('click', closeQuiz);
  if (quizRestart)  quizRestart.addEventListener('click', () => { openQuiz(); });
  if (quizOverlay)  quizOverlay.addEventListener('click', e => { if (e.target === quizOverlay) closeQuiz(); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && quizOverlay && !quizOverlay.hidden) closeQuiz(); });

  document.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const next   = btn.dataset.next;
      const result = btn.dataset.result;
      if (result) {
        showQuizResult(result);
      } else if (next) {
        const progress = next === '2' || next === '2b' || next === '2c' || next === '2d' ? '66%' : '100%';
        showQuizStep('quizStep' + next, progress);
      }
    });
  });

  // ---- DOT Physical Readiness Checklist ----
  const dotOverlay  = document.getElementById('dotChecklistOverlay');
  const dotClose    = document.getElementById('dotChecklistClose');
  const dotTrigger  = document.getElementById('dotChecklistTrigger');
  const dotReadyMsg = document.getElementById('dotReadyMsg');

  function openDotChecklist() {
    if (dotOverlay) { dotOverlay.hidden = false; document.body.style.overflow = 'hidden'; }
  }
  function closeDotChecklist() {
    if (dotOverlay) { dotOverlay.hidden = true; document.body.style.overflow = ''; }
  }
  if (dotTrigger) dotTrigger.addEventListener('click', openDotChecklist);
  if (dotClose)   dotClose.addEventListener('click', closeDotChecklist);
  if (dotOverlay) dotOverlay.addEventListener('click', e => { if (e.target === dotOverlay) closeDotChecklist(); });

  document.querySelectorAll('.dot-check-input').forEach(cb => {
    cb.addEventListener('change', () => {
      const all = document.querySelectorAll('.dot-check-input');
      const allChecked = Array.from(all).every(c => c.checked);
      if (dotReadyMsg) dotReadyMsg.hidden = !allChecked;
    });
  });

  // ---- Symptom Finder ----
  const symptomData = {
    head:    { title: 'Head & Throat Conditions', items: ['Sinus infections', 'Strep throat', 'Ear infections', 'Pink eye (conjunctivitis)', 'Migraines', 'Allergies', 'Cough & cold', 'Fever'] },
    chest:   { title: 'Chest & Respiratory', items: ['Bronchitis', 'Asthma flares', 'COVID-19 guidance', 'Shortness of breath (non-emergency)', 'Flu', 'Upper respiratory infections', 'Chest congestion', 'Cough (acute)'] },
    skin:    { title: 'Skin & Rash Concerns', items: ['Rashes & hives', 'Eczema flares', 'Skin infections', 'Acne', 'Insect bites', 'Contact dermatitis', 'Minor wounds', 'Psoriasis management'] },
    chronic: { title: 'Chronic Condition Management', items: ['Diabetes (Type 1 & 2)', 'Hypertension', 'High cholesterol', 'Thyroid disease', 'Obesity management', 'Hormonal imbalances', 'Preventive screenings', 'Medication refills'] },
    injury:  { title: 'Minor Injuries & Pain', items: ['Sprains & strains', 'Back pain (non-emergency)', 'Joint pain', 'Muscle soreness', 'Return-to-play eval', 'Minor lacerations', 'Tendonitis', 'Overuse injuries'] },
    womens:  { title: "Women's Health", items: ['UTIs', 'Yeast infections', 'Hormonal concerns', 'Contraception discussions', 'Menstrual irregularities', 'Thyroid & weight concerns', 'Preventive labs', 'Referrals & screenings'] },
  };

  const symptomResult     = document.getElementById('symptomResult');
  const symptomResultTitle = document.getElementById('symptomResultTitle');
  const symptomResultList  = document.getElementById('symptomResultList');
  const symptomResultClose = document.getElementById('symptomResultClose');

  document.querySelectorAll('.symptom-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const data = symptomData[cat];
      if (!data || !symptomResult) return;
      document.querySelectorAll('.symptom-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (symptomResultTitle) symptomResultTitle.textContent = data.title;
      if (symptomResultList)  symptomResultList.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
      symptomResult.hidden = false;
      symptomResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  if (symptomResultClose) {
    symptomResultClose.addEventListener('click', () => {
      symptomResult.hidden = true;
      document.querySelectorAll('.symptom-cat').forEach(b => b.classList.remove('active'));
    });
  }

  // ---- Credential Tooltips (touch support) ----
  document.querySelectorAll('.cred-badge.has-tooltip').forEach(badge => {
    badge.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const isOpen = badge.classList.contains('tip-open');
      document.querySelectorAll('.cred-badge.has-tooltip').forEach(b => b.classList.remove('tip-open'));
      if (!isOpen) badge.classList.add('tip-open');
    }, { passive: false });
    // Close tooltip when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!badge.contains(e.target)) badge.classList.remove('tip-open');
    });
  });

})();
