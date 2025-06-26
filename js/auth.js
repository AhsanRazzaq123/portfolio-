// Authentication functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    initPasswordToggle();
    initFormValidation();
    
    console.log('Auth system initialized');
});

// Initialize authentication forms
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate login form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn);
    
    // Simulate login API call
    simulateAuthRequest(() => {
        hideButtonLoading(submitBtn);
        
        // Store user data (in real app, use secure storage)
        const userData = {
            email: email,
            loginTime: new Date().toISOString(),
            remember: remember
        };
        
        // Store in memory (replace with proper auth system)
        window.authUser = userData;
        
        showAuthNotification('Login successful! Redirecting...', 'success');
        
        // Redirect after success
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const profession = formData.get('profession');
    const terms = formData.get('terms');
    const newsletter = formData.get('newsletter');
    
    // Validate signup form
    if (!validateSignupForm(firstName, lastName, email, password, confirmPassword, profession, terms)) {
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn);
    
    // Simulate signup API call
    simulateAuthRequest(() => {
        hideButtonLoading(submitBtn);
        
        // Store user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            profession: profession,
            newsletter: newsletter,
            signupTime: new Date().toISOString()
        };
        
        window.authUser = userData;
        
        showAuthNotification('Account created successfully! Welcome aboard!', 'success');
        
        // Redirect after success
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2500);
}

// Handle social login
function handleSocialLogin(e) {
    e.preventDefault();
    
    const provider = this.textContent.trim();
    
    showButtonLoading(this);
    
    // Simulate social login
    simulateAuthRequest(() => {
        hideButtonLoading(this);
        
        const userData = {
            email: `user@${provider.toLowerCase()}.com`,
            provider: provider,
            loginTime: new Date().toISOString()
        };
        
        window.authUser = userData;
        
        showAuthNotification(`${provider} login successful!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Validate login form
function validateLoginForm(email, password) {
    let isValid = true;
    
    // Email validation
    if (!email || !isValidEmail(email)) {
        showAuthFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearAuthFieldError('email');
    }
    
    // Password validation
    if (!password || password.length < 6) {
        showAuthFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearAuthFieldError('password');
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm(firstName, lastName, email, password, confirmPassword, profession, terms) {
    let isValid = true;
    
    // First name validation
    if (!firstName || firstName.trim().length < 2) {
        showAuthFieldError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    } else {
        clearAuthFieldError('firstName');
    }
    
    // Last name validation
    if (!lastName || lastName.trim().length < 2) {
        showAuthFieldError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    } else {
        clearAuthFieldError('lastName');
    }
    
    // Email validation
    if (!email || !isValidEmail(email)) {
        showAuthFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearAuthFieldError('email');
    }
    
    // Password validation
    if (!password || password.length < 8) {
        showAuthFieldError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else if (!isStrongPassword(password)) {
        showAuthFieldError('password', 'Password must contain letters and numbers');
        isValid = false;
    } else {
        clearAuthFieldError('password');
    }
    
    // Confirm password validation
    if (!confirmPassword || password !== confirmPassword) {
        showAuthFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        clearAuthFieldError('confirmPassword');
    }
    
    // Profession validation
    if (!profession) {
        showAuthFieldError('profession', 'Please select your profession');
        isValid = false;
    } else {
        clearAuthFieldError('profession');
    }
    
    // Terms validation
    if (!terms) {
        showAuthNotification('Please accept the terms and conditions', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Strong password validation
function isStrongPassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}

// Show auth field error
function showAuthFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const inputGroup = field.closest('.input-group') || field.parentElement;
    const formGroup = inputGroup.parentElement;
    
    // Clear existing errors
    clearAuthFieldError(fieldName);
    
    // Add error class
    formGroup.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    formGroup.appendChild(errorDiv);
    
    // Focus on field
    field.focus();
}

// Clear auth field error
function clearAuthFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const inputGroup = field.closest('.input-group') || field.parentElement;
    const formGroup = inputGroup.parentElement;
    const existingError = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    if (existingError) {
        existingError.remove();
    }
}

// Show auth notification
function showAuthNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 20000;
        min-width: 300px;
        animation: authNotificationSlide 0.3s ease;
    `;
    
    // Add animation styles
    if (!document.querySelector('#authNotificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'authNotificationStyles';
        styles.textContent = `
            @keyframes authNotificationSlide {
                from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .notification-icon {
                font-weight: bold;
                font-size: 1.2rem;
            }
            .notification-message {
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'authNotificationSlide 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Button loading state
function showButtonLoading(button) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    button.classList.add('loading');
}

function hideButtonLoading(button) {
    button.textContent = button.dataset.originalText || 'Submit';
    button.disabled = false;
    button.classList.remove('loading');
}

// Simulate authentication request
function simulateAuthRequest(callback, delay = 2000) {
    setTimeout(() => {
        // Simulate random success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            callback();
        } else {
            showAuthNotification('Authentication failed. Please try again.', 'error');
        }
    }, delay);
}

// Initialize password toggle functionality
function initPasswordToggle() {
    // This function is called from the onclick in HTML
    // No additional initialization needed
}

// Password toggle function (called from HTML)
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.parentElement.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Initialize form validation (real-time)
function initFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on input
        input.addEventListener('input', function() {
            if (this.parentElement.parentElement.classList.contains('error')) {
                clearAuthFieldError(this.id);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showAuthFieldError(field.id, 'Please enter a valid email address');
            } else if (value) {
                clearAuthFieldError(field.id);
                field.parentElement.parentElement.classList.add('success');
            }
            break;
            
        case 'password':
            if (value && value.length < 8) {
                showAuthFieldError(field.id, 'Password must be at least 8 characters');
            } else if (value && !isStrongPassword(value)) {
                showAuthFieldError(field.id, 'Password must contain letters and numbers');
            } else if (value) {
                clearAuthFieldError(field.id);
                field.parentElement.parentElement.classList.add('success');
            }
            break;
            
        case 'confirmPassword':
            const passwordField = document.getElementById('password');
            if (value && passwordField && value !== passwordField.value) {
                showAuthFieldError(field.id, 'Passwords do not match');
            } else if (value && passwordField && value === passwordField.value) {
                clearAuthFieldError(field.id);
                field.parentElement.parentElement.classList.add('success');
            }
            break;
            
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                showAuthFieldError(field.id, 'Must be at least 2 characters long');
            } else if (value) {
                clearAuthFieldError(field.id);
                field.parentElement.parentElement.classList.add('success');
            }
            break;
    }
}

// Check authentication status
function checkAuthStatus() {
    return window.authUser || null;
}

// Logout function
function logout() {
    window.authUser = null;
    showAuthNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Password strength indicator
function initPasswordStrength() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    // Create strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = `
        <div class="strength-bars">
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
        </div>
        <span class="strength-text">Enter password</span>
    `;
    
    // Add styles
    strengthIndicator.style.cssText = `
        margin-top: 0.5rem;
        font-size: 0.8rem;
    `;
    
    // Add CSS for strength bars
    if (!document.querySelector('#strengthStyles')) {
        const styles = document.createElement('style');
        styles.id = 'strengthStyles';
        styles.textContent = `
            .strength-bars {
                display: flex;
                gap: 2px;
                margin-bottom: 0.25rem;
            }
            .strength-bar {
                height: 3px;
                flex: 1;
                background: #e9ecef;
                border-radius: 2px;
                transition: background 0.3s ease;
            }
            .strength-bar.active {
                background: #27ae60;
            }
            .strength-bar.medium {
                background: #f39c12;
            }
            .strength-bar.weak {
                background: #e74c3c;
            }
            .strength-text {
                color: #666;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    passwordField.parentElement.parentElement.appendChild(strengthIndicator);
    
    // Update strength on input
    passwordField.addEventListener('input', function() {
        updatePasswordStrength(this.value, strengthIndicator);
    });
}

// Update password strength
function updatePasswordStrength(password, indicator) {
    const bars = indicator.querySelectorAll('.strength-bar');
    const text = indicator.querySelector('.strength-text');
    
    // Reset bars
    bars.forEach(bar => {
        bar.className = 'strength-bar';
    });
    
    if (password.length === 0) {
        text.textContent = 'Enter password';
        return;
    }
    
    let strength = 0;
    let strengthText = '';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    // Update bars and text
    switch (strength) {
        case 0:
        case 1:
            bars[0].classList.add('weak');
            strengthText = 'Weak';
            break;
        case 2:
            bars[0].classList.add('weak');
            bars[1].classList.add('weak');
            strengthText = 'Fair';
            break;
        case 3:
            bars[0].classList.add('medium');
            bars[1].classList.add('medium');
            bars[2].classList.add('medium');
            strengthText = 'Good';
            break;
        case 4:
        case 5:
            bars.forEach(bar => bar.classList.add('active'));
            strengthText = 'Strong';
            break;
    }
    
    text.textContent = strengthText;
}

// Initialize password strength on signup page
if (window.location.pathname.includes('signup')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initPasswordStrength, 100);
    });
}

// Form auto-save (drafts)
function initFormAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id;
        if (!formId) return;
        
        // Load saved data
        loadFormDraft(form);
        
        // Save on input
        form.addEventListener('input', debounce(() => {
            saveFormDraft(form);
        }, 1000));
    });
}

// Save form draft
function saveFormDraft(form) {
    const formData = new FormData(form);
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
        if (key !== 'password' && key !== 'confirmPassword') { // Don't save passwords
            draftData[key] = value;
        }
    }
    
    try {
        // In a real app, you might save to localStorage or send to server
        // For now, just store in memory
        window.formDrafts = window.formDrafts || {};
        window.formDrafts[form.id] = draftData;
    } catch (error) {
        console.log('Could not save form draft');
    }
}

// Load form draft
function loadFormDraft(form) {
    try {
        const draftData = window.formDrafts && window.formDrafts[form.id];
        if (!draftData) return;
        
        Object.keys(draftData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && field.type !== 'password') {
                field.value = draftData[key];
            }
        });
    } catch (error) {
        console.log('Could not load form draft');
    }
}

// Debounce utility function
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

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    initFormAutoSave();
});

// Forgot password functionality
function initForgotPassword() {
    const forgotLinks = document.querySelectorAll('.forgot-password');
    
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    });
}

// Show forgot password modal
function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'forgot-password-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 20000;
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
            max-width: 400px;
            width: 100%;
            position: relative;
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
            <h3 style="margin-bottom: 1rem; color: #333;">Reset Password</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Enter your email address and we'll send you a link to reset your password.</p>
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <input type="email" placeholder="Enter your email" required style="
                        width: 100%;
                        padding: 1rem;
                        border: 2px solid #e9ecef;
                        border-radius: 10px;
                        font-size: 1rem;
                        margin-bottom: 1rem;
                    ">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">
                    Send Reset Link
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('#forgotPasswordForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input').value;
        
        if (!isValidEmail(email)) {
            showAuthNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button');
        showButtonLoading(submitBtn);
        
        // Simulate sending reset email
        setTimeout(() => {
            hideButtonLoading(submitBtn);
            modal.remove();
            showAuthNotification('Password reset link sent to your email!', 'success');
        }, 2000);
    });
}

// Initialize forgot password
document.addEventListener('DOMContentLoaded', function() {
    initForgotPassword();
});

// Export auth functions
window.AuthSystem = {
    login: handleLogin,
    signup: handleSignup,
    logout: logout,
    checkAuthStatus: checkAuthStatus,
    validateEmail: isValidEmail,
    validatePassword: isStrongPassword,
    showNotification: showAuthNotification
};