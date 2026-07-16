/* =========================================================
   FI2E — Script partagé (toutes pages)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('loaded'), 300);
  });

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById('site-nav');
  const onScrollNav = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('nav-scrolled', 'bg-white/90', 'dark:bg-navy-900/90', 'backdrop-blur-xl', 'py-3');
    else { nav.classList.remove('nav-scrolled', 'bg-white/90', 'dark:bg-navy-900/90', 'backdrop-blur-xl', 'py-3'); }
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('icon-open');
  const menuIconClose = document.getElementById('icon-close');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden', isHidden);
      menuIconOpen && menuIconOpen.classList.toggle('hidden');
      menuIconClose && menuIconClose.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      menuIconOpen && menuIconOpen.classList.remove('hidden');
      menuIconClose && menuIconClose.classList.add('hidden');
    }));

    document.querySelectorAll('[data-mobile-accordion-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const icon = btn.querySelector('[data-accordion-icon]');
        panel.classList.toggle('hidden');
        icon && icon.classList.toggle('rotate-180');
      });
    });
  }

  /* ---------- Dark mode ---------- */
  const root = document.documentElement;
  const darkToggles = document.querySelectorAll('[data-dark-toggle]');
  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    localStorage.setItem('f2ie-theme', dark ? 'dark' : 'light');
  };
  const savedTheme = localStorage.getItem('f2ie-theme');
  if (savedTheme === 'dark') applyTheme(true);
  darkToggles.forEach(btn => btn.addEventListener('click', () => applyTheme(!root.classList.contains('dark'))));

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBTT = () => {
      backToTop.style.opacity = window.scrollY > 500 ? '1' : '0';
      backToTop.style.transform = window.scrollY > 500 ? 'translateY(0)' : 'translateY(12px)';
      backToTop.style.pointerEvents = window.scrollY > 500 ? 'auto' : 'none';
    };
    toggleBTT();
    window.addEventListener('scroll', toggleBTT, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Custom cursor (desktop) ---------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; });
    const animateRing = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button, .cursor-grow').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.8)');
      el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ---------- Count-up counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('fr-FR')) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString('fr-FR')) + suffix;
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); counterObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- Generic reveal fallback (elements with .reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- GSAP scroll parallax (hero shapes) ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- Portfolio / grid filters ---------- */
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');
  if (filterBtns.length && filterItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter-btn');
        filterItems.forEach(item => {
          const cats = item.getAttribute('data-filter-item');
          const show = filter === 'all' || cats.includes(filter);
          item.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ---------- Swiper sliders ---------- */
  if (window.Swiper) {
    if (document.querySelector('.partners-swiper')) {
      new Swiper('.partners-swiper', {
        slidesPerView: 2,
        spaceBetween: 32,
        loop: true,
        autoplay: { delay: 1800, disableOnInteraction: false },
        speed: 900,
        breakpoints: { 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }
      });
    }
    if (document.querySelector('.testimonial-swiper')) {
      new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        speed: 700,
        pagination: { el: '.testimonial-pagination', clickable: true },
        navigation: { nextEl: '.testimonial-next', prevEl: '.testimonial-prev' }
      });
    }
    if (document.querySelector('.projects-swiper')) {
      new Swiper('.projects-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        speed: 800,
        pagination: { el: '.projects-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2.2 }, 1280: { slidesPerView: 3.2 } }
      });
    }
    if (document.querySelector('.blog-swiper')) {
      new Swiper('.blog-swiper', {
        slidesPerView: 1.05,
        spaceBetween: 24,
        breakpoints: { 768: { slidesPerView: 2.2 }, 1280: { slidesPerView: 3 } },
        navigation: { nextEl: '.blog-next', prevEl: '.blog-prev' }
      });
    }
  }

  /* ---------- Contact form (demo submit) ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successBox = document.getElementById('form-success');
      contactForm.classList.add('hidden');
      successBox && successBox.classList.remove('hidden');
    });
  }

  /* ---------- Newsletter form (demo submit) ---------- */
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) { const original = btn.textContent; btn.textContent = 'Merci ✓'; setTimeout(() => btn.textContent = original, 2500); }
      form.reset();
    });
  });

  /* ---------- File upload label update ---------- */
  const fileInput = document.getElementById('file-upload');
  const fileLabel = document.getElementById('file-upload-label');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      fileLabel.textContent = fileInput.files.length ? `${fileInput.files.length} fichier(s) sélectionné(s)` : 'Glissez vos fichiers ici ou cliquez pour parcourir';
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('[data-faq-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('[data-faq-icon]');
      const isOpen = !panel.classList.contains('hidden');
      document.querySelectorAll('[data-faq-btn] + div').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('[data-faq-icon]').forEach(i => i.classList.remove('rotate-45'));
      if (!isOpen) { panel.classList.remove('hidden'); icon && icon.classList.add('rotate-45'); }
    });
  });

  /* ---------- Active nav link based on current page ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });

  /* ---------- Set current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

});
