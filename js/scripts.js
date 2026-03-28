/* ============================================
   Oybek Xushvaqtov — Modern CV
   Vanilla JavaScript — Language Engine + UI
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerBtn');
    const navPanel = document.getElementById('navPanel');
    const navLinks = document.querySelectorAll('.nav-links__item');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const sections = document.querySelectorAll('section[id]');
    const langButtons = document.querySelectorAll('.lang-switch__btn');

    // ---- Mobile Menu Toggle ----
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navPanel.classList.toggle('open');
        document.body.style.overflow = navPanel.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navPanel.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerOffset = window.innerWidth >= 1024 ? 32 : 72;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ---- Active Nav Link on Scroll ----
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));

    // ---- Fade-In on Scroll ----
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ---- Scroll to Top ----
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    //  LANGUAGE ENGINE
    // ============================================

    const LINK_MAP = {
        hero_bio2: {
            url: 'https://renessans.gitbook.io/',
            linkKey: 'hero_bio2_link'
        },
        hero_bio3: {
            url: 'https://t.me/data_analitiks',
            linkKey: 'hero_bio3_link'
        }
    };

    function setLanguage(lang) {
        if (!translations[lang]) return;
        const t = translations[lang];

        // Update all [data-i18n] elements (textContent)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });

        // Update [data-i18n-html] elements (contains links)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const linkInfo = LINK_MAP[key];
            if (t[key] !== undefined && linkInfo) {
                const linkText = t[linkInfo.linkKey] || linkInfo.url;
                el.innerHTML = `<a href="${linkInfo.url}" target="_blank">${linkText}</a>${t[key]}`;
            }
        });

        // Set HTML lang and direction
        const htmlEl = document.documentElement;
        htmlEl.setAttribute('lang', lang);
        htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update active language button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Store preference
        localStorage.setItem('cv-lang', lang);
    }

    // Language button click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);

            // Close mobile menu if open
            hamburger.classList.remove('active');
            navPanel.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // On page load: restore saved language or default to 'uz'
    const savedLang = localStorage.getItem('cv-lang') || 'uz';
    setLanguage(savedLang);
});
