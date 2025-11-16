/**
 * VCET Alumni Hub - Main Server File
 * Node.js + Express + MySQL
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Initialize Express app
const app = express();

// Import database connection
const db = require('./config/database');

// Middleware Setup
app.use(helmet({
    contentSecurityPolicy: false // Disable for CDN resources
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Flash messages
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    res.locals.user = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.user;
    res.locals.APP_NAME = process.env.APP_NAME;
    res.locals.BASE_URL = process.env.BASE_URL;
    next();
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/profile', require('./routes/profile'));
app.use('/directory', require('./routes/directory'));
app.use('/newsfeed', require('./routes/newsfeed'));
app.use('/jobs', require('./routes/jobs'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('errors/404', {
        pageTitle: 'Page Not Found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('errors/500', {
        pageTitle: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║   VCET Alumni Hub - Node.js Server Started     ║
╠════════════════════════════════════════════════╣
║  Environment: ${process.env.NODE_ENV.padEnd(32)} ║
║  Server URL:  http://${HOST}:${PORT}${' '.repeat(21 - HOST.length - PORT.toString().length)} ║
║  Database:    ${process.env.DB_NAME.padEnd(32)} ║
╚════════════════════════════════════════════════╝
    `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    db.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

module.exports = app;
