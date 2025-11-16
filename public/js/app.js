/**
 * VCET Alumni Hub - Mobile JavaScript
 */

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Disable long-press context menu on images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
});

// Active navigation highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.bottom-nav-item');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Image lazy loading fallback
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Use Intersection Observer for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Pull to refresh (optional)
let startY = 0;
let isPulling = false;

document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].pageY;
});

document.addEventListener('touchmove', function(e) {
    const currentY = e.touches[0].pageY;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop === 0 && currentY > startY) {
        isPulling = true;
    }
});

document.addEventListener('touchend', function() {
    if (isPulling) {
        // Optional: Trigger refresh
        // location.reload();
    }
    isPulling = false;
});

// Form validation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Confirm dialogs
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Disable zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Back button handling for Android WebView
window.addEventListener('popstate', function(e) {
    // Handle back navigation
    console.log('Back button pressed');
});

// Network status indicator
window.addEventListener('online', function() {
    console.log('Back online');
    // showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // showToast('No internet connection', 'warning');
});

// Prevent zoom on input focus (iOS)
const addMaximumScaleToMetaViewport = () => {
    const el = document.querySelector('meta[name=viewport]');
    if (el !== null) {
        let content = el.getAttribute('content');
        let re = /maximum\-scale=[0-9\.]+/g;
        
        if (re.test(content)) {
            content = content.replace(re, 'maximum-scale=1.0');
        } else {
            content = [content, 'maximum-scale=1.0'].join(', ');
        }
        
        el.setAttribute('content', content);
    }
};

addMaximumScaleToMetaViewport();
