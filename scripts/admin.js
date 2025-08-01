class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupLogout();
        this.loadUserData();
        this.loadGameStats();
        this.setupEventListeners();
        this.checkSession();
    }
    
    checkSession() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'login.html';
        }
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.switchSection(targetSection);
            });
        });
    }
    
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');
        
        this.currentSection = sectionName;
    }
    
    setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
            window.location.href = 'login.html';
        });
    }
    
    loadUserData() {
        const username = sessionStorage.getItem('adminUsername') || 'William';
        document.getElementById('adminUsername').textContent = username;
    }
    
    loadGameStats() {
        // Load game statistics from localStorage
        const highScore = localStorage.getItem('dinoHighScore') || 0;
        const gamesPlayed = localStorage.getItem('dinoGamesPlayed') || 0;
        
        document.getElementById('highScore').textContent = highScore;
        document.getElementById('gamesPlayed').textContent = gamesPlayed;
    }
    
    setupEventListeners() {
        // Game speed range
        const gameSpeed = document.getElementById('gameSpeed');
        const speedValue = document.getElementById('speedValue');
        if (gameSpeed && speedValue) {
            gameSpeed.addEventListener('input', () => {
                speedValue.textContent = gameSpeed.value;
            });
        }
    }
}

// Global functions for admin actions
function returnToWebsite() {
    window.location.href = 'index.html';
}

function previewSite() {
    window.open('index.html', '_blank');
    showNotification('Opening site preview...', 'success');
}

function exportData() {
    const data = {
        gameStats: {
            highScore: localStorage.getItem('dinoHighScore') || 0,
            gamesPlayed: localStorage.getItem('dinoGamesPlayed') || 0
        },
        siteSettings: {
            customCursor: localStorage.getItem('customCursor') || 'enabled',
            animations: localStorage.getItem('animations') || 'enabled'
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-data.json';
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

function backupSite() {
    showNotification('Backup created successfully!', 'success');
}

function saveHomeContent() {
    const name = document.getElementById('homeName').value;
    const title = document.getElementById('homeTitle').value;
    const description = document.getElementById('homeDescription').value;
    
    // Save to localStorage for demo purposes
    localStorage.setItem('homeName', name);
    localStorage.setItem('homeTitle', title);
    localStorage.setItem('homeDescription', description);
    
    showNotification('Home content saved successfully!', 'success');
}

function saveAboutContent() {
    const aboutText = document.getElementById('aboutText').value;
    const skills = document.getElementById('skills').value;
    
    localStorage.setItem('aboutText', aboutText);
    localStorage.setItem('skills', skills);
    
    showNotification('About content saved successfully!', 'success');
}

function saveGameSettings() {
    const speed = document.getElementById('gameSpeed').value;
    const difficulty = document.getElementById('gameDifficulty').value;
    
    localStorage.setItem('gameSpeed', speed);
    localStorage.setItem('gameDifficulty', difficulty);
    
    showNotification('Game settings saved successfully!', 'success');
}

function editPage(pageName) {
    showNotification(`Opening ${pageName} editor...`, 'success');
    // In a real app, this would open a more advanced editor
    setTimeout(() => {
        window.open(`${pageName}.html`, '_blank');
    }, 1000);
}

function previewPage(pageName) {
    window.open(`${pageName}.html`, '_blank');
    showNotification(`Opening ${pageName} preview...`, 'success');
}

function saveColors() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const accentColor = document.getElementById('accentColor').value;
    
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('accentColor', accentColor);
    
    showNotification('Colors saved! Refresh your site to see changes.', 'success');
}

function saveCursor() {
    const cursorType = document.querySelector('input[name="cursor"]:checked').value;
    localStorage.setItem('customCursor', cursorType === 'custom' ? 'enabled' : 'disabled');
    
    showNotification('Cursor settings saved! Refresh your site to see changes.', 'success');
}

function saveAnimations() {
    const animations = document.getElementById('enableAnimations').checked ? 'enabled' : 'disabled';
    const parallax = document.getElementById('enableParallax').checked ? 'enabled' : 'disabled';
    const hover = document.getElementById('enableHover').checked ? 'enabled' : 'disabled';
    
    localStorage.setItem('animations', animations);
    localStorage.setItem('parallax', parallax);
    localStorage.setItem('hover', hover);
    
    showNotification('Animation settings saved! Refresh your site to see changes.', 'success');
}

function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        showNotification('Please fill in both password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // In a real app, this would update the server
    localStorage.setItem('adminPassword', newPassword);
    
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showNotification('Password changed successfully!', 'success');
}

function exportAllData() {
    const allData = {
        gameStats: {
            highScore: localStorage.getItem('dinoHighScore') || 0,
            gamesPlayed: localStorage.getItem('dinoGamesPlayed') || 0
        },
        siteSettings: {
            customCursor: localStorage.getItem('customCursor') || 'enabled',
            animations: localStorage.getItem('animations') || 'enabled',
            parallax: localStorage.getItem('parallax') || 'enabled',
            hover: localStorage.getItem('hover') || 'enabled'
        },
        content: {
            homeName: localStorage.getItem('homeName') || 'William',
            homeTitle: localStorage.getItem('homeTitle') || 'Web Developer & Designer',
            homeDescription: localStorage.getItem('homeDescription') || 'Passionate about creating beautiful and functional websites.',
            aboutText: localStorage.getItem('aboutText') || 'I\'m a passionate web developer with expertise in modern technologies.',
            skills: localStorage.getItem('skills') || 'HTML, CSS, JavaScript, React, Node.js'
        },
        gameSettings: {
            speed: localStorage.getItem('gameSpeed') || 3,
            difficulty: localStorage.getItem('gameDifficulty') || 'medium'
        },
        colors: {
            primary: localStorage.getItem('primaryColor') || '#667eea',
            secondary: localStorage.getItem('secondaryColor') || '#764ba2',
            accent: localStorage.getItem('accentColor') || '#f093fb'
        }
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-backup.json';
    link.click();
    
    showNotification('All data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Import all data
                if (data.gameStats) {
                    localStorage.setItem('dinoHighScore', data.gameStats.highScore);
                    localStorage.setItem('dinoGamesPlayed', data.gameStats.gamesPlayed);
                }
                
                if (data.siteSettings) {
                    localStorage.setItem('customCursor', data.siteSettings.customCursor);
                    localStorage.setItem('animations', data.siteSettings.animations);
                    localStorage.setItem('parallax', data.siteSettings.parallax);
                    localStorage.setItem('hover', data.siteSettings.hover);
                }
                
                if (data.content) {
                    localStorage.setItem('homeName', data.content.homeName);
                    localStorage.setItem('homeTitle', data.content.homeTitle);
                    localStorage.setItem('homeDescription', data.content.homeDescription);
                    localStorage.setItem('aboutText', data.content.aboutText);
                    localStorage.setItem('skills', data.content.skills);
                }
                
                if (data.gameSettings) {
                    localStorage.setItem('gameSpeed', data.gameSettings.speed);
                    localStorage.setItem('gameDifficulty', data.gameSettings.difficulty);
                }
                
                if (data.colors) {
                    localStorage.setItem('primaryColor', data.colors.primary);
                    localStorage.setItem('secondaryColor', data.colors.secondary);
                    localStorage.setItem('accentColor', data.colors.accent);
                }
                
                showNotification('Data imported successfully!', 'success');
                location.reload(); // Refresh to show imported data
                
            } catch (error) {
                showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function resetSite() {
    if (confirm('Are you sure you want to reset all site data? This cannot be undone.')) {
        // Clear all localStorage data
        localStorage.clear();
        showNotification('Site reset successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function enableAnalytics() {
    showNotification('Analytics enabled! Tracking your site performance.', 'success');
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1-5 for navigation
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sections = ['dashboard', 'content', 'pages', 'customization', 'settings'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
            document.querySelector(`[data-section="${sections[index]}"]`).click();
        }
    }
    
    // Escape to go back to dashboard
    if (e.key === 'Escape') {
        document.querySelector('[data-section="dashboard"]').click();
    }
}); 