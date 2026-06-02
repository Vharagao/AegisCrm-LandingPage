/* ═══════════════════════════════════════════════════════════
   Aegis CRM — Landing Page / app.js
   Efeitos: Cursor Spotlight · Scroll Reveal · Magnetic Buttons
            Pipeline Animation · FAQ Accordion · Counters · Form
═══════════════════════════════════════════════════════════ */

// ─── 1. CURSOR SPOTLIGHT ─────────────────────────────────────
const spotlight = document.getElementById('spotlight');

document.addEventListener('mousemove', (e) => {
  spotlight.style.setProperty('--mx', e.clientX + 'px');
  spotlight.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });


// ─── 2. SCROLL REVEAL ────────────────────────────────────────
const revealAll = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealAll.forEach(el => observer.observe(el));


// ─── 3. MAGNETIC BUTTONS ─────────────────────────────────────
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r   = btn.getBoundingClientRect();
    const dx  = e.clientX - (r.left + r.width  / 2);
    const dy  = e.clientY - (r.top  + r.height / 2);
    btn.style.transition = 'none';
    btn.style.transform  = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    btn.style.transform  = 'translate(0,0)';
  });
});


// ─── 4. PIPELINE ANIMATION ───────────────────────────────────
const kanban = document.getElementById('kanban');
let pipelineTriggered = false;

const col1 = kanban.querySelector('.kanban-col:nth-child(1)');
const col2 = kanban.querySelector('.kanban-col:nth-child(2)');
const col3 = kanban.querySelector('.kanban-col:nth-child(3)');
const b1   = document.getElementById('badge-new');
const b2   = document.getElementById('badge-qual');
const b3   = document.getElementById('badge-won');

function updateBadges() {
  b1.textContent = col1.querySelectorAll('.lead-card').length;
  b2.textContent = col2.querySelectorAll('.lead-card').length;
  b3.textContent = col3.querySelectorAll('.lead-card').length;
}

function moveCard(cardId, targetCol, delay, addWonClass = false) {
  return new Promise(resolve => {
    setTimeout(() => {
      const card = document.getElementById(cardId);
      if (!card) { resolve(); return; }

      // Fade out
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity    = '0';
      card.style.transform  = 'translateX(20px)';

      setTimeout(() => {
        targetCol.appendChild(card);
        card.style.transform  = 'translateX(-12px)';
        card.style.opacity    = '0';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateX(0)';
            if (addWonClass) card.classList.add('won-glow');
            updateBadges();
            resolve();
          });
        });
      }, 450);
    }, delay);
  });
}

const pipelineObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !pipelineTriggered) {
      pipelineTriggered = true;

      // 1. Reveal cards in col 1 with stagger
      const cards1 = col1.querySelectorAll('.lead-card');
      cards1.forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 200);
      });

      // 2. Move leads to col 2
      setTimeout(() => {
        moveCard('lc-2', col2, 0);
        moveCard('lc-3', col2, 500);
      }, cards1.length * 200 + 1200);

      // 3. Move one lead to col 3 (won)
      setTimeout(() => {
        moveCard('lc-3', col3, 0, true);
      }, cards1.length * 200 + 1200 + 2200);
    }
  });
}, { threshold: 0.3 });

if (kanban) pipelineObs.observe(kanban);


// ─── 5. ANIMATED BARS (Feature 3 Chart) ──────────────────────
const visChartObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.vis-bar').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('visible'), i * 120);
      });
      visChartObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const vis3 = document.getElementById('vis-3');
if (vis3) visChartObs.observe(vis3);


// ─── 6. COUNTER ANIMATION ────────────────────────────────────
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = +el.dataset.target;
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter[data-target]').forEach(animateCounter);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metrics, .vis-chart').forEach(el => counterObs.observe(el));


// ─── 7. FAQ ACCORDION ────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


// ─── 8. FORM HANDLER ─────────────────────────────────────────
const form    = document.getElementById('demo-form');
const success = document.getElementById('form-success');
const nameIn  = document.getElementById('input-name');
const zapIn   = document.getElementById('input-whatsapp');

// WhatsApp mask
zapIn.addEventListener('input', () => {
  let v = zapIn.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0) v = `(${v}`;
  zapIn.value = v;
});

// Live validation feedback
nameIn.addEventListener('blur', () => {
  if (nameIn.value.trim().length > 2) nameIn.classList.add('valid');
  else nameIn.classList.remove('valid');
});

zapIn.addEventListener('blur', () => {
  const digits = zapIn.value.replace(/\D/g, '');
  if (digits.length >= 10) zapIn.classList.add('valid');
  else zapIn.classList.remove('valid');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameIn.value.trim();
  const zap  = zapIn.value.replace(/\D/g, '');

  if (name.length < 2 || zap.length < 10) {
    [nameIn, zapIn].forEach(input => {
      if (!input.classList.contains('valid')) {
        input.style.borderColor = '#EF4444';
        input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow   = '';
        }, 2000);
      }
    });
    return;
  }

  // Simulate submission (replace with real API call if needed)
  const btn = document.getElementById('form-submit');
  btn.textContent = 'Enviando…';
  btn.disabled    = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
  }, 900);
});


// ─── 9. HEADER SCROLL EFFECT ─────────────────────────────────
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 60
    ? 'rgba(8,10,15,0.92)'
    : 'rgba(8,10,15,0.7)';
}, { passive: true });
