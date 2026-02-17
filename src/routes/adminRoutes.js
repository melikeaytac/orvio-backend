const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * /admin/auth/register:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin user account.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "admin@example.com"
 *             password: "password123"
 *             first_name: "Alice"
 *             last_name: "Admin"
 *     responses:
 *       201:
 *         description: Admin registered
 *         content:
 *           application/json:
 *             example:
 *               user_id: "..."
 *               email: "admin@example.com"
 *               first_name: "Alice"
 *               last_name: "Admin"
 *               role: "ADMIN"
 */
router.post('/auth/register', adminController.register);

module.exports = router;

