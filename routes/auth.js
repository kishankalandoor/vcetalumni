/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { isGuest } = require('../middleware/auth');

// Login page
router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login'
    });
});

// Login POST
router.post('/login', isGuest, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.flash('error', 'Please provide valid credentials');
        return res.redirect('/auth/login');
    }

    const { email, password } = req.body;

    try {
        const [users] = await db.execute(
            'SELECT id, email, password, name, role, is_active FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        const user = users[0];

        if (user.is_active !== 1) {
            req.flash('error', 'Your account has been deactivated. Please contact admin.');
            return res.redirect('/auth/login');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        // Set session
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/auth/login');
    }
});

// Register page
router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', {
        pageTitle: 'Register'
    });
});

// Register POST
router.post('/register', isGuest, [
    body('name').trim().notEmpty().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    body('role').isIn(['student', 'alumni'])
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/auth/register');
    }

    const { name, email, password, role } = req.body;

    try {
        // Check if email exists
        const [existing] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            req.flash('error', 'Email address already registered');
            return res.redirect('/auth/register');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, role]
        );

        const userId = result.insertId;

        // Create empty profile
        await db.execute(
            'INSERT INTO profiles (user_id) VALUES (?)',
            [userId]
        );

        req.flash('success', 'Registration successful! You can now login.');
        res.redirect('/auth/login');

    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/auth/register');
    }
});

// Forgot password page
router.get('/forgot-password', isGuest, (req, res) => {
    res.render('auth/forgot-password', {
        pageTitle: 'Forgot Password'
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;
