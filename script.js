// ==================== DOM Ready ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeTabs();
    initializeScrollToTop();
    initializeFormHandling();
    initializeBeforeAfterSliders();
    initializeScrollReveal();
    initializeActiveNavLinks();
});

// ==================== Navigation ====================
function initializeNavigation() {
    const navbarToggle = document.getElementById('navbarToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            navbarToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbarToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (mobileMenu && !event.target.closest('.navbar') && !event.target.closest('.mobile-menu') && mobileMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== Tabs Functionality ====================
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const target = document.getElementById(targetTab);
            if (target) {
                target.classList.add('active');

                // Force all .reveal elements inside this tab to become visible
                // (they may have been invisible when IntersectionObserver fired
                //  because the tab-pane was display:none at that time)
                target.querySelectorAll('.reveal').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    });
}

// ==================== Scroll to Top ====================
function initializeScrollToTop() {
    const scrollToTop = document.getElementById('scrollToTop');
    if (!scrollToTop) return;

    window.addEventListener('scroll', function () {
        scrollToTop.classList.toggle('show', window.pageYOffset > 300);
    }, { passive: true });

    scrollToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== Form Handling ====================
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showNotification('Thank you for your feedback! We will review it shortly.', 'success');
                contactForm.reset();
            } else {
                showNotification('Submission failed. Please try again later.', 'error');
            }
        } catch (err) {
            showNotification('Network error. Please check your connection.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
        }
    });
}

// ==================== Email Validation ====================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==================== Notifications ====================
function showNotification(message, type = 'info') {
    // Remove existing notification if present
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const colors = {
        success: '#16a34a',
        error:   '#dc2626',
        info:    '#2563eb'
    };

    const notification = document.createElement('div');
    notification.className = 'notification';
    Object.assign(notification.style, {
        position:    'fixed',
        top:         '20px',
        right:       '20px',
        padding:     '1rem 1.6rem',
        background:  colors[type] || colors.info,
        color:       'white',
        borderRadius:'10px',
        boxShadow:   '0 6px 20px rgba(0,0,0,0.2)',
        zIndex:      '10000',
        maxWidth:    '380px',
        fontWeight:  '500',
        fontSize:    '0.95rem',
        lineHeight:  '1.5',
        animation:   'slideInRight 0.3s ease',
        cursor:      'pointer'
    });

    notification.textContent = message;
    notification.addEventListener('click', () => notification.remove());
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4500);
}

// Add notification keyframe animations dynamically
(function injectNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(60px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(60px); }
        }
    `;
    document.head.appendChild(style);
})();

// ==================== Smooth Scroll for Anchor Links ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// ==================== Before-After Slider ====================
function initializeBeforeAfterSliders() {
    document.querySelectorAll('.ba-container').forEach(container => {
        const slider   = container.querySelector('.ba-slider');
        const beforeEl = container.querySelector('.ba-before');
        const divider  = container.querySelector('.ba-divider');

        if (!slider || !beforeEl) return;

        function updateSlider(val) {
            const pct = val + '%';
            beforeEl.style.width = pct;
            if (divider) divider.style.left = pct;
        }

        // Set initial position
        updateSlider(slider.value);

        slider.addEventListener('input', function () {
            updateSlider(this.value);
        });

        // Touch support (already handled by range input, but ensure responsiveness)
        slider.addEventListener('touchmove', function (e) {
            e.stopPropagation();
        }, { passive: true });
    });
}

// ==================== Scroll Reveal ====================
function initializeScrollReveal() {
    // Only apply reveal to always-visible elements (NOT inside hidden tabs)
    // Finding-cards are NEVER given the reveal class — they must always be opacity:1
    // so they work correctly on mobile when switching tabs
    const revealTargets = document.querySelectorAll(
        '.content-box, .stat-card, .timeline-item, ' +
        '.methodology-item, .conclusion-box, .recommendation-item, ' +
        '#gallery .gallery-item, .comparison-item'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => observer.observe(el));

    // Guarantee all finding-cards are always fully visible — no animation
    // This prevents opacity:0 getting permanently stuck on mobile
    document.querySelectorAll('.finding-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    });
}

// ==================== Active Nav Link on Scroll ====================
function initializeActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: `-${navHeight + 10}px 0px -55% 0px`,
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

console.log('Mangrove Ecosystem Report — All modules initialized successfully.');