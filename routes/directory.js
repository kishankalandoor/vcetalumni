/**
 * Alumni Directory Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Directory listing
router.get('/', isAuthenticated, async (req, res) => {
    const { search, batch_year, department, company, skill } = req.query;

    try {
        // Build query
        let sql = `
            SELECT u.id, u.name, u.role, p.batch_year, p.department, p.company, 
                   p.designation, p.profile_picture, p.location, p.skills
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.role = 'alumni' AND u.is_active = 1
        `;

        const params = [];

        if (search) {
            sql += ' AND u.name LIKE ?';
            params.push(`%${search}%`);
        }

        if (batch_year) {
            sql += ' AND p.batch_year = ?';
            params.push(batch_year);
        }

        if (department) {
            sql += ' AND p.department = ?';
            params.push(department);
        }

        if (company) {
            sql += ' AND p.company LIKE ?';
            params.push(`%${company}%`);
        }

        if (skill) {
            sql += ' AND p.skills LIKE ?';
            params.push(`%${skill}%`);
        }

        sql += ' ORDER BY u.name ASC';

        const [alumni] = await db.execute(sql, params);

        // Get unique values for filters
        const [batchYears] = await db.execute(`
            SELECT DISTINCT batch_year 
            FROM profiles 
            WHERE batch_year IS NOT NULL 
            ORDER BY batch_year DESC
        `);

        const [departments] = await db.execute(`
            SELECT DISTINCT department 
            FROM profiles 
            WHERE department IS NOT NULL 
            ORDER BY department
        `);

        res.render('directory/index', {
            pageTitle: 'Alumni Directory',
            alumni,
            batchYears: batchYears.map(row => row.batch_year),
            departments: departments.map(row => row.department),
            filters: { search, batch_year, department, company, skill }
        });

    } catch (error) {
        console.error('Directory error:', error);
        req.flash('error', 'Error loading directory');
        res.redirect('/dashboard');
    }
});

module.exports = router;
