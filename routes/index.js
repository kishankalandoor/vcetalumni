/**
 * Index/Landing Page Routes
 */

const express = require('express');
const router = express.Router();
const { isGuest } = require('../middleware/auth');

// Landing page
router.get('/', isGuest, (req, res) => {
    res.render('index', {
        pageTitle: 'Welcome'
    });
});

module.exports = router;
