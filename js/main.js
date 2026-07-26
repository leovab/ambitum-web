/**
 * Ambitum Geología y Ambiente - Main JavaScript
 * Enhanced with premium micro-interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header with enhanced transitions ---
    const header = document.getElementById('header');
    let lastScrollY = 0;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    };
    
    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 2. Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Change icon
        const icon = mobileToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // --- 3. Scroll Reveal Animations (enhanced with stagger) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Animated Counters (enhanced with easing) ---
    const counterElements = document.querySelectorAll('.stat-num');
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000; // 2s for smoother feel
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.round(easedProgress * target);
            
            if (target === 10) {
                el.textContent = `+${current}`;
            } else if (target === 100) {
                el.textContent = `${current}%`;
            } else if (target >= 1000) {
                el.textContent = `+${current.toLocaleString('es-CR')}`;
            } else {
                el.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));

    // --- 6. Form Submission (Demo only) ---
    const contactForm = document.getElementById('contactForm');
    const heroContactForm = document.getElementById('heroContactForm');

    const setupFormSubmission = (form) => {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            
            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = '¡Mensaje Enviado! <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = '#15803d'; // Green
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    };

    setupFormSubmission(contactForm);
    setupFormSubmission(heroContactForm);

    // --- 7. Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- 8. Magnetic hover effect on service cards ---
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 9. Parallax effect for hero text ---
    const heroTextWrapper = document.querySelector('.hero-text-wrapper');
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            const parallaxAmount = scrollY * 0.15;
            if (heroTextWrapper) {
                heroTextWrapper.style.transform = `translateY(${parallaxAmount}px)`;
                heroTextWrapper.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            }
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${parallaxAmount * 0.5}px)`;
                heroVisual.style.opacity = 1 - (scrollY / (window.innerHeight * 0.9));
            }
        }
    }, { passive: true });

    // --- 9. FAQ Accordion ---
    const faqCategories = document.querySelectorAll('.faq-category-toggle');
    faqCategories.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const category = toggle.parentElement;
            const isActive = category.classList.contains('active');
            
            // Close all categories
            document.querySelectorAll('.faq-category.active').forEach(c => {
                c.classList.remove('active');
                c.querySelector('.faq-category-toggle').setAttribute('aria-expanded', 'false');
            });
            
            // Open clicked if it was closed
            if (!isActive) {
                category.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close siblings in same category
            const category = item.closest('.faq-category-content');
            category.querySelectorAll('.faq-item.active').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Open clicked if it was closed
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
