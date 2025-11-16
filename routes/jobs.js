/**
 * Jobs Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated, isAlumni } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { timeAgo, formatDate } = require('../utils/helpers');

// Job listings
router.get('/', isAuthenticated, async (req, res) => {
    const { job_type, location, search } = req.query;

    try {
        let sql = `
            SELECT j.*, u.name as posted_by, pr.company as poster_company
            FROM jobs j
            JOIN users u ON j.user_id = u.id
            LEFT JOIN profiles pr ON u.id = pr.user_id
            WHERE j.is_active = 1 AND j.is_approved = 1
        `;

        const params = [];

        if (search) {
            sql += ' AND (j.job_title LIKE ? OR j.company LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (job_type) {
            sql += ' AND j.job_type = ?';
            params.push(job_type);
        }

        if (location) {
            sql += ' AND j.location LIKE ?';
            params.push(`%${location}%`);
        }

        sql += ' ORDER BY j.created_at DESC';

        const [jobs] = await db.execute(sql, params);

        res.render('jobs/index', {
            pageTitle: 'Job Opportunities',
            jobs,
            filters: { job_type, location, search },
            timeAgo,
            formatDate
        });

    } catch (error) {
        console.error('Jobs error:', error);
        req.flash('error', 'Error loading jobs');
        res.redirect('/dashboard');
    }
});

// Create job page
router.get('/create', isAlumni, (req, res) => {
    res.render('jobs/create', {
        pageTitle: 'Post a Job'
    });
});

// Create job
router.post('/create', isAlumni, [
    body('job_title').trim().notEmpty(),
    body('company').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('description').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Please fill in all required fields');
        return res.redirect('/jobs/create');
    }

    const {
        job_title,
        company,
        location,
        job_type,
        description,
        requirements,
        apply_link,
        salary_range,
        expires_at
    } = req.body;

    try {
        await db.execute(`
            INSERT INTO jobs (user_id, job_title, company, location, job_type, 
                              description, requirements, apply_link, salary_range, expires_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            req.session.user.id,
            job_title,
            company,
            location,
            job_type || 'full-time',
            description,
            requirements || null,
            apply_link || null,
            salary_range || null,
            expires_at || null
        ]);

        req.flash('success', 'Job posted successfully!');
        res.redirect('/jobs');

    } catch (error) {
        console.error('Create job error:', error);
        req.flash('error', 'Error posting job');
        res.redirect('/jobs/create');
    }
});

module.exports = router;
