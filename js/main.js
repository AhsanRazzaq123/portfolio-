// Main JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
    initTypingEffect();
    initPortfolioFilter();
    initSmoothScrolling();
    
    console.log('Website loaded successfully!');
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .about-image, .portfolio-item, .contact-item, .skill-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validate form
            if (!validateContactForm(name, email, subject, message)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 2000);
        });
    }
}

// Form validation
function validateContactForm(name, email, subject, message) {
    let isValid = true;
    
    // Name validation
    if (!name || name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    } else {
        clearFieldError('name');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    // Subject validation
    if (!subject || subject.trim().length < 5) {
        showFieldError('subject', 'Subject must be at least 5 characters long');
        isValid = false;
    } else {
        clearFieldError('subject');
    }
    
    // Message validation
    if (!message || message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        clearFieldError('message');
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.parentElement;
    
    // Remove existing error
    clearFieldError(fieldName);
    
    // Add error class
    formGroup.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.parentElement;
    const existingError = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    if (existingError) {
        existingError.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'notificationStyles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6c5ce7, #a29bfe);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    const words = originalText.split(' ');
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    heroTitle.textContent = '';
    
    function type() {
        const currentWord = words[currentWordIndex];
        
        if (isDeleting) {
            heroTitle.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            heroTitle.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && currentCharIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentWordIndex++;
            typeSpeed = 500;
            
            if (currentWordIndex === words.length) {
                currentWordIndex = 0;
                heroTitle.textContent = originalText; // Show full text
                return; // Stop the effect
            }
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect after a delay
    setTimeout(type, 1000);
}

// Portfolio filter functionality
function initPortfolioFilter() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add click handlers to portfolio items
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            showPortfolioModal(title, description);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Show portfolio modal
function showPortfolioModal(title, description) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        ">
            <button class="modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            <h3 style="margin-bottom: 1rem; color: #333;">${title}</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">${description}</p>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary">View Project</button>
                <button class="btn btn-secondary">View Code</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.querySelector('#modalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'modalStyles';
        styles.textContent = `
            @keyframes modalSlideIn {
                from { transform: scale(0.7); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', function() {
    // Remove any loading screens
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // Animate elements on page load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other files
window.PortfolioApp = {
    showNotification,
    showPortfolioModal,
    validateContactForm,
    debounce,
    throttle
};