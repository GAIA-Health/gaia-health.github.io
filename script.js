/**
 * Go Go Gaia - Custom JavaScript
 * Modern interactive features for the women's health app website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dynamic word typing animation in the hero section
    const words = ['health', 'cycle', 'mood', 'sleep', 'fitness', 'nutrition', 'body'];
    const dynamicWord = document.getElementById('dynamicWord');
    let currentIndex = 0;
    let isDeleting = false;
    let text = '';
    let typingSpeed = 150; // Speed of typing in milliseconds
    let deletingSpeed = 75; // Speed of deleting in milliseconds
    let pauseBeforeDelete = 1500; // Pause before starting to delete
    let pauseBeforeType = 500; // Pause before typing the next word
    
    function typeEffect() {
        const currentWord = words[currentIndex];
        
        // If deleting, remove a character, otherwise add a character
        if (isDeleting) {
            text = currentWord.substring(0, text.length - 1);
        } else {
            text = currentWord.substring(0, text.length + 1);
        }
        
        // Update the text content
        dynamicWord.textContent = text;
        
        // Set typing speed
        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;
        
        // If word is complete
        if (!isDeleting && text === currentWord) {
            // Pause before deleting
            typeSpeed = pauseBeforeDelete;
            isDeleting = true;
        } else if (isDeleting && text === '') {
            // Move to next word when deleted
            isDeleting = false;
            currentIndex = (currentIndex + 1) % words.length;
            // Pause before typing next word
            typeSpeed = pauseBeforeType;
        }
        
        // Continue the animation
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start the typing animation
    typeEffect();

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
}); 