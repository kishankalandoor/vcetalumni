/**
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { timeAgo, getRoleBadge } = require('../utils/helpers');

// Dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Get statistics
        const [alumniCount] = await db.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'alumni'"
        );
        
        const [studentsCount] = await db.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'student'"
        );
        
        const [postsCount] = await db.execute(
            "SELECT COUNT(*) as count FROM posts WHERE is_approved = 1"
        );
        
        const [jobsCount] = await db.execute(
            "SELECT COUNT(*) as count FROM jobs WHERE is_active = 1"
        );

        // Get recent posts
        const [recentPosts] = await db.execute(`
            SELECT p.*, u.name, u.role, pr.profile_picture 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN profiles pr ON u.id = pr.user_id
            WHERE p.is_approved = 1
            ORDER BY p.created_at DESC
            LIMIT 5
        `);

        res.render('dashboard/index', {
            pageTitle: 'Dashboard',
            stats: {
                alumni: alumniCount[0].count,
                students: studentsCount[0].count,
                posts: postsCount[0].count,
                jobs: jobsCount[0].count
            },
            recentPosts,
            timeAgo,
            getRoleBadge
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/');
    }
});

module.exports = router;
