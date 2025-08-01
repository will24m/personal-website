// Portfolio Page JavaScript
class PortfolioManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.addParallaxEffect();
    }
    
    bindEvents() {
        // Filter button events
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProjects(filter);
                this.updateActiveButton(e.target);
            });
        });
        
        // Project card hover effects
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
        
        // Tech tag animations
        document.querySelectorAll('.tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', this.handleTagHover.bind(this));
        });
    }
    
    filterProjects(filter) {
        this.currentFilter = filter;
        
        this.projectCards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                this.animateCardIn(card);
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    }
    
    animateCardIn(card) {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'slideInUp 0.6s ease-out forwards';
    }
    
    updateActiveButton(clickedButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        clickedButton.classList.add('active');
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const overlay = card.querySelector('.card-overlay');
        const techStack = card.querySelector('.tech-stack');
        
        // Animate tech stack
        if (techStack) {
            techStack.style.transform = 'translateY(0)';
            techStack.style.opacity = '1';
        }
        
        // Add floating effect
        card.style.transform = 'translateY(-10px) scale(1.02)';
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const techStack = card.querySelector('.tech-stack');
        
        // Reset tech stack
        if (techStack) {
            techStack.style.transform = 'translateY(20px)';
            techStack.style.opacity = '0';
        }
        
        // Reset card position
        card.style.transform = 'translateY(0) scale(1)';
    }
    
    handleTagHover(e) {
        const tag = e.target;
        tag.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            tag.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.projectCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.project-preview');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
    new SiteManager();
});

// Add smooth scrolling for anchor links
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
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add mouse trail effect
class MouseTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addPoint(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addPoint(x, y) {
        this.points.push({ x, y, age: 0 });
        
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }
    }
    
    animate() {
        this.points.forEach((point, index) => {
            point.age += 1;
            
            if (point.age > 30) {
                this.points.splice(index, 1);
            }
        });
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    draw() {
        // Create or get canvas
        let canvas = document.getElementById('mouse-trail');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'mouse-trail';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9999';
            document.body.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.points.forEach((point, index) => {
            const alpha = 1 - (point.age / 30);
            const size = 3 - (point.age / 10);
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 99, 71, ${alpha})`;
            ctx.fill();
        });
    }
}

// Initialize mouse trail (optional - can be disabled)
// new MouseTrail();

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