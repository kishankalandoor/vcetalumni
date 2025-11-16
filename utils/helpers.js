/**
 * Helper Utilities
 */

const crypto = require('crypto');

/**
 * Escape HTML to prevent XSS
 */
const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Format date for display
 */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Time ago function
 */
const timeAgo = (datetime) => {
    const timestamp = new Date(datetime).getTime();
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) {
        return 'just now';
    } else if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return `${mins} min${mins > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return formatDate(datetime);
    }
};

/**
 * Get user role badge HTML
 */
const getRoleBadge = (role) => {
    const badges = {
        admin: '<span class="badge bg-danger">Admin</span>',
        alumni: '<span class="badge bg-primary">Alumni</span>',
        student: '<span class="badge bg-success">Student</span>'
    };
    return badges[role] || '';
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Sanitize filename
 */
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Get file extension
 */
const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

/**
 * Check if file type is allowed
 */
const isAllowedFileType = (filename) => {
    const allowed = process.env.ALLOWED_EXTENSIONS.split(',');
    const ext = getFileExtension(filename);
    return allowed.includes(ext);
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    return { limit: parseInt(limit), offset };
};

/**
 * Generate avatar placeholder text
 */
const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
};

/**
 * Truncate text
 */
const truncate = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
};

module.exports = {
    escapeHtml,
    formatDate,
    timeAgo,
    getRoleBadge,
    generateToken,
    isValidEmail,
    sanitizeFilename,
    getFileExtension,
    isAllowedFileType,
    formatFileSize,
    paginate,
    getInitials,
    truncate
};
