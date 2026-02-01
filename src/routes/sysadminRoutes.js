const express = require('express');
const router = express.Router();
const sysadminController = require('../controllers/sysadminController');
const adminAuth = require('../middleware/adminAuth');


// All routes below require system admin authentication
router.use(adminAuth);

// Verify system admin for all routes
router.use((req, res, next) => {
  if (!req.isSystemAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'System admin access required',
    });
  }
  next();
});

/**
 * @swagger
 * /sysadmin/admins:
 *   get:
 *     summary: List all admins
 *     tags: [System Admin]
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             example:
 *               admins:
 *                 - user_id: "22222222-2222-2222-2222-222222222222"
 *                   first_name: "Admin"
 *                   last_name: "User"
 *                   email: "admin@orvio.com"
 *                   active: true
 */
// Admin management
// GET /sysadmin/admins
router.get('/admins', sysadminController.getAllAdmins);

/**
 * @swagger
 * /sysadmin/admins:
 *  post:
 *     summary: Create a new admin
 *     tags: [System Admin]
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "New Admin"
 *             email: "new.admin@example.com"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: Admin created
 *         content:
 *           application/json:
 *             example:
 *               user_id: "33333333-3333-3333-3333-333333333333"
 *               first_name: "New"
 *               last_name: "Admin"
 *               email: "new.admin@orvio.com"
 *               active: true
 */
// POST /sysadmin/admins
router.post('/admins', sysadminController.createAdmin);

/**
 * @swagger
 * /sysadmin/admins/{admin_id}:
 *   patch:
 *     summary: Update an admin
 *     tags: [System Admin]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: admin_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Admin Name"
 *             active: true
 *     responses:
 *       200:
 *         description: Updated admin
 *         content:
 *           application/json:
 *             example:
 *               user_id: "22222222-2222-2222-2222-222222222222"
 *               first_name: "Admin"
 *               last_name: "User"
 *               active: false
 */
// PATCH /sysadmin/admins/:admin_id
router.patch('/admins/:admin_id', sysadminController.updateAdmin);

/**
 * @swagger
 * /sysadmin/devices:
 *   get:
 *     summary: List all devices
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             example:
 *               devices:
 *                 - device_id: "dev-0001"
 *                   name: "Orvio Cooler #1"
 *                   status: "ONLINE"
 *                   session_limit: 5
 */
// Device management
// GET /sysadmin/devices
router.get('/devices', sysadminController.getAllDevices);

/**
 * @swagger
 * /sysadmin/devices:
 *   post:
 *     summary: Create a new device
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "New Cooler"
 *             serial_number: "SN-123456"
 *             location: "Store #1"
 *     responses:
 *       201:
 *         description: Device created
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0002"
 *               name: "Orvio Cooler #2"
 *               location_description: "New Store"
 */
// POST /sysadmin/devices
router.post('/devices', sysadminController.createDevice);

module.exports = router;

