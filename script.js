/**
 * Go Go Gaia - Custom JavaScript
 * Modern interactive features for the women's health app website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Carousel Functionality
    const carousel = document.getElementById('screenshotCarousel');
    if (carousel) {
        // Initialize Bootstrap carousel with longer interval
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000, // Longer interval for better viewing of each slide
            ride: 'carousel',
            wrap: true
        });
        
        // Add hover pause functionality
        carousel.addEventListener('mouseenter', () => {
            bsCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            bsCarousel.cycle();
        });
        
        // Add swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                // Swipe left, go to next slide
                bsCarousel.next();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right, go to previous slide
                bsCarousel.prev();
            }
        };
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (isElementInViewport(carousel)) {
                if (e.key === 'ArrowLeft') {
                    bsCarousel.prev();
                }
                if (e.key === 'ArrowRight') {
                    bsCarousel.next();
                }
            }
        });
        
        // Preload images for smoother transitions
        const preloadImages = () => {
            const slides = carousel.querySelectorAll('.carousel-item img');
            slides.forEach(img => {
                const src = img.getAttribute('src');
                if (src) {
                    const image = new Image();
                    image.src = src;
                }
            });
        };
        
        // Fix for smoother transitions
        carousel.addEventListener('slide.bs.carousel', function (e) {
            // Add a small delay to ensure proper opacity transition
            const activeItem = carousel.querySelector('.carousel-item.active');
            const nextItem = e.relatedTarget;
            
            // Ensure proper z-index stacking
            if (activeItem) activeItem.style.zIndex = '0';
            if (nextItem) nextItem.style.zIndex = '1';
        });
        
        // Run preload
        preloadImages();
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                // If this link has a data-tab attribute, activate that tab
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    const tabButton = document.getElementById(tabId);
                    if (tabButton) {
                        // Small delay to let scroll complete
                        setTimeout(() => {
                            const tab = new bootstrap.Tab(tabButton);
                            tab.show();
                        }, 400);
                    }
                }
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-box, .testimonial-bubble, h2');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                if (!element.classList.contains('animate__animated')) {
                    element.classList.add('animate__animated', 'animate__fadeIn');
                }
            }
        });
    };

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();

    // Add active class to nav items on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Add parallax effect to hero section
    const heroContainer = document.querySelector('.hero-container');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        if (heroContainer) {
            heroContainer.style.backgroundPosition = `50% ${scrollPosition * 0.4}px`;
        }
    });

    // Auto-rotating Personas Tabs
    const personasTabs = document.querySelectorAll('#personasTabs button[data-bs-toggle="pill"]');
    let currentPersonaIndex = 0;
    let personasAutoRotate = null;
    let userInteracted = false;
    let restartTimeout = null;

    function rotatePersonas() {
        if (personasTabs.length === 0) return;

        // Move to next tab
        currentPersonaIndex = (currentPersonaIndex + 1) % personasTabs.length;

        // Trigger the tab
        const nextTab = new bootstrap.Tab(personasTabs[currentPersonaIndex]);
        nextTab.show();
    }

    function startPersonasRotation() {
        // Always stop any existing rotation first to prevent duplicates
        stopPersonasRotation();

        // Only start if user hasn't interacted recently
        if (!userInteracted) {
            personasAutoRotate = setInterval(rotatePersonas, 7000); // Rotate every 7 seconds
        }
    }

    function stopPersonasRotation() {
        // Clear the interval
        if (personasAutoRotate) {
            clearInterval(personasAutoRotate);
            personasAutoRotate = null;
        }

        // Clear any pending restart timeout
        if (restartTimeout) {
            clearTimeout(restartTimeout);
            restartTimeout = null;
        }
    }

    // Start auto-rotation on page load
    if (personasTabs.length > 0) {
        startPersonasRotation();
    }

    // Pause rotation when user clicks a tab
    personasTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            stopPersonasRotation();
            currentPersonaIndex = index;
            userInteracted = true;

            // Resume auto-rotation after 10 seconds of no interaction
            restartTimeout = setTimeout(() => {
                userInteracted = false;
                startPersonasRotation();
            }, 10000);
        });
    });

    // Pause rotation when user hovers over the personas section
    const personasSection = document.getElementById('personas');
    if (personasSection) {
        personasSection.addEventListener('mouseenter', () => {
            stopPersonasRotation();
        });

        personasSection.addEventListener('mouseleave', () => {
            if (!userInteracted) {
                startPersonasRotation();
            }
        });
    }
});