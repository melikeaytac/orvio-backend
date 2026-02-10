const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Unified Login for Admins and System Admins
 *     description: Authenticate any administrative user.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: "JWT_TOKEN_HERE"
 *               user:
 *                 user_id: "uuid"
 *                 email: "admin@orvio.com"
 *                 role: "SYSTEM_ADMIN"
 *       401:
 *         description: Invalid credentials
 */

router.post('/login', adminController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered
 *       409:
 *         description: Email already registered
 */
router.post('/register', adminController.register);

module.exports = router;