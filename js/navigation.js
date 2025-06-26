// Navigation functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initActiveNavigation();
    initStickyNavigation();
    initSearchFunctionality();
    
    console.log('Navigation system initialized');
});

// Initialize mobile navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize active navigation highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;
    
    // Highlight active section on scroll
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttled scroll listener
    window.addEventListener('scroll', throttle(highlightActiveSection, 100));
    
    // Initial call
    highlightActiveSection();
}

// Initialize sticky navigation
function initStickyNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let isNavbarHidden = false;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200 && !isNavbarHidden) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
            isNavbarHidden = true;
        } else if (scrollTop < lastScrollTop && isNavbarHidden) {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            isNavbarHidden = false;
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Add transition to navbar
    navbar.style.transition = 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
    
    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
}

// Initialize search functionality
function initSearchFunctionality() {
    // Create search button
    const searchBtn = createSearchButton();
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && searchBtn) {
        // Insert search button before auth buttons
        const authButtons = navMenu.querySelector('.auth-buttons');
        if (authButtons) {
            navMenu.insertBefore(searchBtn, authButtons);
        } else {
            navMenu.appendChild(searchBtn);
        }
    }
}

// Create search button
function createSearchButton() {
    const searchItem = document.createElement('li');
    searchItem.className = 'nav-item search-item';
    searchItem.innerHTML = `
        <button class="search-btn" aria-label="Search">
            <i class="fas fa-search"></i>
        </button>
    `;
    
    // Add styles
    const searchBtn = searchItem.querySelector('.search-btn');
    searchBtn.style.cssText = `
        background: none;
        border: none;
        color: #333;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    `;
    
    // Add hover effect
    searchBtn.addEventListener('mouseenter', () => {
        searchBtn.style.background = '#f8f9fa';
        searchBtn.style.color = '#6c5ce7';
    });
    
    searchBtn.addEventListener('mouseleave', () => {
        searchBtn.style.background = 'none';
        searchBtn.style.color = '#333';
    });
    
    // Add click handler
    searchBtn.addEventListener('click', showSearchModal);
    
    return searchItem;
}

// Show search modal
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 20000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10vh;
        animation: searchModalFade 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="search-container" style="
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <div class="search-header" style="
                padding: 1.5rem;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
                gap: 1rem;
            ">
                <i class="fas fa-search" style="color: #6c5ce7; font-size: 1.2rem;"></i>
                <input type="text" 
                       id="searchInput" 
                       placeholder="Search..." 
                       style="
                           flex: 1;
                           border: none;
                           outline: none;
                           font-size: 1.1rem;
                           background: transparent;
                       ">
                <button class="search-close" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #666;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                ">&times;</button>
            </div>
            <div class="search-results" style="
                padding: 1rem;
                max-height: 60vh;
                overflow-y: auto;
            ">
                <div class="search-suggestions">
                    <h4 style="color: #666; margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase;">Quick Links</h4>
                    <div class="suggestion-item" data-target="#home">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </div>
                    <div class="suggestion-item" data-target="#about">
                        <i class="fas fa-user"></i>
                        <span>About</span>
                    </div>
                    <div class="suggestion-item" data-target="#portfolio">
                        <i class="fas fa-briefcase"></i>
                        <span>Portfolio</span>
                    </div>
                    <div class="suggestion-item" data-target="#contact">
                        <i class="fas fa-envelope"></i>
                        <span>Contact</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add search modal styles
    if (!document.querySelector('#searchModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'searchModalStyles';
        styles.textContent = `
            @keyframes searchModalFade {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.8rem;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.2s ease;
                margin-bottom: 0.5rem;
            }
            .suggestion-item:hover {
                background: #f8f9fa;
            }
            .suggestion-item i {
                color: #6c5ce7;
                width: 20px;
            }
            .search-close:hover {
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Focus on search input
    const searchInput = modal.querySelector('#searchInput');
    searchInput.focus();
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.search-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle suggestion clicks
    const suggestions = modal.querySelectorAll('.suggestion-item');
    suggestions.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            modal.remove();
            
            // Scroll to section
            const section = document.querySelector(target);
            if (section) {
                const headerOffset = 80;
                const elementPosition = section.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const resultsContainer = modal.querySelector('.search-results');
        
        if (query.length > 2) {
            // Simulate search results
            const searchResults = performSearch(query);
            displaySearchResults(searchResults, resultsContainer);
        } else {
            // Show suggestions
            resultsContainer.innerHTML = `
                <div class="search-suggestions">
                    <h4 style="color: #666; margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase;">Quick Links</h4>
                    ${suggestions.map(s => s.outerHTML).join('')}
                </div>
            `;
        }
    });
    
    // Close on escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Perform search
function performSearch(query) {
    const searchableContent = [
        { title: 'Home', content: 'welcome portfolio developer creative', section: '#home' },
        { title: 'About Me', content: 'about developer experience skills html css javascript react', section: '#about' },
        { title: 'Portfolio', content: 'portfolio projects work ecommerce mobile app dashboard website', section: '#portfolio' },
        { title: 'Contact', content: 'contact email phone location message form', section: '#contact' },
        { title: 'E-Commerce Website', content: 'ecommerce shopping cart react nodejs mongodb', section: '#portfolio' },
        { title: 'Mobile App Design', content: 'mobile app design ui ux figma react native', section: '#portfolio' },
        { title: 'Analytics Dashboard', content: 'analytics dashboard data visualization vue d3', section: '#portfolio' },
        { title: 'Corporate Website', content: 'corporate website wordpress php seo', section: '#portfolio' }
    ];
    
    return searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
    ).slice(0, 5); // Limit results
}

// Display search results
function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No results found</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item suggestion-item" data-target="${result.section}">
            <i class="fas fa-file-alt"></i>
            <div>
                <div style="font-weight: 500;">${result.title}</div>
                <div style="font-size: 0.8rem; color: #666;">${result.content.substring(0, 50)}...</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="search-results-list">
            <h4 style="color: #666; margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase;">Search Results</h4>
            ${resultsHTML}
        </div>
    `;
    
    // Add click handlers to results
    const resultItems = container.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            container.closest('.search-modal').remove();
            
            // Scroll to section
            const section = document.querySelector(target);
            if (section) {
                const headerOffset = 80;
                const elementPosition = section.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Breadcrumb navigation
function initBreadcrumb() {
    const pathname = window.location.pathname;
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    
    if (!breadcrumbContainer) return;
    
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbItems = ['Home'];
    
    pathSegments.forEach(segment => {
        const formattedSegment = segment.replace('.html', '').replace(/[-_]/g, ' ');
        breadcrumbItems.push(formattedSegment.charAt(0).toUpperCase() + formattedSegment.slice(1));
    });
    
    const breadcrumbHTML = breadcrumbItems.map((item, index) => {
        if (index === breadcrumbItems.length - 1) {
            return `<span class="breadcrumb-current">${item}</span>`;
        } else {
            const href = index === 0 ? 'index.html' : '#';
            return `<a href="${href}" class="breadcrumb-link">${item}</a>`;
        }
    }).join(' <span class="breadcrumb-separator">/</span> ');
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Throttle utility function
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

// Add resize handler for navigation
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Export navigation functions
window.NavigationSystem = {
    showSearchModal,
    initMobileNavigation,
    initActiveNavigation,
    throttle
};