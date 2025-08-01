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