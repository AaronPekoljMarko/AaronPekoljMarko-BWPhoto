// ─── Mobile nav toggle ───────────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const drawer = document.querySelector('.nav-drawer');
if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
    }
  });
}

// ─── Active nav link ─────────────────────────────────────────────────────
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── Lightbox ────────────────────────────────────────────────────────────
let lightboxItems = [];
let lightboxCurrent = 0;

function openLightbox(index) {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lightboxCurrent = index;
  const item = lightboxItems[lightboxCurrent];
  lb.querySelector('img').src = item.src;
  lb.querySelector('.lightbox-caption').textContent = item.caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  openLightbox((lightboxCurrent + dir + lightboxItems.length) % lightboxItems.length);
}

(function () {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-prev').addEventListener('click', () => lightboxNav(-1));
  lb.querySelector('.lightbox-next').addEventListener('click', () => lightboxNav(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
})();

// ─── Load gallery from photos.json ──────────────────────────────────────
const galleryGrid = document.querySelector('.gallery-grid');
const galleryKey  = document.body.dataset.gallery;

if (galleryGrid && galleryKey) {
  fetch('photos.json?v=' + Date.now())
    .then(r => r.json())
    .then(all => {
      const photos = all.filter(p => p.gallery === galleryKey);
      lightboxItems = photos.map(p => ({ src: p.src, caption: p.caption }));

      if (photos.length === 0) {
        galleryGrid.innerHTML = '<p style="padding:2rem;color:#aaa;font-size:11px;letter-spacing:.15em;text-transform:uppercase;">No photos yet in this gallery.</p>';
        return;
      }

      galleryGrid.innerHTML = photos.map((p, i) => `
        <div class="grid-item" data-index="${i}">
          <img src="${p.src}" alt="${p.caption}" loading="lazy" />
          <div class="grid-caption"><span>${p.caption}</span></div>
        </div>
      `).join('');

      galleryGrid.querySelectorAll('.grid-item').forEach(el => {
        el.addEventListener('click', () => openLightbox(+el.dataset.index));
      });
    })
    .catch(() => {
      galleryGrid.innerHTML = '<p style="padding:2rem;color:#aaa;font-size:11px;letter-spacing:.15em;text-transform:uppercase;">Could not load photos.</p>';
    });
}

// ─── Contact form (simulated submit) ────────────────────────────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.form-success').style.display = 'block';
    form.reset();
  });
})();
