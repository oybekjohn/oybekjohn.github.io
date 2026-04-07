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
    //  PHOTO CAROUSEL
    // ============================================
    const carousel = document.getElementById('heroCarousel');
    const carouselDots = document.getElementById('carouselDots');

    if (carousel && carouselDots) {
        const images = carousel.querySelectorAll('.hero__carousel-img');
        const dots = carouselDots.querySelectorAll('.hero__carousel-dot');
        let currentSlide = 0;
        let carouselInterval;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        function nextSlide() {
            showSlide((currentSlide + 1) % images.length);
        }

        function startCarousel() {
            carouselInterval = setInterval(nextSlide, 4000);
        }

        function stopCarousel() {
            clearInterval(carouselInterval);
        }

        // Dot click
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopCarousel();
                showSlide(parseInt(dot.dataset.slide));
                startCarousel();
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);

        startCarousel();
    }

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

    // Resume file map
    const RESUME_MAP = {
        uz: 'assets/file/myCV2025_uz.pdf',
        en: 'assets/file/myCV2025_en.pdf',
        ru: null,  // Not available yet
        ar: null   // Not available yet
    };

    const resumeBtn = document.getElementById('resumeBtn');

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

        // Update placeholders
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const msgInput = document.getElementById('contactMessage');
        if (nameInput && t.contact_name_placeholder) nameInput.placeholder = t.contact_name_placeholder;
        if (emailInput && t.contact_email_placeholder) emailInput.placeholder = t.contact_email_placeholder;
        if (msgInput && t.contact_msg_placeholder) msgInput.placeholder = t.contact_msg_placeholder;

        // Update chatbot input placeholder
        const chatInput = document.getElementById('chatInput');
        if (chatInput && t.chat_input_placeholder) chatInput.placeholder = t.chat_input_placeholder;

        // Set HTML lang and direction
        const htmlEl = document.documentElement;
        htmlEl.setAttribute('lang', lang);
        htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update active language button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update resume button
        if (resumeBtn) {
            const resumePath = RESUME_MAP[lang];
            if (resumePath) {
                resumeBtn.href = resumePath;
                resumeBtn.classList.remove('hidden');
            } else {
                resumeBtn.classList.add('hidden');
            }
        }

        // Store preference
        localStorage.setItem('cv-lang', lang);

        // Dispatch event for chatbot to reinitialize
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
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

    // On page load: restore saved language or default to 'en'
    const savedLang = localStorage.getItem('cv-lang') || 'en';
    setLanguage(savedLang);
});
