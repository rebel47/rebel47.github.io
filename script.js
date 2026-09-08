(() => {
    'use strict';

    function initializePortfolio() {
        const root = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        const themeLabel = themeToggle?.querySelector('[data-theme-label]');
        let theme = root.dataset.theme === 'dark' ? 'dark' : 'light';

        try {
            const savedTheme = window.localStorage.getItem('portfolio-theme');
            if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
        } catch {
            // Theme controls also work when browser storage is unavailable.
        }

        function applyTheme(nextTheme) {
            theme = nextTheme;
            root.dataset.theme = theme;
            themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
            themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
            if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }

        applyTheme(theme);
        themeToggle?.addEventListener('click', () => {
            applyTheme(theme === 'dark' ? 'light' : 'dark');
            try {
                window.localStorage.setItem('portfolio-theme', theme);
            } catch {
                // Keep the selected theme for this visit without persistence.
            }
        });
        if (themeToggle) themeToggle.hidden = false;

        const header = document.querySelector('.site-header');
        const menuToggle = document.getElementById('menu-toggle');
        const navigation = document.getElementById('site-nav');
        const menuLabel = menuToggle?.querySelector('[data-menu-label]');

        if (header && menuToggle && navigation) {
            function setMenuOpen(isOpen, restoreFocus = false) {
                header.classList.toggle('menu-open', isOpen);
                menuToggle.setAttribute('aria-expanded', String(isOpen));
                menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
                if (menuLabel) menuLabel.textContent = isOpen ? 'Close' : 'Menu';
                if (restoreFocus) menuToggle.focus();
            }

            setMenuOpen(false);
            menuToggle.addEventListener('click', () => {
                setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
            });
            navigation.addEventListener('click', (event) => {
                if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false);
            });
            document.addEventListener('click', (event) => {
                if (event.target instanceof Node && !header.contains(event.target)) setMenuOpen(false);
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                    event.preventDefault();
                    setMenuOpen(false, true);
                }
            });

            if (typeof window.matchMedia === 'function') {
                const desktop = window.matchMedia('(min-width: 760px)');
                const closeOnDesktop = (event) => {
                    if (event.matches) setMenuOpen(false);
                };
                if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
                else if (desktop.addListener) desktop.addListener(closeOnDesktop);
            }
            menuToggle.hidden = false;
        }

        const archive = document.getElementById('project-archive');
        const archiveTools = document.getElementById('archive-tools');
        const search = document.getElementById('project-search');
        const count = document.getElementById('project-count');
        const empty = document.getElementById('project-empty');

        if (archive && archiveTools) {
            const filters = Array.from(archiveTools.querySelectorAll('[data-filter]'));
            const projects = Array.from(archive.querySelectorAll('.archive-item')).map((element) => ({
                element,
                category: element.dataset.category,
                text: element.textContent.toLocaleLowerCase(),
            }));
            let activeFilter = 'all';

            function filterProjects() {
                const query = (search?.value || '').trim().toLocaleLowerCase();
                let visibleCount = 0;
                projects.forEach(({ element, category, text }) => {
                    const matches = (activeFilter === 'all' || category === activeFilter) && text.includes(query);
                    element.hidden = !matches;
                    if (matches) visibleCount += 1;
                });
                filters.forEach((button) => {
                    button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
                });
                if (count) count.textContent = `${visibleCount} of ${projects.length} projects`;
                if (empty) empty.hidden = visibleCount !== 0;
            }

            filters.forEach((button) => {
                button.addEventListener('click', () => {
                    activeFilter = button.dataset.filter || 'all';
                    filterProjects();
                });
            });
            search?.addEventListener('input', filterProjects);
            filterProjects();
            archiveTools.hidden = false;
        }

        const copyEmail = document.getElementById('copy-email');
        const copyStatus = document.getElementById('copy-status');

        if (copyEmail && copyStatus && copyEmail.dataset.email) {
            const email = copyEmail.dataset.email;

            function showEmailForCopying() {
                const prefix = 'Select and copy: ';
                copyStatus.hidden = false;
                copyStatus.textContent = prefix + email;
                const selection = window.getSelection();
                if (selection && copyStatus.firstChild) {
                    const range = document.createRange();
                    range.setStart(copyStatus.firstChild, prefix.length);
                    range.setEnd(copyStatus.firstChild, prefix.length + email.length);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            copyEmail.addEventListener('click', async () => {
                if (!window.isSecureContext || !navigator.clipboard?.writeText) {
                    showEmailForCopying();
                    return;
                }
                try {
                    await navigator.clipboard.writeText(email);
                    copyStatus.hidden = false;
                    copyStatus.textContent = 'Email address copied.';
                } catch {
                    showEmailForCopying();
                }
            });
            copyEmail.hidden = false;
        }

        document.querySelectorAll('[data-year]').forEach((element) => {
            element.textContent = String(new Date().getFullYear());
        });

        if ('IntersectionObserver' in window) {
            const links = Array.from(document.querySelectorAll('.nav-link'));
            const sectionIds = ['projects', 'about', 'experience', 'contact'];
            const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
            const visibleSections = new Map();
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.target);
                    else visibleSections.delete(entry.target.id);
                });
                const current = Array.from(visibleSections.values()).sort((first, second) => {
                    return Math.abs(first.getBoundingClientRect().top) - Math.abs(second.getBoundingClientRect().top);
                })[0];
                links.forEach((link) => {
                    if (current && link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
            sections.forEach((section) => observer.observe(section));
        }
        root.classList.add('js');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
    } else {
        initializePortfolio();
    }
})();
