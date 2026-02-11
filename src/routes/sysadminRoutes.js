const express = require('express');
const router = express.Router();
const sysadminController = require('../controllers/sysadminController');
const adminAuth = require('../middleware/adminAuth');
const transactionController = require('../controllers/transactionController'); 

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
 *                 - user_id: "uuid"
 *                   first_name: "Admin"
 *                   last_name: "User"
 *                   email: "admin@orvio.com"
 *                   role_id: "ADMIN"
 *                   active: true
 */
// Admin management
// GET /sysadmin/admins
router.get('/admins', sysadminController.getAllAdmins);

/**
 * @swagger
 * /sysadmin/admins:
 *   post:
 *     summary: Create a new admin
 *     tags:
 *       - System Admin
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - SYSTEM_ADMIN
 *                 default: ADMIN
 *           example:
 *             first_name: "Yeni"
 *             last_name: "Admin"
 *             email: "yeni.admin@orvio.com"
 *             password: "password123"
 *             role_id: "ADMIN"
 *     responses:
 *       201:
 *         description: Admin created
 *         content:
 *           application/json:
 *             example:
 *               user_id: "uuid"
 *               first_name: "Yeni"
 *               last_name: "Admin"
 *               email: "yeni.admin@orvio.com"
 *               role_id: "ADMIN"
 *               active: true
 */
// POST /sysadmin/admins
router.post('/admins', sysadminController.createAdmin);

/**
 * @swagger
 * /sysadmin/admins/{admin_id}:
 *   patch:
 *     summary: Update an admin
 *     tags:
 *       - System Admin
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: admin_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               active:
 *                 type: boolean
 *               role_id:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - SYSTEM_ADMIN
 *           example:
 *             first_name: "Güncel Admin"
 *             active: false
 *             role_id: "SYSTEM_ADMIN"
 *     responses:
 *       200:
 *         description: Updated admin
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

/**
 * @swagger
 * /sysadmin/transactions/{transaction_id}/inventory/apply:
 *   post:
 *     summary: Manually apply inventory changes for a transaction
 *     tags: [System Admin]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           example:
 *             force: true
 *             note: "Re-applying after reconciliation."
 *     responses:
 *       200:
 *         description: Inventory applied
 *         content:
 *           application/json:
 *             example:
 *               transaction_id: "7f2c4d9e-0000-0000-0000-000000000001"
 *               applied: true
 */
// Transaction inventory apply (System Admin only)
// POST /sysadmin/transactions/:transaction_id/inventory/apply
router.post('/transactions/:transaction_id/inventory/apply', transactionController.applyInventoryManually);

module.exports = router;

