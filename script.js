// ==================== PRELOADER ====================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);
});

// ==================== MOBILE MENU TOGGLE ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==================== NAVBAR SCROLL EFFECT ====================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    }
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== INITIALIZE AOS ====================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100,
    delay: 100
});

// ==================== COUNTER ANIMATION ====================
const counters = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateCounters() {
    if (hasAnimated) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                counters.forEach(counter => {
                    const target = counter.innerText;
                    const isPlus = target.includes('+');
                    const isPercent = target.includes('%');
                    const numericValue = parseInt(target.replace(/\D/g, ''));
                    
                    let current = 0;
                    const increment = numericValue / 50; // 50 frames
                    const duration = 2000; // 2 seconds
                    const frameTime = duration / 50;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < numericValue) {
                            counter.innerText = Math.ceil(current) + (isPlus ? '+' : '') + (isPercent ? '%' : '');
                            setTimeout(updateCounter, frameTime);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, observerOptions);
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

window.addEventListener('scroll', animateCounters);
animateCounters(); // Check on load too

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroShapes = document.querySelectorAll('.shape');
    
    heroShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==================== LAZY LOADING IMAGES ====================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ==================== GALLERY LIGHTBOX ====================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        createLightbox(img.src, title);
    });
});

function createLightbox(imgSrc, title) {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }
    
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imgSrc}" alt="${title}">
            <div class="lightbox-caption">${title}</div>
        </div>
    `;
    
    // Add styles for lightbox
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            animation: zoomIn 0.3s ease;
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 85vh;
            border-radius: 10px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 40px;
            color: white;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .lightbox-close:hover {
            color: #ff6b9d;
        }
        
        .lightbox-caption {
            text-align: center;
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin-top: 20px;
        }
    `;
    
    if (!document.querySelector('style[data-lightbox]')) {
        style.setAttribute('data-lightbox', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escClose);
        }
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = 'visible';
        }, 300);
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    activateNavLink();
});

window.addEventListener('scroll', debouncedScroll);

// ==================== PAGE VISIBILITY ====================
// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('.shape').forEach(shape => {
            shape.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.shape').forEach(shape => {
            shape.style.animationPlayState = 'running';
        });
    }
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c¡Bienvenida! 💅', 'color: #ff6b9d; font-size: 24px; font-weight: bold;');
console.log('%cPaola Ríos Nail Art Studio', 'color: #c239b3; font-size: 16px;');
console.log('%cWhatsApp: +57 313 378 3737', 'color: #25d366; font-size: 14px;');
console.log('%cSitio web profesional y responsivo', 'color: #6c757d; font-size: 12px;');

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Página cargada correctamente');
    console.log('📱 Todos los sistemas funcionando');
});