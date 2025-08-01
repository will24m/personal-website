class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.querySelector('.login-btn');
        
        // Admin credentials (in a real app, this would be server-side)
        this.adminCredentials = {
            username: 'william',
            password: 'admin123' // You can change this password
        };
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        this.setupInputEffects();
        this.checkExistingSession();
    }
    
    setupInputEffects() {
        // Add focus effects
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
            
            // Add typing animation
            input.addEventListener('input', () => {
                if (input.value.length > 0) {
                    input.classList.add('has-content');
                } else {
                    input.classList.remove('has-content');
                }
            });
        });
    }
    
    checkExistingSession() {
        // Check if user is already logged in
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        if (isLoggedIn === 'true') {
            this.redirectToAdmin();
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        // Clear any existing messages
        this.clearMessages();
        
        // Validate inputs
        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Simulate API call delay
        await this.simulateApiCall();
        
        // Check credentials
        if (this.validateCredentials(username, password)) {
            this.loginSuccess();
        } else {
            this.loginError();
        }
        
        this.setLoadingState(false);
    }
    
    validateCredentials(username, password) {
        return username === this.adminCredentials.username && 
               password === this.adminCredentials.password;
    }
    
    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500); // 1.5 second delay
        });
    }
    
    loginSuccess() {
        // Store session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', this.usernameInput.value);
        
        // Show success message
        this.showSuccess('Login successful! Redirecting...');
        
        // Redirect to admin panel
        setTimeout(() => {
            this.redirectToAdmin();
        }, 1000);
    }
    
    loginError() {
        this.showError('Invalid username or password');
        this.passwordInput.value = '';
        this.passwordInput.focus();
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        this.form.insertBefore(successDiv, this.form.firstChild);
    }
    
    clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }
    
    redirectToAdmin() {
        window.location.href = 'admin.html';
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}); 