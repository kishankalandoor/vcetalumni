/**
 * API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Like/Unlike post
router.post('/like-post', isAuthenticated, async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.session.user.id;

    if (!post_id) {
        return res.json({ success: false, message: 'Post ID required' });
    }

    try {
        // Check if already liked
        const [existing] = await db.execute(
            'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
            [post_id, user_id]
        );

        let liked = false;

        if (existing.length > 0) {
            // Unlike
            await db.execute(
                'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
                [post_id, user_id]
            );
            await db.execute(
                'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
                [post_id]
            );
            liked = false;
        } else {
            // Like
            await db.execute(
                'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
                [post_id, user_id]
            );
            await db.execute(
                'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
                [post_id]
            );
            liked = true;
        }

        // Get updated count
        const [post] = await db.execute(
            'SELECT likes_count FROM posts WHERE id = ?',
            [post_id]
        );

        res.json({
            success: true,
            liked,
            likes_count: post[0].likes_count
        });

    } catch (error) {
        console.error('Like post error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

module.exports = router;
