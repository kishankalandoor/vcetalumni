/**
 * Authentication Middleware
 */

/**
 * Check if user is logged in
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'Please login to access this page');
    res.redirect('/auth/login');
};

/**
 * Check if user is guest (not logged in)
 */
const isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/dashboard');
};

/**
 * Check if user is alumni
 */
const isAlumni = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'alumni' || req.session.user.role === 'admin') {
            return next();
        }
    }
    req.flash('error', 'Access denied. Alumni only.');
    res.redirect('/dashboard');
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'admin') {
            return next();
        }
    }
    req.flash('error', 'Access denied. Admins only.');
    res.redirect('/dashboard');
};

/**
 * Check if user is student
 */
const isStudent = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'student') {
            return next();
        }
    }
    req.flash('error', 'Access denied. Students only.');
    res.redirect('/dashboard');
};

/**
 * Set user data in res.locals
 */
const setUserLocals = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
        res.locals.isLoggedIn = true;
        res.locals.isAdmin = req.session.user.role === 'admin';
        res.locals.isAlumni = req.session.user.role === 'alumni';
        res.locals.isStudent = req.session.user.role === 'student';
    } else {
        res.locals.user = null;
        res.locals.isLoggedIn = false;
        res.locals.isAdmin = false;
        res.locals.isAlumni = false;
        res.locals.isStudent = false;
    }
    next();
};

module.exports = {
    isAuthenticated,
    isGuest,
    isAlumni,
    isAdmin,
    isStudent,
    setUserLocals
};
