(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeButton) {
      themeButton.textContent = next === 'dark' ? '☼' : '☾';
      themeButton.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeButton.setAttribute('aria-pressed', String(next === 'light'));
    }
    try { localStorage.setItem('talha-theme', next); } catch (_) { /* storage may be disabled */ }
  }

  let storedTheme = 'dark';
  try { storedTheme = localStorage.getItem('talha-theme') || 'dark'; } catch (_) {}
  setTheme(storedTheme);
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const target = new URL(link.href, location.href).pathname.split('/').pop().toLowerCase();
    const active = target === currentFile;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });

  function closeMenu() {
    navLinks?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = '☰';
  }
  menuButton?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open') || false;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (innerWidth > 820) closeMenu(); });

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const data = window.PORTFOLIO_DATA || {};
  document.querySelectorAll('[data-cgpa]').forEach(el => el.textContent = data.cgpa || 'Add your CGPA');
  document.querySelectorAll('[data-cgpa-note]').forEach(el => el.textContent = data.cgpaNote || 'Overall CGPA');

  // Full-name typewriter: keep the complete name visible to assistive technology and type it on first load.
  const nameTarget = document.querySelector('[data-name-typewriter]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (nameTarget) {
    const fullName = data.name || 'Talha Ashfaq';
    const [firstName, ...remainingName] = fullName.split(' ');
    const firstPart = nameTarget.querySelector('.name-first');
    const lastPart = nameTarget.querySelector('.name-last');
    const lastName = `${remainingName.join(' ') || 'Ashfaq'}.`;
    if (prefersReducedMotion) {
      if (firstPart) firstPart.textContent = firstName || 'Talha';
      if (lastPart) lastPart.textContent = lastName;
    } else {
      const letters = [
        ...Array.from(firstName || 'Talha').map(char => ({ target: firstPart, char })),
        { target: null, char: ' ' },
        ...Array.from(lastName).map(char => ({ target: lastPart, char }))
      ];
      let nameIndex = 0;
      const typeName = () => {
        if (nameIndex >= letters.length) return;
        const item = letters[nameIndex++];
        if (item.target) item.target.textContent += item.char;
        window.setTimeout(typeName, item.char === ' ' ? 170 : 105);
      };
      window.setTimeout(typeName, 420);
    }
  }

  // Character-by-character reveal for headings and key section introductions as they enter view.
  const typeOnScrollTargets = document.querySelectorAll(
    '.section-heading h2, .page-hero h1, .project-info h2, .experience-head h3, .contact-copy h2, .form-heading h2, .page-lead, .section-subtitle, .hero-description'
  );
  const wrapTextCharacters = (element) => {
    if (element.dataset.charsWrapped) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const value = node.nodeValue;
      if (!value || !value.trim()) return;
      const fragment = document.createDocumentFragment();
      Array.from(value).forEach(char => {
        const span = document.createElement('span');
        span.className = 'scroll-type-char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--char-delay', `${Math.min(index * 17, 1050)}ms`);
        span.textContent = char;
        span.style.whiteSpace = 'pre';
        fragment.appendChild(span);
        index += 1;
      });
      node.parentNode.replaceChild(fragment, node);
    });
    element.dataset.charsWrapped = 'true';
    element.setAttribute('aria-label', element.textContent);
  };
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const typeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wrapTextCharacters(entry.target);
          entry.target.classList.add('is-typing');
          typeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -35px 0px' });
    typeOnScrollTargets.forEach(el => typeObserver.observe(el));
  }

  // Typewriter role animation (respects reduced-motion preferences).
  document.querySelectorAll('[data-rotating-role]').forEach(el => {
    const roles = ['Aspiring Software Developer', 'Computer Science Student', 'AI Enthusiast'];
    if (prefersReducedMotion) return;
    let roleIndex = 0;
    let charIndex = el.textContent.length;
    let deleting = true;
    el.textContent = roles[0];
    const type = () => {
      const current = roles[roleIndex];
      if (deleting) {
        charIndex = Math.max(0, charIndex - 1);
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(type, 240);
          return;
        }
      } else {
        charIndex = Math.min(roles[roleIndex].length, charIndex + 1);
        el.textContent = roles[roleIndex].slice(0, charIndex);
        if (charIndex === roles[roleIndex].length) {
          deleting = true;
          window.setTimeout(type, 1450);
          return;
        }
      }
      window.setTimeout(type, deleting ? 34 : 62);
    };
    window.setTimeout(type, 1500);
  });

  // Duplicate the ticker content for a seamless, continuously moving strip.
  document.querySelectorAll('.ticker-track').forEach(track => {
    if (!track.dataset.looped) {
      const original = track.innerHTML;
      track.insertAdjacentHTML('beforeend', original);
      Array.from(track.children).slice(track.children.length / 2).forEach(item => {
        item.setAttribute('aria-hidden', 'true');
      });
      track.dataset.looped = 'true';
    }
  });

  // Add subtle staggered scroll reveals to key cards and progress units.
  const staggerGroups = [
    '.project-grid', '.project-list', '.strength-grid', '.skill-groups',
    '.semester-strip', '.education-list', '.experience-list', '.quick-facts',
    '.academic-grid', '.contact-grid'
  ];
  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach(group => {
      Array.from(group.children).forEach((child, index) => {
        if (!child.classList.contains('reveal')) child.classList.add('reveal-card');
        child.style.setProperty('--reveal-delay', `${Math.min(index * 90, 450)}ms`);
      });
    });
  });
  document.querySelectorAll('.project-card,.project-detail-card,.experience-card,.strength-card,.skill-group,.academic-card,.fact-card,.contact-link-card,.education-item').forEach((card, index) => {
    if (!card.classList.contains('reveal') && !card.classList.contains('reveal-card')) card.classList.add('reveal-card');
    if (!card.style.getPropertyValue('--reveal-delay')) card.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
  });

  const revealItems = document.querySelectorAll('.reveal, .reveal-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  // Scroll progress indicator.
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  scrollProgress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrollProgress);
  let scrollQueued = false;
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollQueued = true;
    }
  }, { passive: true });
  updateScrollProgress();

  // Cursor-following spotlight on fine-pointer devices only.
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let pointerQueued = false;
    let pointerX = 0;
    let pointerY = 0;
    document.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerQueued) return;
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
        pointerQueued = false;
      });
      pointerQueued = true;
      const card = event.target.closest('.project-card,.academic-card,.experience-body,.strength-card,.skill-group');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
      }
    }, { passive: true });
  }

  // Animate simple numeric highlights when they enter the viewport.
  const animateNumber = (element) => {
    if (element.dataset.counted) return;
    const raw = element.textContent.trim();
    if (!/^\d+$/.test(raw)) return;
    const target = Number(raw);
    element.dataset.counted = 'true';
    const duration = 850;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      element.textContent = String(Math.round(target * eased)).padStart(raw.length, '0');
      if (p < 1) window.requestAnimationFrame(tick);
      else element.textContent = raw;
    };
    window.requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const numberObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          numberObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.65 });
    document.querySelectorAll('.fact-card strong,.academic-meta strong,.semester b').forEach(el => numberObserver.observe(el));
  }

  // Smooth fade between local portfolio pages (do not interfere with new tabs/downloads).
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download')) return;
    let targetUrl;
    try { targetUrl = new URL(href, window.location.href); } catch (_) { return; }
    if (targetUrl.origin !== window.location.origin || !/\.html?$/i.test(targetUrl.pathname)) return;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = targetUrl.href; }, 190);
    });
  });

  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !email || !subject || !message) return;
    const bodyText = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${data.email || 'talha.ashfaq.2007@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    const note = document.getElementById('form-note');
    if (note) note.textContent = 'Opening your email application. Review the draft and press Send there.';
    location.href = mailto;
  });
})();
