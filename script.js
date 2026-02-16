/**
 * Go Go Gaia - Custom JavaScript
 * Modern interactive features for the women's health app website
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // INTERSECTION OBSERVER - Scroll Animations
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed (one-time animation)
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with .reveal class (skip hero - it animates via CSS)
    document.querySelectorAll('.reveal:not(.hero-container .reveal)').forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================
    // ANIMATED COUNTERS
    // =========================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // ms
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // =========================================
    // STICKY MOBILE CTA
    // =========================================
    const stickyCta = document.querySelector('.sticky-mobile-cta');
    if (stickyCta) {
        let lastScrollY = 0;
        const heroHeight = document.querySelector('.hero-container')?.offsetHeight || 500;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            // Show after scrolling past hero
            if (scrollY > heroHeight) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
            lastScrollY = scrollY;
        }, { passive: true });
    }

    // =========================================
    // SCROLL-LINKED STORY (How It Works)
    // =========================================
    const scrollStory = document.querySelector('.scroll-story');
    if (scrollStory) {
        const steps = scrollStory.querySelectorAll('.story-step');
        const screens = scrollStory.querySelectorAll('.phone-screen');

        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNum = entry.target.getAttribute('data-step');

                    // Activate the content card
                    steps.forEach(s => s.classList.remove('active'));
                    entry.target.classList.add('active');

                    // Crossfade to the matching phone screenshot
                    screens.forEach(s => {
                        s.classList.remove('active');
                        s.style.position = 'absolute';
                    });
                    const activeScreen = scrollStory.querySelector(
                        `.phone-screen[data-step="${stepNum}"]`
                    );
                    if (activeScreen) {
                        activeScreen.classList.add('active');
                        activeScreen.style.position = 'relative';
                    }
                }
            });
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0.1
        });

        steps.forEach(step => stepObserver.observe(step));
    }

    // =========================================
    // CAROUSEL - Enhanced Functionality
    // =========================================
    const carousel = document.getElementById('screenshotCarousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            ride: 'carousel',
            wrap: true
        });

        carousel.addEventListener('mouseenter', () => bsCarousel.pause());
        carousel.addEventListener('mouseleave', () => bsCarousel.cycle());

        // Touch swipe for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) bsCarousel.next();
            if (touchEndX > touchStartX + 50) bsCarousel.prev();
        }, false);

        // Keyboard navigation when carousel is in viewport
        document.addEventListener('keydown', (e) => {
            if (isElementInViewport(carousel)) {
                if (e.key === 'ArrowLeft') bsCarousel.prev();
                if (e.key === 'ArrowRight') bsCarousel.next();
            }
        });

        // Fix for smoother transitions
        carousel.addEventListener('slide.bs.carousel', function(e) {
            const activeItem = carousel.querySelector('.carousel-item.active');
            const nextItem = e.relatedTarget;
            if (activeItem) activeItem.style.zIndex = '0';
            if (nextItem) nextItem.style.zIndex = '1';
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // =========================================
    // FAQ SHOW MORE / SHOW LESS TOGGLE
    // =========================================
    const moreFaqItems = document.getElementById('moreFaqItems');
    const faqToggleBtn = document.querySelector('.faq-show-more-btn');

    if (moreFaqItems && faqToggleBtn) {
        moreFaqItems.addEventListener('shown.bs.collapse', () => {
            faqToggleBtn.querySelector('.faq-show-more-text').classList.add('d-none');
            faqToggleBtn.querySelector('.faq-show-less-text').classList.remove('d-none');
        });
        moreFaqItems.addEventListener('hidden.bs.collapse', () => {
            faqToggleBtn.querySelector('.faq-show-more-text').classList.remove('d-none');
            faqToggleBtn.querySelector('.faq-show-less-text').classList.add('d-none');
        });
    }

    // =========================================
    // SMOOTH SCROLLING + NAV
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }

                // Activate linked tab if applicable
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    setTimeout(() => {
                        const tabButton = document.getElementById(tabId);
                        if (tabButton) {
                            const tab = new bootstrap.Tab(tabButton);
                            tab.show();
                        }
                    }, 400);
                }
            }
        });
    });

    // Active nav item on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // =========================================
    // AUTO-ROTATING PERSONA TABS
    // =========================================
    const personasTabs = document.querySelectorAll('#personasTabs button[data-bs-toggle="pill"]');
    let currentPersonaIndex = 0;
    let personasAutoRotate = null;
    let userInteracted = false;
    let restartTimeout = null;

    function rotatePersonas() {
        if (personasTabs.length === 0) return;
        currentPersonaIndex = (currentPersonaIndex + 1) % personasTabs.length;
        const nextTab = new bootstrap.Tab(personasTabs[currentPersonaIndex]);
        nextTab.show();
    }

    function startPersonasRotation() {
        stopPersonasRotation();
        if (!userInteracted) {
            personasAutoRotate = setInterval(rotatePersonas, 7000);
        }
    }

    function stopPersonasRotation() {
        if (personasAutoRotate) {
            clearInterval(personasAutoRotate);
            personasAutoRotate = null;
        }
        if (restartTimeout) {
            clearTimeout(restartTimeout);
            restartTimeout = null;
        }
    }

    if (personasTabs.length > 0) {
        startPersonasRotation();
    }

    personasTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            stopPersonasRotation();
            currentPersonaIndex = index;
            userInteracted = true;
            restartTimeout = setTimeout(() => {
                userInteracted = false;
                startPersonasRotation();
            }, 10000);
        });
    });

    const personasSection = document.getElementById('personas');
    if (personasSection) {
        personasSection.addEventListener('mouseenter', () => stopPersonasRotation());
        personasSection.addEventListener('mouseleave', () => {
            if (!userInteracted) startPersonasRotation();
        });
    }
});
