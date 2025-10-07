// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Analytics and Engagement Tracking
class BlogAnalytics {
    constructor() {
        this.gaId = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID
        this.init();
    }
    
    init() {
        this.initGoogleAnalytics();
        this.trackPageView();
        this.trackPostEngagement();
        this.trackNewsletterSignup();
        this.trackCategoryClicks();
    }
    
    initGoogleAnalytics() {
        // Load Google Analytics
        if (typeof gtag === 'undefined') {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', this.gaId);
        }
    }
    
    trackPageView() {
        // Track page view
        const pageData = {
            url: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        };
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', this.gaId, {
                page_title: pageData.title,
                page_location: window.location.href
            });
        }
        
        // Store in localStorage for backup
        this.storeEvent('page_view', pageData);
    }
    
    trackPostEngagement() {
        // Track post card clicks
        document.querySelectorAll('.post-card, .featured-card, .recent-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const postTitle = card.querySelector('.post-title a, .featured-title a, .recent-title a')?.textContent;
                const postUrl = card.querySelector('.post-title a, .featured-title a, .recent-title a')?.href;
                
                // Send to Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'post_click', {
                        event_category: 'engagement',
                        event_label: postTitle,
                        value: 1
                    });
                }
                
                this.storeEvent('post_click', {
                    title: postTitle,
                    url: postUrl,
                    timestamp: new Date().toISOString()
                });
            });
        });
        
        // Track reading time
        this.trackReadingTime();
    }
    
    trackReadingTime() {
        const startTime = Date.now();
        let readingTime = 0;
        
        // Track scroll depth
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
        });
        
        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            readingTime = Math.round((Date.now() - startTime) / 1000);
            
            this.storeEvent('reading_session', {
                duration: readingTime,
                maxScrollDepth: maxScrollDepth,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    async trackNewsletterSignup() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = document.getElementById('newsletterEmail');
                const submitButton = document.getElementById('newsletterSubmit');
                const messageDiv = document.getElementById('newsletterMessage');
                const email = emailInput.value.trim();
                
                // Validate email
                if (!email || !this.isValidEmail(email)) {
                    this.showNewsletterMessage('Email không hợp lệ', 'error', messageDiv);
                    return;
                }
                
                // Show loading state
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Đang xử lý...';
                submitButton.disabled = true;
                messageDiv.style.display = 'none';
                
                try {
                    // Send to newsletter API
                    const response = await fetch('/api/newsletter', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Send to Google Analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'newsletter_signup', {
                                event_category: 'engagement',
                                event_label: 'newsletter',
                                value: 1
                            });
                        }
                        
                        this.storeEvent('newsletter_signup', {
                            email: email,
                            timestamp: new Date().toISOString()
                        });
                        
                        this.showNewsletterMessage(result.message, 'success', messageDiv);
                        newsletterForm.reset();
                    } else {
                        this.showNewsletterMessage(result.error || 'Có lỗi xảy ra', 'error', messageDiv);
                    }
                } catch (error) {
                    console.error('Newsletter signup error:', error);
                    this.showNewsletterMessage('Có lỗi xảy ra, vui lòng thử lại sau', 'error', messageDiv);
                } finally {
                    // Reset button state
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            });
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showNewsletterMessage(message, type, messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `newsletter-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    
    trackCategoryClicks() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryName = card.querySelector('h3')?.textContent;
                
                // Send to Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'category_click', {
                        event_category: 'navigation',
                        event_label: categoryName,
                        value: 1
                    });
                }
                
                this.storeEvent('category_click', {
                    category: categoryName,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }
    
    storeEvent(eventType, data) {
        const events = JSON.parse(localStorage.getItem('blog_analytics') || '[]');
        events.push({
            type: eventType,
            data: data
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('blog_analytics', JSON.stringify(events));
        
        // In production, send to analytics service
        console.log('Analytics Event:', eventType, data);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    getAnalytics() {
        return JSON.parse(localStorage.getItem('blog_analytics') || '[]');
    }
}

// Initialize analytics
const analytics = new BlogAnalytics();

// Add like functionality to posts
document.querySelectorAll('.post-card').forEach(card => {
    const likeButton = card.querySelector('.likes');
    if (likeButton) {
        likeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const currentLikes = parseInt(likeButton.textContent) || 0;
            const newLikes = currentLikes + 1;
            
            likeButton.textContent = `${newLikes} lượt thích`;
            likeButton.style.color = '#ef4444';
            
            // Track like event
            analytics.storeEvent('post_like', {
                postTitle: card.querySelector('.post-title a')?.textContent,
                timestamp: new Date().toISOString()
            });
        });
    }
});

// Add view counter simulation
document.querySelectorAll('.post-card').forEach(card => {
    const viewsElement = card.querySelector('.views');
    if (viewsElement) {
        const currentViews = parseInt(viewsElement.textContent) || 0;
        const newViews = currentViews + Math.floor(Math.random() * 5) + 1;
        viewsElement.textContent = `${newViews} lượt xem`;
    }
});

// Performance Optimization Features
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrollPerformance();
        this.addServiceWorker();
    }
    
    lazyLoadImages() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    preloadCriticalResources() {
        // Preload critical CSS and JS
        const criticalResources = [
            '/css/style.css',
            '/js/main.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    optimizeScrollPerformance() {
        // Throttle scroll events for better performance
        let ticking = false;
        
        const updateScrollEffects = () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    addServiceWorker() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Search Functionality
class BlogSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.tagFilter = document.getElementById('tagFilter');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchResultsTitle = document.getElementById('searchResultsTitle');
        this.searchResultsCount = document.getElementById('searchResultsCount');
        this.noResults = document.getElementById('noResults');
        this.postsList = document.querySelector('.posts-list');
        
        this.init();
    }
    
    init() {
        if (this.searchInput) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        // Search button click
        this.searchBtn?.addEventListener('click', () => {
            this.performSearch();
        });
        
        // Enter key in search input
        this.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // Real-time search (debounced)
        let searchTimeout;
        this.searchInput?.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.searchInput.value.length >= 2) {
                    this.performSearch();
                } else if (this.searchInput.value.length === 0) {
                    this.clearSearch();
                }
            }, 300);
        });
        
        // Filter changes
        this.categoryFilter?.addEventListener('change', () => {
            if (this.searchInput.value.length >= 2) {
                this.performSearch();
            }
        });
        
        this.tagFilter?.addEventListener('change', () => {
            if (this.searchInput.value.length >= 2) {
                this.performSearch();
            }
        });
    }
    
    async performSearch() {
        const query = this.searchInput.value.trim();
        const category = this.categoryFilter?.value || 'all';
        const tag = this.tagFilter?.value || 'all';
        
        if (query.length < 2) {
            this.clearSearch();
            return;
        }
        
        try {
            // Show loading state
            this.showLoadingState();
            
            // Perform search
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}&tag=${tag}&limit=10`);
            const data = await response.json();
            
            if (data.success) {
                this.displaySearchResults(data.results, data.metadata);
            } else {
                this.showError(data.error || 'Có lỗi xảy ra khi tìm kiếm');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Có lỗi xảy ra khi tìm kiếm');
        }
    }
    
    displaySearchResults(results, metadata) {
        // Hide original posts list
        if (this.postsList) {
            this.postsList.style.display = 'none';
        }
        
        // Update results header
        this.searchResultsTitle.textContent = `Kết quả tìm kiếm cho "${metadata.query}"`;
        this.searchResultsCount.textContent = `${metadata.returnedResults}/${metadata.totalResults}`;
        
        // Clear previous results
        this.searchResultsList.innerHTML = '';
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Display results
        results.forEach(post => {
            const resultItem = this.createSearchResultItem(post);
            this.searchResultsList.appendChild(resultItem);
        });
        
        // Show results
        this.searchResults.style.display = 'block';
        this.noResults.style.display = 'none';
        
        // Track search event
        if (typeof analytics !== 'undefined') {
            analytics.storeEvent('search_performed', {
                query: metadata.query,
                resultsCount: results.length,
                filters: metadata.filters,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    createSearchResultItem(post) {
        const item = document.createElement('article');
        item.className = 'search-result-item';
        
        item.innerHTML = `
            <div class="search-result-meta">
                <span class="search-result-category">${post.categories[0]}</span>
                <time class="search-result-date">${post.date}</time>
            </div>
            <h3 class="search-result-title">
                <a href="/blog/${post.slug}/">${post.title}</a>
            </h3>
            <p class="search-result-excerpt">${post.excerpt}</p>
            <div class="search-result-tags">
                ${post.tags.slice(0, 3).map(tag => `<span class="search-result-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        return item;
    }
    
    showNoResults() {
        this.searchResults.style.display = 'none';
        this.noResults.style.display = 'block';
    }
    
    showLoadingState() {
        this.searchResultsList.innerHTML = '<div class="loading">Đang tìm kiếm...</div>';
        this.searchResults.style.display = 'block';
        this.noResults.style.display = 'none';
    }
    
    showError(message) {
        this.searchResultsList.innerHTML = `<div class="error">${message}</div>`;
        this.searchResults.style.display = 'block';
        this.noResults.style.display = 'none';
    }
    
    clearSearch() {
        this.searchResults.style.display = 'none';
        this.noResults.style.display = 'none';
        
        if (this.postsList) {
            this.postsList.style.display = 'block';
        }
    }
}

// Reading Progress Bar
class ReadingProgress {
    constructor() {
        this.progressBar = document.getElementById('readingProgressBar');
        this.init();
    }
    
    init() {
        if (this.progressBar) {
            this.setupScrollListener();
        }
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
    }
}

// Initialize search and reading progress
document.addEventListener('DOMContentLoaded', function() {
    const blogSearch = new BlogSearch();
    const readingProgress = new ReadingProgress();
});