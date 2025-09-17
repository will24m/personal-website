// Modern, clean JavaScript for Will Wu's personal website

// Mobile Navigation Toggle
class MobileNav {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    if (this.hamburger && this.navMenu) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
      
      // Close menu when clicking on nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
          this.closeMenu();
        }
      });
    }
  }
  
  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }
  
  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }
}

// Smooth Scroll to Top
class SmoothScroll {
  constructor() {
    this.backToTopBtn = document.getElementById('back-to-top');
    this.init();
  }
  
  init() {
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
      
      // Show/hide button based on scroll position
      window.addEventListener('scroll', () => this.toggleBackToTop());
    }
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  toggleBackToTop() {
    if (window.pageYOffset > 300) {
      this.backToTopBtn.style.opacity = '1';
      this.backToTopBtn.style.visibility = 'visible';
    } else {
      this.backToTopBtn.style.opacity = '0';
      this.backToTopBtn.style.visibility = 'hidden';
    }
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.feedback = document.getElementById('formFeedback');
    
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = this.form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.simulateSubmission();
    }
  }
  
  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Clear previous error
    this.clearError(field);
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
      this.showError(field, `${this.getFieldLabel(field)} is required.`);
      return false;
    }
    
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showError(field, 'Please enter a valid email address.');
      return false;
    }
    
    if (field.id === 'message' && value && value.length < 10) {
      this.showError(field, 'Message must be at least 10 characters long.');
      return false;
    }
    
    return true;
  }
  
  showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      field.style.borderColor = '#dc2626';
    }
  }
  
  clearError(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
      field.style.borderColor = '';
    }
  }
  
  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(' *', '') : field.name;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  simulateSubmission() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.showFeedback('Thank you for your message! I\'ll get back to you soon.', 'success');
      this.form.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
  
  showFeedback(message, type = 'success') {
    if (this.feedback) {
      this.feedback.textContent = message;
      this.feedback.className = `form-feedback ${type}`;
      this.feedback.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.feedback.style.display = 'none';
      }, 5000);
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    // Create intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, this.observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.profile-text, .skill-category, .contact-item');
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new SmoothScroll();
  new ContactForm();
  new ScrollAnimations();
  
  // Add loaded class to body for any additional animations
  document.body.classList.add('loaded');
});

// Handle navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  }
});

// Chrome Dinosaur Game
class DinoGame {
    constructor() {
        this.dino = document.getElementById('dino');
        this.obstaclesContainer = document.getElementById('obstacles');
        this.cloudsContainer = document.getElementById('clouds');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverElement = document.getElementById('game-over');
        this.gameStartElement = document.getElementById('game-start');
        
        this.gameState = 'start'; // start, playing, gameOver
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        this.speed = 6;
        this.gravity = 0.6;
        this.jumpVelocity = -15;
        this.velocity = 0;
        this.isJumping = false;
        this.obstacles = [];
        this.clouds = [];
        this.gameLoop = null;
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        
        this.init();
    }
    
    init() {
        this.updateHighScore();
        this.bindEvents();
        this.showStartScreen();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleSpace();
            }
        });
        
        // Touch support for mobile
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleSpace();
        });
    }
    
    handleSpace() {
        switch (this.gameState) {
            case 'start':
                this.startGame();
                break;
            case 'playing':
                this.jump();
                break;
            case 'gameOver':
                this.restartGame();
                break;
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.speed = 6;
        this.velocity = 0;
        this.isJumping = false;
        this.obstacles = [];
        this.clouds = [];
        this.obstacleTimer = 0;
        this.cloudTimer = 0;
        
        this.dino.classList.add('running');
        this.dino.classList.remove('jumping');
        this.gameStartElement.classList.add('hidden');
        this.gameOverElement.classList.add('hidden');
        
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocity = this.jumpVelocity;
            this.dino.classList.add('jumping');
            this.dino.classList.remove('running');
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update dino position
        this.updateDino();
        
        // Update obstacles
        this.updateObstacles();
        
        // Update clouds
        this.updateClouds();
        
        // Check collisions
        this.checkCollisions();
        
        // Update score
        this.updateScore();
        
        // Continue game loop
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    
    updateDino() {
        // Apply gravity
        this.velocity += this.gravity;
        const dinoBottom = parseInt(this.dino.style.bottom) || 2;
        const newBottom = Math.max(2, dinoBottom - this.velocity);
        
        this.dino.style.bottom = newBottom + 'px';
        
        // Check if landed
        if (newBottom <= 2 && this.isJumping) {
            this.isJumping = false;
            this.velocity = 0;
            this.dino.classList.remove('jumping');
            this.dino.classList.add('running');
        }
    }
    
    updateObstacles() {
        // Create new obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer > 100 + Math.random() * 50) {
            this.createObstacle();
            this.obstacleTimer = 0;
        }
        
        // Move obstacles
        this.obstacles.forEach((obstacle, index) => {
            const left = parseInt(obstacle.style.left) || 800;
            obstacle.style.left = (left - this.speed) + 'px';
            
            // Remove obstacles that are off screen
            if (left < -50) {
                obstacle.remove();
                this.obstacles.splice(index, 1);
            }
        });
    }
    
    createObstacle() {
        const obstacle = document.createElement('div');
        const isPterodactyl = Math.random() < 0.3;
        
        obstacle.className = `obstacle ${isPterodactyl ? 'pterodactyl' : 'cactus'}`;
        obstacle.style.left = '800px';
        
        if (isPterodactyl) {
            obstacle.style.bottom = (Math.random() < 0.5 ? '50px' : '100px');
        }
        
        this.obstaclesContainer.appendChild(obstacle);
        this.obstacles.push(obstacle);
    }
    
    updateClouds() {
        // Create new clouds
        this.cloudTimer++;
        if (this.cloudTimer > 200 + Math.random() * 100) {
            this.createCloud();
            this.cloudTimer = 0;
        }
        
        // Move clouds
        this.clouds.forEach((cloud, index) => {
            const left = parseInt(cloud.style.left) || 800;
            cloud.style.left = (left - this.speed * 0.5) + 'px';
            
            // Remove clouds that are off screen
            if (left < -50) {
                cloud.remove();
                this.clouds.splice(index, 1);
            }
        });
    }
    
    createCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.left = '800px';
        cloud.style.top = (Math.random() * 150 + 50) + 'px';
        
        this.cloudsContainer.appendChild(cloud);
        this.clouds.push(cloud);
    }
    
    checkCollisions() {
        const dinoRect = this.dino.getBoundingClientRect();
        
        this.obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            if (this.isColliding(dinoRect, obstacleRect)) {
                this.gameOver();
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }
    
    updateScore() {
        this.score++;
        this.scoreElement.textContent = `Score: ${this.score}`;
        
        // Increase speed every 500 points
        if (this.score % 500 === 0) {
            this.speed += 0.5;
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        cancelAnimationFrame(this.gameLoop);
        
        this.dino.classList.remove('running', 'jumping');
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            this.updateHighScore();
        }
        
        this.gameOverElement.classList.remove('hidden');
    }
    
    restartGame() {
        // Clear all obstacles and clouds
        this.obstacles.forEach(obstacle => obstacle.remove());
        this.clouds.forEach(cloud => cloud.remove());
        this.obstacles = [];
        this.clouds = [];
        
        this.startGame();
    }
    
    showStartScreen() {
        this.gameStartElement.classList.remove('hidden');
        this.gameOverElement.classList.add('hidden');
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = `High Score: ${this.highScore}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dinoGame = new DinoGame();
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Form field values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  let valid = true;

  // Clear previous error messages
  document.getElementById('nameError').innerText = '';
  document.getElementById('emailError').innerText = '';
  document.getElementById('messageError').innerText = '';

  // Name validation
  if (name.trim() === '') {
      document.getElementById('nameError').innerText = 'Please enter your name.';
      valid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      document.getElementById('emailError').innerText = 'Please enter a valid email.';
      valid = false;
  }

  // Message validation
  if (message.trim() === '') {
      document.getElementById('messageError').innerText = 'Please enter your message.';
      valid = false;
  }

  if (valid) {
      document.getElementById('formFeedback').innerText = 'Your message has been sent! Thank you for reaching out.';
      document.getElementById('formFeedback').style.color = 'green';
      document.getElementById('contactForm').reset();
  }
});

// Site Manager - Connects admin panel to the actual site
class SiteManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadSiteContent();
        this.loadCustomizationSettings();
        this.loadGameSettings();
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
        
        // Update about content
        const aboutContent = JSON.parse(localStorage.getItem('aboutContent') || '{}');
        if (aboutContent.aboutText) {
            const aboutElements = document.querySelectorAll('.about-text, .about-content p');
            aboutElements.forEach(el => {
                if (el.textContent.includes('About') || el.textContent.includes('Your about text')) {
                    el.textContent = aboutContent.aboutText;
                }
            });
        }
        
        if (aboutContent.skills) {
            const skillsElements = document.querySelectorAll('.skills, .skills-list');
            skillsElements.forEach(el => {
                if (el.textContent.includes('HTML') || el.textContent.includes('Your skills')) {
                    el.textContent = aboutContent.skills;
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
    
    loadGameSettings() {
        const gameSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
        
        // Apply game speed
        if (gameSettings.speed) {
            const game = window.dinoGame;
            if (game) {
                game.speed = parseInt(gameSettings.speed);
            }
        }
        
        // Apply difficulty
        if (gameSettings.difficulty) {
            const game = window.dinoGame;
            if (game) {
                switch (gameSettings.difficulty) {
                    case 'easy':
                        game.gravity = 0.4;
                        game.jumpVelocity = -12;
                        break;
                    case 'medium':
                        game.gravity = 0.6;
                        game.jumpVelocity = -15;
                        break;
                    case 'hard':
                        game.gravity = 0.8;
                        game.jumpVelocity = -18;
                        break;
                }
            }
        }
    }
    
    setupAutoRefresh() {
        // Refresh content when localStorage changes (for admin panel updates)
        window.addEventListener('storage', (e) => {
            if (e.key && (e.key.includes('Content') || e.key.includes('customization') || e.key.includes('gameSettings'))) {
                setTimeout(() => {
                    this.loadSiteContent();
                    this.loadCustomizationSettings();
                    this.loadGameSettings();
                }, 100);
            }
        });
        
        // Also check for changes every 2 seconds (for same-tab updates)
        setInterval(() => {
            this.loadSiteContent();
            this.loadCustomizationSettings();
            this.loadGameSettings();
        }, 2000);
    }
}

// Initialize the site manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DinoGame();
    new SiteManager();
});
