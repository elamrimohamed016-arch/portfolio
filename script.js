document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       1. CURSEUR PERSONNALISÉ (CUSTOM CURSOR)
       ====================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorDot?.classList.add('hovered');
            cursorRing?.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot?.classList.remove('hovered');
            cursorRing?.classList.remove('hovered');
        });
    });

    /* ======================================================================
       2. NAVIGATION STICKY & MOBILE MENU
       ====================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const icon = hamburger.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    /* ======================================================================
       3. SÉLECTEUR DE LANGUE (FR / EN)
       ====================================================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = 'fr';

    function setLanguage(lang) {
        currentLang = lang;
        langToggleBtn.textContent = lang === 'fr' ? 'EN' : 'FR';

        document.querySelectorAll('[data-fr]').forEach((el) => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });
    }

    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });

    /* ======================================================================
       4. BASCULE MODE SOMBRE / CLAIR (DARK / LIGHT MODE)
       ====================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlRoot = document.documentElement;

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlRoot.setAttribute('data-theme', newTheme);

        const icon = themeToggleBtn.querySelector('i');
        if (newTheme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    });

    /* ======================================================================
       5. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL)
       ====================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ======================================================================
       6. LIGHTBOX MODALE (POUR LE PROJET GLOBAL ET LES CERTIFICATIONS)
       ====================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxSkills = document.getElementById('lightbox-skills');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    function openLightbox(triggerEl) {
        const imgEl = triggerEl.tagName === 'IMG' ? triggerEl : triggerEl.querySelector('img');
        if (!imgEl) return;

        const src = imgEl.getAttribute('src');
        const title = triggerEl.getAttribute('data-title') || imgEl.getAttribute('alt');
        const desc = triggerEl.getAttribute('data-desc') || '';
        const skillsRaw = triggerEl.getAttribute('data-skills') || '';

        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        lightboxSkills.innerHTML = '';
        if (skillsRaw) {
            skillsRaw.split('•').forEach((skill) => {
                const span = document.createElement('span');
                span.textContent = skill.trim();
                lightboxSkills.appendChild(span);
            });
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => openLightbox(trigger));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    /* ======================================================================
       7. VALIDATION DU FORMULAIRE DE CONTACT
       ====================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedback = document.getElementById('form-feedback');

    function setError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (message) {
            input.classList.add('invalid');
            if (errorElement) errorElement.textContent = message;
        } else {
            input.classList.remove('invalid');
            if (errorElement) errorElement.textContent = '';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (nameInput.value.trim().length < 2) {
            setError(nameInput, 'name-error', currentLang === 'fr' ? 'Veuillez entrer votre nom.' : 'Please enter your name.');
            isValid = false;
        } else {
            setError(nameInput, 'name-error', '');
        }

        if (!isValidEmail(emailInput.value.trim())) {
            setError(emailInput, 'email-error', currentLang === 'fr' ? 'Adresse email invalide.' : 'Invalid email address.');
            isValid = false;
        } else {
            setError(emailInput, 'email-error', '');
        }

        if (subjectInput.value.trim().length < 3) {
            setError(subjectInput, 'subject-error', currentLang === 'fr' ? 'Veuillez préciser le sujet.' : 'Please specify a subject.');
            isValid = false;
        } else {
            setError(subjectInput, 'subject-error', '');
        }

        if (messageInput.value.trim().length < 10) {
            setError(messageInput, 'message-error', currentLang === 'fr' ? 'Minimum 10 caractères requis.' : 'Minimum 10 characters required.');
            isValid = false;
        } else {
            setError(messageInput, 'message-error', '');
        }

        if (isValid) {
            feedback.textContent = currentLang === 'fr' 
                ? `Merci ${nameInput.value.trim()}, votre message a bien été envoyé à El Amri Mohamed.`
                : `Thank you ${nameInput.value.trim()}, your message has been sent to El Amri Mohamed.`;
            feedback.className = 'form-feedback success';
            contactForm.reset();

            setTimeout(() => {
                feedback.style.display = 'none';
            }, 6000);
        }
    });
});