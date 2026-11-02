'use strict';
(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const menu = $('.menu-toggle');
  const links = $('#nav-links');
  const sections = $$('main section[id]');

  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progress) progress.style.width = `${amount}%`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 26);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const closeMenu = () => {
    if (!menu || !links) return;
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation menu');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    links?.classList.toggle('open', open);
  });
  $$('#nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (links?.classList.contains('open') && !e.target.closest('.site-header')) closeMenu();
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    $$('.reveal').forEach(el => reveal.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('#nav-links a').forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -64% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  // Type the actual name character by character — first TALHA, then ASHFAQ.
  // The complete name is kept as the heading's aria-label for screen readers.
  const firstName = $('#hero-first-name');
  const lastName = $('#hero-last-name');
  const firstLine = $('#first-name-line');
  const lastLine = $('#last-name-line');
  if (firstName && lastName && firstLine && lastLine) {
    if (reducedMotion) {
      firstName.textContent = 'TALHA';
      lastName.textContent = 'ASHFAQ';
      firstLine.classList.remove('is-typing');
    } else {
      firstName.textContent = '';
      lastName.textContent = '';
      const typeWord = (element, word, delay, onDone) => {
        let letterIndex = 0;
        const typeLetter = () => {
          element.textContent = word.slice(0, ++letterIndex);
          if (letterIndex < word.length) {
            window.setTimeout(typeLetter, 100 + (letterIndex % 3) * 24);
          } else {
            window.setTimeout(onDone, 290);
          }
        };
        window.setTimeout(typeLetter, delay);
      };
      typeWord(firstName, 'TALHA', 400, () => {
        firstLine.classList.remove('is-typing');
        lastLine.classList.add('is-typing');
        typeWord(lastName, 'ASHFAQ', 120, () => {
          lastLine.classList.remove('is-typing');
          lastLine.classList.add('is-finished');
        });
      });
    }
  }

  const roles = ['Computer Science Student', 'Python Learner & Builder', 'AI Enthusiast', 'Aspiring Software Developer'];
  const target = $('#type-target');
  if (target) {
    if (reducedMotion) { target.textContent = roles[0]; }
    else {
      let role = 0, pos = roles[0].length, erase = true;
      target.textContent = roles[0];
      const typeNext = () => {
        const word = roles[role];
        target.textContent = word.substring(0, pos);
        if (!erase && pos < word.length) { pos += 1; setTimeout(typeNext, 68); }
        else if (!erase) { erase = true; setTimeout(typeNext, 1900); }
        else if (pos > 0) { pos -= 1; setTimeout(typeNext, 31); }
        else { erase = false; role = (role + 1) % roles.length; setTimeout(typeNext, 240); }
      };
      setTimeout(typeNext, 1700);
    }
  }

  if (!reducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.surface[data-spotlight]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - box.left}px`);
        card.style.setProperty('--my', `${e.clientY - box.top}px`);
      }, { passive: true });
    });
    const terminal = $('[data-tilt]');
    terminal?.addEventListener('pointermove', e => {
      const box = terminal.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - .5;
      const y = (e.clientY - box.top) / box.height - .5;
      terminal.style.transform = `rotateY(${x * 9 - 4}deg) rotateX(${-y * 7 + 2}deg) translateY(-4px)`;
    }, { passive: true });
    terminal?.addEventListener('pointerleave', () => { terminal.style.transform = ''; });
  }

  const yearEl = $('#current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const email = 'talha.ashfaq.2007@gmail.com';
  const copyButton = $('#copy-email');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      const previous = copyButton.innerHTML;
      copyButton.textContent = 'Copied ✓';
      window.setTimeout(() => { copyButton.innerHTML = previous; }, 1900);
    } catch {
      // Clipboard may not be available from file:// or insecure contexts.
      window.location.href = `mailto:${email}`;
    }
  });

  const contactForm = $('#contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = String(data.get('subject') || '').trim();
    const name = String(data.get('name') || '').trim();
    const sender = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const body = `Hi Talha,\n\n${message}\n\nFrom: ${name}\nEmail: ${sender}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
