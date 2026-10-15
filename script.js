/**
 * Mohammad Ayaz Alam - Portfolio JavaScript
 * Modern, accessible, vanilla JavaScript progressive enhancements
 */

(() => {
  'use strict';

  function init() {
    const root = document.documentElement;

    /* ------------------------------------------------------------------------
       1. THEME TOGGLING (Dark / Light with system preference fallback)
       ------------------------------------------------------------------------ */
    const themeToggle = document.getElementById('theme-toggle');

    function getPreferredTheme() {
      try {
        const stored = localStorage.getItem('portfolio-theme');
        if (stored === 'light' || stored === 'dark') return stored;
      } catch (_) {}
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
      root.dataset.theme = theme;
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch (_) {}
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }
    }

    // Set initial
    setTheme(root.dataset.theme || getPreferredTheme());

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = root.dataset.theme === 'dark' ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* ------------------------------------------------------------------------
       2. MOBILE MENU
       ------------------------------------------------------------------------ */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
      function toggleMenu(isOpen) {
        navMenu.classList.toggle('open', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
      }

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('open');
        toggleMenu(!isOpen);
      });

      // Close when clicking nav items
      navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          toggleMenu(false);
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          toggleMenu(false);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          toggleMenu(false);
          mobileToggle.focus();
        }
      });
    }

    /* ------------------------------------------------------------------------
       3. COPY EMAIL TO CLIPBOARD
       ------------------------------------------------------------------------ */
    function setupCopyEmail(btnId, statusId) {
      const btn = document.getElementById(btnId);
      const status = statusId ? document.getElementById(statusId) : null;
      if (!btn) return;

      const email = btn.dataset.email || 'alam.ayaz47@gmail.com';
      const originalText = btn.querySelector('.copy-text')?.textContent || btn.textContent.trim();

      btn.addEventListener('click', async () => {
        let copied = false;
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(email);
            copied = true;
          } catch (_) {}
        }

        if (!copied) {
          // Fallback textarea
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          try {
            copied = document.execCommand('copy');
          } catch (_) {}
          document.body.removeChild(ta);
        }

        const copyTextEl = btn.querySelector('.copy-text');
        if (copyTextEl) {
          copyTextEl.textContent = '✓ Copied!';
          setTimeout(() => { copyTextEl.textContent = originalText; }, 2200);
        } else if (btn.tagName === 'BUTTON') {
          const prevHtml = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied!</span>';
          setTimeout(() => { btn.innerHTML = prevHtml; }, 2200);
        }

        if (status) {
          status.textContent = '✓ Copied to clipboard: ' + email;
          setTimeout(() => { status.textContent = ''; }, 3500);
        }
      });
    }

    setupCopyEmail('hero-copy-email');
    setupCopyEmail('contact-copy-email', 'contact-copy-status');

    /* ------------------------------------------------------------------------
       4. ARCHIVE TOGGLE & INSTANT FILTERING (25 Projects)
       ------------------------------------------------------------------------ */
    const archiveToggleBtn = document.getElementById('archive-toggle-btn');
    const archiveContent = document.getElementById('archive-content');
    const archiveSearch = document.getElementById('archive-search');
    const archiveTable = document.getElementById('archive-table');
    const countLabel = document.getElementById('archive-count-label');
    const emptyLabel = document.getElementById('archive-empty-label');

    if (archiveToggleBtn && archiveContent) {
      archiveToggleBtn.addEventListener('click', () => {
        const isExpanded = archiveToggleBtn.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        archiveToggleBtn.setAttribute('aria-expanded', String(nextState));
        archiveContent.hidden = !nextState;
        const textSpan = archiveToggleBtn.querySelector('span');
        if (textSpan) {
          textSpan.textContent = nextState ? 'Hide Archive' : 'View All 25 Projects';
        }
      });
    }

    if (archiveTable) {
      const rows = Array.from(archiveTable.querySelectorAll('.archive-row'));
      const filterPills = Array.from(document.querySelectorAll('.filter-pill'));
      let activeCategory = 'all';

      function applyFilters() {
        const query = (archiveSearch?.value || '').trim().toLowerCase();
        let visibleCount = 0;

        rows.forEach(row => {
          const category = row.dataset.category || '';
          const text = row.textContent.toLowerCase();
          const matchesCategory = activeCategory === 'all' || category === activeCategory;
          const matchesSearch = !query || text.includes(query);

          const isVisible = matchesCategory && matchesSearch;
          row.hidden = !isVisible;
          if (isVisible) visibleCount++;
        });

        if (countLabel) {
          countLabel.textContent = `Showing ${visibleCount} of ${rows.length} projects`;
        }
        if (emptyLabel) {
          emptyLabel.hidden = visibleCount > 0;
        }
      }

      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.dataset.filter || 'all';
          applyFilters();
        });
      });

      archiveSearch?.addEventListener('input', applyFilters);
    }

    /* ------------------------------------------------------------------------
       5. ACTIVE NAV HIGHLIGHT (IntersectionObserver)
       ------------------------------------------------------------------------ */
    if ('IntersectionObserver' in window) {
      const sections = ['about', 'projects', 'experience', 'skills', 'education', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);

      const navLinks = Array.from(document.querySelectorAll('.nav-item'));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.setAttribute('aria-current', 'location');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      });

      sections.forEach(section => observer.observe(section));
    }

    /* ------------------------------------------------------------------------
       6. DYNAMIC COPYRIGHT YEAR
       ------------------------------------------------------------------------ */
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
