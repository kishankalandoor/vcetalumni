/**
 * Newsfeed Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated, isAlumni } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const { timeAgo, getRoleBadge } = require('../utils/helpers');

// View newsfeed
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [posts] = await db.execute(`
            SELECT p.*, u.name, u.role, pr.profile_picture 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN profiles pr ON u.id = pr.user_id
            WHERE p.is_approved = 1
            ORDER BY p.created_at DESC
            LIMIT 50
        `);

        res.render('newsfeed/index', {
            pageTitle: 'Newsfeed',
            posts,
            timeAgo,
            getRoleBadge
        });

    } catch (error) {
        console.error('Newsfeed error:', error);
        req.flash('error', 'Error loading newsfeed');
        res.redirect('/dashboard');
    }
});

// Create post page
router.get('/create', isAlumni, (req, res) => {
    res.render('newsfeed/create', {
        pageTitle: 'Create Post'
    });
});

// Create post
router.post('/create', isAlumni, upload.single('image'), handleUploadError, [
    body('content').trim().notEmpty().withMessage('Post content cannot be empty'),
    body('post_type').isIn(['update', 'achievement', 'event'])
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/newsfeed/create');
    }

    const { content, post_type } = req.body;
    let image_path = null;

    if (req.file) {
        image_path = 'uploads/posts/' + req.file.filename;
    }

    try {
        await db.execute(`
            INSERT INTO posts (user_id, content, image, post_type) 
            VALUES (?, ?, ?, ?)
        `, [req.session.user.id, content, image_path, post_type]);

        req.flash('success', 'Post created successfully!');
        res.redirect('/newsfeed');

    } catch (error) {
        console.error('Create post error:', error);
        req.flash('error', 'Error creating post');
        res.redirect('/newsfeed/create');
    }
});

module.exports = router;
