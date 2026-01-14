// ==========================================
// NETWORK CANVAS BACKGROUND
// ==========================================
const networkCanvas = document.getElementById('network-canvas');
const ctx = networkCanvas.getContext('2d');

let particles = [];
let animationFrameId;

function initCanvas() {
    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;

    // Create particles
    particles = [];
    const particleCount = Math.floor((networkCanvas.width * networkCanvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * networkCanvas.width,
            y: Math.random() * networkCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
}

function drawNetwork() {
    const theme = document.documentElement.getAttribute('data-theme');
    const isDark = theme === 'dark';

    ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

    // Draw connections
    ctx.strokeStyle = isDark ? 'rgba(0, 255, 65, 0.1)' : 'rgba(10, 14, 39, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.globalAlpha = (150 - distance) / 150 * 0.5;
                ctx.stroke();
            }
        }
    }

    // Draw particles
    ctx.globalAlpha = 1;
    ctx.fillStyle = isDark ? 'rgba(0, 255, 65, 0.3)' : 'rgba(10, 14, 39, 0.2)';

    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > networkCanvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > networkCanvas.height) particle.vy *= -1;
    });

    animationFrameId = requestAnimationFrame(drawNetwork);
}

// Initialize and start animation
initCanvas();
drawNetwork();

// Resize handler
window.addEventListener('resize', () => {
    initCanvas();
});

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==========================================
// ACTIVE NAVIGATION LINK
// ==========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==========================================
// ANIMATED COUNTERS
// ==========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            if (entry.target.hasAttribute('data-target')) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }

            // Animate skill progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    setTimeout(() => {
                        progressBar.style.width = `${progress}%`;
                    }, 200);
                    observer.unobserve(entry.target);
                }
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));

// ==========================================
// SKILLS FILTER
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter skill cards with animation
        skillCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400);
            }
        });
    });
});

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Create mailto link
    const mailtoLink = `mailto:amit.rangari@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoLink;

    // Show success message
    alert('Thank you for your message! Your email client will open to send the message.');

    // Reset form
    contactForm.reset();
});

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#') {
            e.preventDefault();
            return;
        }

        const targetElement = document.querySelector(href);

        if (targetElement) {
            e.preventDefault();

            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// MARQUEE DUPLICATION
// ==========================================
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    const marqueeItems = marqueeContent.innerHTML;
    marqueeContent.innerHTML += marqueeItems;
}

// ==========================================
// PARALLAX EFFECTS ON SCROLL
// ==========================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Parallax effect for hero section
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
            }

            ticking = false;
        });

        ticking = true;
    }
});

// ==========================================
// CURSOR TRAIL EFFECT (SUBTLE)
// ==========================================
const cursorTrail = [];
const maxTrailLength = 3;

document.addEventListener('mousemove', (e) => {
    // Only on larger screens
    if (window.innerWidth < 768) return;

    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
    });

    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
});

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Quick navigation with keyboard
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                e.preventDefault();
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                e.preventDefault();
                document.querySelector('#expertise').scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                e.preventDefault();
                document.querySelector('#journey').scrollIntoView({ behavior: 'smooth' });
                break;
            case '5':
                e.preventDefault();
                document.querySelector('#impact').scrollIntoView({ behavior: 'smooth' });
                break;
            case '6':
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// ==========================================
// PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
// ==========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Cancel network animation
    cancelAnimationFrame(animationFrameId);
    networkCanvas.style.display = 'none';

    // Remove transitions
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
    });
}

// ==========================================
// PAGE LOAD OPTIMIZATION
// ==========================================
window.addEventListener('load', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');

    // Start observing for animations
    highlightNavigation();
});

// ==========================================
// EASTER EGG: KONAMI CODE
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            // Trigger easter egg
            triggerEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerEasterEgg() {
    // Create matrix rain effect
    const originalContent = document.body.innerHTML;

    alert('🎮 Konami Code Activated! Press OK to continue to the Matrix...');

    // You can add more fun effects here
    console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'font-size: 30px; color: #00ff41; font-weight: bold;');
    console.log('%c You found the easter egg! 🥚', 'font-size: 16px; color: #00ff41;');

    // Add temporary visual effect
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }

    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c👋 Welcome!', 'font-size: 20px; font-weight: bold; color: #00ff41; font-family: monospace;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff41;');
console.log('%cInterested in the code?', 'font-size: 14px; color: #6c757d; font-family: monospace;');
console.log('%cCheck out: https://github.com/amitrangari', 'font-size: 14px; color: #0a0e27; font-weight: bold; font-family: monospace;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00ff41;');
console.log('%c💡 Pro tip: Try the Konami Code!', 'font-size: 12px; color: #6c757d; font-style: italic; font-family: monospace;');
console.log('%c⌨️  Use Alt + 1-6 for quick navigation', 'font-size: 12px; color: #6c757d; font-family: monospace;');
