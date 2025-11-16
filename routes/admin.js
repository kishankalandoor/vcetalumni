/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');

// Admin dashboard
router.get('/', isAdmin, async (req, res) => {
    try {
        // Get statistics
        const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [totalPosts] = await db.execute('SELECT COUNT(*) as count FROM posts');
        const [pendingPosts] = await db.execute('SELECT COUNT(*) as count FROM posts WHERE is_approved = 0');
        const [totalJobs] = await db.execute('SELECT COUNT(*) as count FROM jobs');

        // Get recent users
        const [recentUsers] = await db.execute(`
            SELECT id, name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 10
        `);

        // Get pending posts
        const [postsAwaitingApproval] = await db.execute(`
            SELECT p.*, u.name 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.is_approved = 0
            ORDER BY p.created_at DESC
            LIMIT 10
        `);

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            stats: {
                totalUsers: totalUsers[0].count,
                totalPosts: totalPosts[0].count,
                pendingPosts: pendingPosts[0].count,
                totalJobs: totalJobs[0].count
            },
            recentUsers,
            postsAwaitingApproval
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        req.flash('error', 'Error loading admin dashboard');
        res.redirect('/dashboard');
    }
});

// Approve post
router.post('/posts/:id/approve', isAdmin, async (req, res) => {
    const postId = req.params.id;

    try {
        await db.execute('UPDATE posts SET is_approved = 1 WHERE id = ?', [postId]);
        req.flash('success', 'Post approved successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error('Approve post error:', error);
        req.flash('error', 'Error approving post');
        res.redirect('/admin');
    }
});

// Delete post
router.post('/posts/:id/delete', isAdmin, async (req, res) => {
    const postId = req.params.id;

    try {
        await db.execute('DELETE FROM posts WHERE id = ?', [postId]);
        req.flash('success', 'Post deleted successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error('Delete post error:', error);
        req.flash('error', 'Error deleting post');
        res.redirect('/admin');
    }
});

module.exports = router;
