/* ============================================================
   CONTACT DEVELOPMENTS — MAIN JAVASCRIPT
   Production Ready | Ultra-luxury interactions
   ============================================================ */
'use strict';

/* ── Custom Cursor ── */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const label = document.querySelector('.cursor-label');
let mx = -100, my = -100, rx = -100, ry = -100;
let rafCursor;

function moveCursor(e) {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  if (!rafCursor) rafCursor = requestAnimationFrame(animRing);
}

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left  = rx + 'px';
  ring.style.top   = ry + 'px';
  label.style.left = (rx + 28) + 'px';
  label.style.top  = (ry - 28) + 'px';
  rafCursor = requestAnimationFrame(animRing);
}

document.addEventListener('mousemove', moveCursor);

document.querySelectorAll('a, button, [data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.classList.add('expanded');
    const lbl = el.dataset.cursorLabel;
    if (lbl) { label.textContent = lbl; label.classList.add('visible'); }
  });
  el.addEventListener('mouseleave', () => {
    ring.classList.remove('expanded');
    label.classList.remove('visible');
  });
});

/* ── Navigation ── */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const menuOverlay = document.querySelector('.menu-overlay');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = menuOverlay.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
});

menuOverlay.addEventListener('click', e => {
  if (e.target === menuOverlay) closeMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

function closeMenu() {
  menuOverlay.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.classList.remove('menu-open');
}

menuOverlay.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Menu nav hover preview */
const menuPreview = document.querySelector('.menu-overlay__preview');
const menuPLabel  = document.querySelector('.menu-overlay__preview-label h3');
const menuPText   = document.querySelector('.menu-overlay__preview-label p');
const menuPreviews = {
  '#projects': { img: 'assets/images/eval_towers.jpg', label: 'Featured Project', text: 'Eval Towers — New Capital' },
  '#catalog':  { img: 'assets/images/pullman_towers.jpg', label: 'Flagship', text: 'Pullman Towers — Bin Zayed Axis' },
  '#story':    { img: 'assets/images/storytelling_legacy.jpg', label: 'Our Story', text: '20 Years of Excellence' },
  '#about':    { img: 'assets/images/storytelling_capital.jpg', label: 'Location', text: 'New Administrative Capital' },
  '#contact':  { img: 'assets/images/storytelling_accor.jpg', label: 'Get in Touch', text: 'Start Your Journey' },
};
menuOverlay.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  const p = menuPreviews[href];
  if (!p) return;
  link.addEventListener('mouseenter', () => {
    menuPreview.style.backgroundImage = `url('${p.img}')`;
    if (menuPLabel) menuPLabel.textContent = p.label;
    if (menuPText) menuPText.textContent = p.text;
  });
});

/* ── Hero Entry Animation ── */
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero__bg');
if (hero) {
  requestAnimationFrame(() => {
    hero.classList.add('visible');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
  });
}

/* ── Intersection Observer: reveal + stats ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .stats-bar__item').forEach(el => io.observe(el));

/* ── Interactive Catalog ── */
const catalogItems = document.querySelectorAll('.catalog__item');
const catalogPanels = document.querySelectorAll('.catalog__detail-panel');
const catalogBgImgs = document.querySelectorAll('.catalog__bg-img');

function activateCatalogItem(idx) {
  catalogItems.forEach((item, i) => {
    item.classList.toggle('active', i === idx);
  });
  catalogPanels.forEach((panel, i) => {
    panel.classList.toggle('active', i === idx);
  });
  catalogBgImgs.forEach((bg, i) => {
    bg.classList.toggle('active', i === idx);
  });
}

catalogItems.forEach((item, idx) => {
  item.querySelector('.catalog__item-btn').addEventListener('click', () => {
    activateCatalogItem(idx);
  });
  item.querySelector('.catalog__item-btn').addEventListener('mouseenter', () => {
    activateCatalogItem(idx);
  });
});

if (catalogItems.length) activateCatalogItem(0);

/* ── Interactive Storytelling ── */
const storyTabs = document.querySelectorAll('.story__tab-btn');
const storyPanels = document.querySelectorAll('.story__content-panel');
const storyBgs = document.querySelectorAll('.story__bg-img');
let storyTimer;

function activateStoryTab(idx) {
  storyTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  storyPanels.forEach((p, i) => p.classList.toggle('active', i === idx));
  storyBgs.forEach((b, i) => b.classList.toggle('active', i === idx));
}

storyTabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => {
    clearInterval(storyTimer);
    activateStoryTab(idx);
    startStoryTimer(idx);
  });
});

function startStoryTimer(startIdx) {
  let current = startIdx;
  storyTimer = setInterval(() => {
    current = (current + 1) % storyTabs.length;
    activateStoryTab(current);
  }, 5000);
}

if (storyTabs.length) {
  activateStoryTab(0);
  startStoryTimer(0);
}

/* ── Portfolio Filter ── */
const filterBtns = document.querySelectorAll('.portfolio__filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio__card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ── Inquiry Modal ── */
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalClose = document.querySelector('.modal__close');
const modalProjectTag = document.querySelector('.modal__project-tag');

document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectName = btn.dataset.openModal;
    if (modalProjectTag) modalProjectTag.textContent = projectName;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── Contact Form Submit ── */
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Message Sent';
      btn.style.background = '#2a6b52';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Inquiry';
        btn.style.background = '';
      }, 3000);
    }, 1200);
  });
}

/* ── Modal Form Submit ── */
const modalForm = document.querySelector('#modalForm');
if (modalForm) {
  modalForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Request Sent!';
      setTimeout(() => { closeModal(); btn.textContent = 'Send Request'; }, 2000);
    }, 1200);
  });
}

/* ── Language Switcher ── */
const langBtn = document.querySelector('.nav__lang');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    langBtn.textContent = langBtn.textContent === 'AR' ? 'EN' : 'AR';
  });
}

/* ── Smooth anchor scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
