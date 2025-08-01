// Blog Page JavaScript
class BlogManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.blogCards = document.querySelectorAll('.blog-card');
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.addTypingEffect();
        this.addReadingProgress();
    }
    
    bindEvents() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterContent();
        });
        
        // Category filter
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                this.updateActiveCategory(e.target);
            });
        });
        
        // Blog card interactions
        this.blogCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            // Add click to expand functionality
            card.addEventListener('click', this.handleCardClick.bind(this));
        });
        
        // Tag interactions
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                this.filterByTag(e.target.textContent);
            });
        });
        
        // Pagination
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', this.handlePagination.bind(this));
        });
    }
    
    filterContent() {
        this.blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            const matchesSearch = this.searchTerm === '' || 
                title.includes(this.searchTerm) || 
                content.includes(this.searchTerm) ||
                tags.some(tag => tag.includes(this.searchTerm));
            
            const matchesCategory = this.currentCategory === 'all' || 
                card.dataset.category === this.currentCategory;
            
            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                this.highlightSearchTerms(card);
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        this.filterContent();
    }
    
    filterByTag(tagName) {
        // Create a temporary search for the tag
        this.searchInput.value = tagName;
        this.searchTerm = tagName.toLowerCase();
        this.currentCategory = 'all';
        this.filterContent();
        
        // Update category buttons
        this.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
    }
    
    highlightSearchTerms(card) {
        if (this.searchTerm === '') {
            // Remove existing highlights
            card.innerHTML = card.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
            return;
        }
        
        const title = card.querySelector('h3');
        const content = card.querySelector('p');
        
        // Highlight in title
        title.innerHTML = title.textContent.replace(
            new RegExp(`(${this.searchTerm})`, 'gi'),
            '<mark class="highlight">$1</mark>'
        );
        
        // Highlight in content (first occurrence only)
        const contentText = content.textContent;
        const firstMatch = contentText.toLowerCase().indexOf(this.searchTerm);
        if (firstMatch !== -1) {
            const before = contentText.substring(0, firstMatch);
            const match = contentText.substring(firstMatch, firstMatch + this.searchTerm.length);
            const after = contentText.substring(firstMatch + this.searchTerm.length);
            content.innerHTML = `${before}<mark class="highlight">${match}</mark>${after}`;
        }
    }
    
    updateActiveCategory(clickedButton) {
        this.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        clickedButton.classList.add('active');
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.image-placeholder');
        const tags = card.querySelectorAll('.tag');
        
        // Animate image
        if (image) {
            image.style.transform = 'scale(1.1) rotate(2deg)';
        }
        
        // Animate tags
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-3px) scale(1.05)';
            }, index * 100);
        });
        
        // Add floating effect
        card.style.transform = 'translateY(-10px) scale(1.02)';
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.image-placeholder');
        const tags = card.querySelectorAll('.tag');
        
        // Reset image
        if (image) {
            image.style.transform = 'scale(1) rotate(0deg)';
        }
        
        // Reset tags
        tags.forEach(tag => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
        
        // Reset card
        card.style.transform = 'translateY(0) scale(1)';
    }
    
    handleCardClick(e) {
        const card = e.currentTarget;
        const title = card.querySelector('h3').textContent;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
        
        // Simulate opening article (you can replace this with actual navigation)
        console.log(`Opening article: ${title}`);
        
        // Add a visual feedback
        this.showNotification(`Opening: ${title}`);
    }
    
    handlePagination(e) {
        const button = e.target;
        const pageButtons = document.querySelectorAll('.page-btn');
        
        // Update active state
        pageButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add click animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Simulate page change
        this.showNotification('Loading page...');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation for child elements
                    const tags = entry.target.querySelectorAll('.tag');
                    tags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.opacity = '1';
                            tag.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.blogCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    addTypingEffect() {
        const searchInput = this.searchInput;
        const placeholder = searchInput.placeholder;
        let i = 0;
        
        function typeWriter() {
            if (i < placeholder.length) {
                searchInput.placeholder = placeholder.substring(0, i + 1);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    searchInput.placeholder = '';
                    setTimeout(() => {
                        searchInput.placeholder = placeholder;
                        i = 0;
                        setTimeout(typeWriter, 2000);
                    }, 1000);
                }, 2000);
            }
        }
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
    
    addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6347, #ff4500);
            z-index: 10000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
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

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
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
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        document.getElementById('searchInput').value = '';
        document.getElementById('searchInput').dispatchEvent(new Event('input'));
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}); 