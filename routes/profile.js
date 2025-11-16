/**
 * Profile Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const { timeAgo, getRoleBadge } = require('../utils/helpers');

// View profile
router.get('/:id?', isAuthenticated, async (req, res) => {
    const userId = req.params.id || req.session.user.id;

    try {
        const [profiles] = await db.execute(`
            SELECT u.*, p.* 
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `, [userId]);

        if (profiles.length === 0) {
            req.flash('error', 'Profile not found');
            return res.redirect('/dashboard');
        }

        const profile = profiles[0];

        // Get user's posts
        const [posts] = await db.execute(`
            SELECT * FROM posts 
            WHERE user_id = ? AND is_approved = 1 
            ORDER BY created_at DESC 
            LIMIT 10
        `, [userId]);

        res.render('profile/view', {
            pageTitle: 'Profile',
            profile,
            posts,
            isOwnProfile: userId == req.session.user.id,
            timeAgo,
            getRoleBadge
        });

    } catch (error) {
        console.error('Profile error:', error);
        req.flash('error', 'Error loading profile');
        res.redirect('/dashboard');
    }
});

// Edit profile page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const userId = req.params.id;

    // Check if user can edit this profile
    if (userId != req.session.user.id && req.session.user.role !== 'admin') {
        req.flash('error', 'You can only edit your own profile');
        return res.redirect('/profile/' + userId);
    }

    try {
        const [profiles] = await db.execute(`
            SELECT u.*, p.* 
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `, [userId]);

        if (profiles.length === 0) {
            req.flash('error', 'Profile not found');
            return res.redirect('/dashboard');
        }

        res.render('profile/edit', {
            pageTitle: 'Edit Profile',
            profile: profiles[0]
        });

    } catch (error) {
        console.error('Edit profile error:', error);
        req.flash('error', 'Error loading profile');
        res.redirect('/dashboard');
    }
});

// Update profile
router.post('/edit/:id', isAuthenticated, upload.single('profile_picture'), handleUploadError, async (req, res) => {
    const userId = req.params.id;

    // Check if user can edit this profile
    if (userId != req.session.user.id && req.session.user.role !== 'admin') {
        req.flash('error', 'You can only edit your own profile');
        return res.redirect('/profile/' + userId);
    }

    const {
        batch_year,
        department,
        company,
        designation,
        skills,
        bio,
        contact_email,
        linkedin_url,
        github_url,
        location,
        phone
    } = req.body;

    try {
        let profile_picture = null;

        // Handle file upload
        if (req.file) {
            profile_picture = 'uploads/profiles/' + req.file.filename;
        }

        // Build update query
        let sql = `
            UPDATE profiles SET 
                batch_year = ?,
                department = ?,
                company = ?,
                designation = ?,
                skills = ?,
                bio = ?,
                contact_email = ?,
                linkedin_url = ?,
                github_url = ?,
                location = ?,
                phone = ?
        `;

        const params = [
            batch_year || null,
            department || null,
            company || null,
            designation || null,
            skills || null,
            bio || null,
            contact_email || null,
            linkedin_url || null,
            github_url || null,
            location || null,
            phone || null
        ];

        if (profile_picture) {
            sql += ', profile_picture = ?';
            params.push(profile_picture);
        }

        sql += ' WHERE user_id = ?';
        params.push(userId);

        await db.execute(sql, params);

        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile/' + userId);

    } catch (error) {
        console.error('Update profile error:', error);
        req.flash('error', 'Error updating profile');
        res.redirect('/profile/edit/' + userId);
    }
});

module.exports = router;
