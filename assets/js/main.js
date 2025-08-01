/* === ADVANCED HERO SLIDER CLASS === */
class AdvancedHeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.prevArrow = document.querySelector('.slider-arrow.prev');
        this.nextArrow = document.querySelector('.slider-arrow.next');
        this.particlesContainer = document.querySelector('.particles');
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.createParticles();
        this.bindEvents();
        this.startAutoSlide();
        this.preloadSlides();
    }

    /* Create floating particles animation */
    createParticles() {
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
            this.particlesContainer.appendChild(particle);
        }
    }

    /* Bind all event listeners */
    bindEvents() {
        // Navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoSlide();
            });
        });

        // Arrow navigation
        this.prevArrow.addEventListener('click', () => {
            this.previousSlide();
            this.resetAutoSlide();
        });

        this.nextArrow.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
                this.resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoSlide();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });

        // Pause auto-slide on hover
        document.querySelector('.hero-slider').addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        document.querySelector('.hero-slider').addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    /* Handle swipe gestures */
    handleSwipe(startX, startY, endX, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const threshold = 50;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
                this.resetAutoSlide();
            }
        }
    }

    /* Navigate to specific slide */
    goToSlide(index) {
        if (index === this.currentSlide) return;

        // Remove active class from current slide and nav dot
        this.slides[this.currentSlide].classList.remove('active');
        this.navDots[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and nav dot
        this.slides[this.currentSlide].classList.add('active');
        this.navDots[this.currentSlide].classList.add('active');

        // Trigger animations for the new slide
        this.animateSlideContent();
    }

    /* Navigate to next slide */
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    /* Navigate to previous slide */
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    /* Start automatic slide progression */
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 7000); // 7 seconds per slide
    }

    /* Stop automatic slide progression */
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    /* Reset automatic slide timer */
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    /* Animate slide content elements */
    animateSlideContent() {
        const activeSlide = this.slides[this.currentSlide];
        const elements = activeSlide.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-stats, .hero-features, .hero-buttons');

        elements.forEach((element, index) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `fadeInUp 1s ease-out ${index * 0.2}s both`;
        });
    }

    /* Preload slides for better performance */
    preloadSlides() {
        this.slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.visibility = 'hidden';
                setTimeout(() => {
                    slide.style.visibility = 'visible';
                }, 100);
            }
        });
    }
}

/* === HEADER FUNCTIONALITY === */
class HeaderManager {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    /* Bind header event listeners */
    bindEvents() {
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
                this.updateActiveLink(link);
            });
        });

        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    /* Toggle mobile menu */
    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
    }

    /* Close mobile menu */
    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
    }

    /* Update active navigation link */
    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /* Handle scroll effects */
    handleScroll() {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

/* === SCROLL TO TOP FUNCTIONALITY === */
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    /* Bind scroll to top events */
    bindEvents() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Smooth scroll to top when clicked
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    /* Handle scroll visibility */
    handleScroll() {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    /* Smooth scroll to top */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/* === NEWSLETTER FORM HANDLER === */
class NewsletterManager {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.input = document.querySelector('.newsletter-input');
        this.button = document.querySelector('.newsletter-btn');

        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    /* Bind newsletter events */
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    /* Handle newsletter submission */
    handleSubmit() {
        const email = this.input.value.trim();

        if (this.validateEmail(email)) {
            // Simulate successful subscription
            this.showSuccess();
            this.input.value = '';
        } else {
            this.showError('Please enter a valid email address');
        }
    }

    /* Validate email format */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /* Show success message */
    showSuccess() {
        const originalText = this.button.innerHTML;
        this.button.innerHTML = '<i class="fas fa-check"></i>';
        this.button.style.background = 'var(--accent)';

        setTimeout(() => {
            this.button.innerHTML = originalText;
            this.button.style.background = 'var(--gradient-primary)';
        }, 2000);
    }

    /* Show error message */
    showError(message) {
        // Simple error indication
        this.input.style.borderColor = 'var(--danger)';

        setTimeout(() => {
            this.input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }, 3000);
    }
}

/* === SMOOTH SCROLL FOR ANCHOR LINKS === */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === INTERSECTION OBSERVER FOR ANIMATIONS === */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe all visual cards and footer elements
    document.querySelectorAll('.visual-card, .footer-column, .contact-info').forEach(element => {
        observer.observe(element);
    });
}

/* === INITIALIZE ALL COMPONENTS === */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main components
    new AdvancedHeroSlider();
    new HeaderManager();
    new ScrollToTop();
    new NewsletterManager();

    // Initialize utility functions
    initSmoothScroll();
    initIntersectionObserver();

    // Add loading complete class to body
    document.body.classList.add('loaded');
});

/* === PERFORMANCE OPTIMIZATION === */
// Debounce scroll events for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based functionality can be added here
}, 16)); // ~60fps

document.querySelectorAll('.process-card, .testimonial-card, .cost-content, .tasmania-content, .cta-buttons').forEach(element => {
    observer.observe(element);
});