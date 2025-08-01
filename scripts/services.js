// Services Page JavaScript
class ServicesManager {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.pricingCards = document.querySelectorAll('.pricing-card');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.addParallaxEffect();
        this.addIconAnimations();
    }
    
    bindEvents() {
        // Service card interactions
        this.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleServiceCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleServiceCardLeave.bind(this));
            card.addEventListener('click', this.handleServiceCardClick.bind(this));
        });
        
        // Pricing card interactions
        this.pricingCards.forEach(card => {
            card.addEventListener('mouseenter', this.handlePricingCardHover.bind(this));
            card.addEventListener('mouseleave', this.handlePricingCardLeave.bind(this));
            card.addEventListener('click', this.handlePricingCardClick.bind(this));
        });
        
        // Service button interactions
        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', this.handleServiceButtonClick.bind(this));
        });
        
        // Pricing button interactions
        document.querySelectorAll('.pricing-btn').forEach(btn => {
            btn.addEventListener('click', this.handlePricingButtonClick.bind(this));
        });
    }
    
    handleServiceCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        const features = card.querySelectorAll('.feature');
        const techs = card.querySelectorAll('.tech');
        
        // Animate icon
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.boxShadow = '0 10px 25px rgba(255, 99, 71, 0.4)';
        }
        
        // Animate features with stagger
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateY(-2px) scale(1.05)';
                feature.style.background = 'rgba(255, 99, 71, 0.3)';
            }, index * 100);
        });
        
        // Animate tech tags with stagger
        techs.forEach((tech, index) => {
            setTimeout(() => {
                tech.style.transform = 'translateY(-2px) scale(1.05)';
                tech.style.background = 'rgba(255, 255, 255, 0.2)';
            }, index * 100);
        });
        
        // Add floating effect
        card.style.transform = 'translateY(-10px) scale(1.02)';
    }
    
    handleServiceCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        const features = card.querySelectorAll('.feature');
        const techs = card.querySelectorAll('.tech');
        
        // Reset icon
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.boxShadow = 'none';
        }
        
        // Reset features
        features.forEach(feature => {
            feature.style.transform = 'translateY(0) scale(1)';
            feature.style.background = 'rgba(255, 99, 71, 0.2)';
        });
        
        // Reset tech tags
        techs.forEach(tech => {
            tech.style.transform = 'translateY(0) scale(1)';
            tech.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Reset card
        card.style.transform = 'translateY(0) scale(1)';
    }
    
    handleServiceCardClick(e) {
        const card = e.currentTarget;
        const serviceName = card.querySelector('h3').textContent;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
        
        // Show notification
        this.showNotification(`Interested in ${serviceName}? Let's discuss your project!`);
    }
    
    handlePricingCardHover(e) {
        const card = e.currentTarget;
        const price = card.querySelector('.price');
        const features = card.querySelectorAll('li');
        
        // Animate price
        if (price) {
            price.style.transform = 'scale(1.1)';
            price.style.color = '#ff4500';
        }
        
        // Animate features
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(10px)';
                feature.style.color = '#fff';
            }, index * 50);
        });
        
        // Add floating effect
        if (card.classList.contains('featured')) {
            card.style.transform = 'scale(1.05) translateY(-10px)';
        } else {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }
    }
    
    handlePricingCardLeave(e) {
        const card = e.currentTarget;
        const price = card.querySelector('.price');
        const features = card.querySelectorAll('li');
        
        // Reset price
        if (price) {
            price.style.transform = 'scale(1)';
            price.style.color = '#ff6347';
        }
        
        // Reset features
        features.forEach(feature => {
            feature.style.transform = 'translateX(0)';
            feature.style.color = '#ccc';
        });
        
        // Reset card
        if (card.classList.contains('featured')) {
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }
    
    handlePricingCardClick(e) {
        const card = e.currentTarget;
        const planName = card.querySelector('h3').textContent;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (card.classList.contains('featured')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'scale(1)';
            }
        }, 150);
        
        // Show notification
        this.showNotification(`Great choice! Let's get started with the ${planName} plan.`);
    }
    
    handleServiceButtonClick(e) {
        e.preventDefault();
        const button = e.target;
        const serviceName = button.closest('.service-card').querySelector('h3').textContent;
        
        // Add button animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Show notification
        this.showNotification(`Requesting quote for ${serviceName}...`);
        
        // Simulate redirect to contact page
        setTimeout(() => {
            window.location.href = 'contact.html';
        }, 1000);
    }
    
    handlePricingButtonClick(e) {
        e.preventDefault();
        const button = e.target;
        const planName = button.closest('.pricing-card').querySelector('h3').textContent;
        
        // Add button animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Show notification
        this.showNotification(`Selecting ${planName} plan...`);
        
        // Simulate redirect to contact page
        setTimeout(() => {
            window.location.href = 'contact.html';
        }, 1000);
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation for child elements
                    const features = entry.target.querySelectorAll('.feature');
                    const techs = entry.target.querySelectorAll('.tech');
                    
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    techs.forEach((tech, index) => {
                        setTimeout(() => {
                            tech.style.opacity = '1';
                            tech.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.serviceCards.forEach(card => {
            observer.observe(card);
        });
        
        this.pricingCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.service-icon');
            
            parallaxElements.forEach(element => {
                const speed = 0.3;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) scale(1.1)`;
            });
        });
    }
    
    addIconAnimations() {
        // Add pulsing animation to service icons
        this.serviceCards.forEach((card, index) => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                setTimeout(() => {
                    icon.style.animation = 'pulse 2s infinite';
                }, index * 200);
            }
        });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6347, #ff4500);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize services manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesManager();
    new SiteManager();
});

// Add smooth scrolling
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

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close any open modals or notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('[style*="position: fixed"]');
        notifications.forEach(notification => {
            if (notification.style.transform === 'translateX(0px)') {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Site Manager - Connects admin panel to the actual site
class SiteManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadSiteContent();
        this.loadCustomizationSettings();
        this.setupAutoRefresh();
    }
    
    loadSiteContent() {
        // Load home page content
        const homeContent = JSON.parse(localStorage.getItem('homeContent') || '{}');
        
        // Update name
        if (homeContent.name) {
            const nameElements = document.querySelectorAll('.name, h1, .profile-name');
            nameElements.forEach(el => {
                if (el.textContent.includes('William') || el.textContent.includes('Your Name')) {
                    el.textContent = homeContent.name;
                }
            });
        }
        
        // Update title
        if (homeContent.title) {
            const titleElements = document.querySelectorAll('.title, .profile-title, h2');
            titleElements.forEach(el => {
                if (el.textContent.includes('Web Developer') || el.textContent.includes('Your Title')) {
                    el.textContent = homeContent.title;
                }
            });
        }
        
        // Update description
        if (homeContent.description) {
            const descElements = document.querySelectorAll('.description, .profile-description, p');
            descElements.forEach(el => {
                if (el.textContent.includes('passionate') || el.textContent.includes('Your description')) {
                    el.textContent = homeContent.description;
                }
            });
        }
    }
    
    loadCustomizationSettings() {
        const customization = JSON.parse(localStorage.getItem('customization') || '{}');
        
        // Apply color scheme
        if (customization.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', customization.primaryColor);
        }
        
        if (customization.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', customization.secondaryColor);
        }
        
        if (customization.accentColor) {
            document.documentElement.style.setProperty('--accent-color', customization.accentColor);
        }
        
        // Apply cursor type
        if (customization.cursorType) {
            const cursorStyles = {
                'default': 'auto',
                'pointer': 'pointer',
                'crosshair': 'crosshair',
                'custom': 'url("../images/cursor.png"), auto'
            };
            
            document.body.style.cursor = cursorStyles[customization.cursorType] || 'auto';
        }
        
        // Apply animations
        if (customization.animations === false) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }
    
    setupAutoRefresh() {
        // Refresh content when localStorage changes (for admin panel updates)
        window.addEventListener('storage', (e) => {
            if (e.key && (e.key.includes('Content') || e.key.includes('customization'))) {
                setTimeout(() => {
                    this.loadSiteContent();
                    this.loadCustomizationSettings();
                }, 100);
            }
        });
        
        // Also check for changes every 2 seconds (for same-tab updates)
        setInterval(() => {
            this.loadSiteContent();
            this.loadCustomizationSettings();
        }, 2000);
    }
} 