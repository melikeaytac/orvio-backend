const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const deviceAccess = require('../middleware/deviceAccess');

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin user and receive an access token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "admin@orvio.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # JWT
 *               admin:
 *                 user_id: "22222222-2222-2222-2222-222222222222"
 *                 first_name: "Admin"
 *                 last_name: "User"
 *                 email: "admin@orvio.com"
 */
// POST /admin/auth/login
router.post('/auth/login', adminController.login);

/**
 * @swagger
 * /admin/auth/register:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin user account.
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

// All routes below require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * /admin/devices:
 *   get:
 *     summary: List devices visible to the admin
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
 *                   location_description: "Test Store"
 */
// GET /admin/devices
router.get('/devices', adminController.getDevices);

/**
 * @swagger
 * /admin/brands:
 *   get:
 *     summary: List all brands
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             example:
 *               brands:
 *                 - brand_id: "brand-0001"
 *                   brand_name: "Coca-Cola"
 */
// GET /admin/brands
router.get('/brands', adminController.getBrands);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: List all products
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             example:
 *               products:
 *                 - product_id: "b3e1b2a4-0000-0000-0000-000000000001"
 *                   name: "Coke 330ml"
 *                   brand_id: "brand-0001"
 *                   unit_price: 50.0
 */
// GET /admin/products
router.get('/products', adminController.getProducts);

/**
 * @swagger
 * /admin/devices/{device_id}/inventory:
 *   get:
 *     summary: Get inventory for a specific device
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Inventory for the device
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               inventory:
 *                 - product_id: "b3e1b2a4-0000-0000-0000-000000000001"
 *                   product_name: "Coke 330ml"
 *                   current_stock: 10
 *                   critic_stock: 2
 */
// GET /admin/devices/:device_id/inventory
router.get('/devices/:device_id/inventory', deviceAccess, adminController.getDeviceInventory);

/**
 * @swagger
 * /admin/devices/{device_id}/transactions:
 *   get:
 *     summary: Get transactions for a specific device
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Transactions for the device
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               transactions:
 *                 - transaction_id: "7f2c4d9e-0000-0000-0000-000000000001"
 *                   status: "COMPLETED"
 *                   is_active: false
 */
// GET /admin/devices/:device_id/transactions
router.get('/devices/:device_id/transactions', deviceAccess, adminController.getDeviceTransactions);

/**
 * @swagger
 * /admin/transactions/{transaction_id}:
 *   get:
 *     summary: Get a specific transaction
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             example:
 *               transaction_id: "7f2c4d9e-0000-0000-0000-000000000001"
 *               user_id: "11111111-1111-1111-1111-111111111111"
 *               device_id: "dev-0001"
 *               status: "COMPLETED"
 */
// GET /admin/transactions/:transaction_id
router.get('/transactions/:transaction_id', adminController.getTransaction);

/**
 * @swagger
 * /admin/devices/{device_id}/telemetry:
 *   get:
 *     summary: Get recent telemetry for a device
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Telemetry records
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               telemetry:
 *                 - telemetry_id: "tele-0001"
 *                   temperature: 4.5
 *                   humidity: 60
 *                   door_status: false
 */
// GET /admin/devices/:device_id/telemetry
//router.get('/devices/:device_id/telemetry', deviceAccess, adminController.getDeviceTelemetry);
router.get(
  '/devices/:device_id/telemetry',
  adminAuth,        
  deviceAccess,     
  adminController.getDeviceTelemetry
);


/**
 * @swagger
 * /admin/devices/{device_id}/alerts:
 *   get:
 *     summary: Get alerts for a device
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Alerts for the device
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               alerts:
 *                 - alert_id: "alert-0001"
 *                   type: "temperature_high"
 *                   status: "OPEN"
 */
// GET /admin/devices/:device_id/alerts
router.get('/devices/:device_id/alerts', adminAuth, deviceAccess, adminController.getDeviceAlerts);

/**
 * @swagger
 * /admin/alerts/{alert_id}:
 *   patch:
 *     summary: Update an alert
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: alert_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the alert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "resolved"
 *             note: "Checked device, temperature back to normal."
 *     responses:
 *       200:
 *         description: Updated alert
 *         content:
 *           application/json:
 *             example:
 *               alert_id: "alert-0001"
 *               status: "RESOLVED"
 */
// PATCH /admin/alerts/:alert_id
router.patch('/alerts/:alert_id', adminController.updateAlert);

/**
 * @swagger
 * /admin/disputes/transactions:
 *   get:
 *     summary: Get all disputed transactions
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of disputed transactions
 *         content:
 *           application/json:
 *             example:
 *               disputes:
 *                 - transaction_id: "txn_999"
 *                   reason: "Product not delivered"
 *                   status: "pending_review"
 */
// GET /admin/disputes/transactions
router.get('/disputes/transactions', adminController.getDisputedTransactions);

module.exports = router;

