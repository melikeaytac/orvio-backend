const express = require('express');
const router = express.Router();
const sysadminController = require('../controllers/sysadminController');
const adminController = require('../controllers/adminController');
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
 * /sysadmin/devices/{device_id}:
 *   patch:
 *     summary: Update a device
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Renamed Cooler"
 *             status: "offline"
 *     responses:
 *       200:
 *         description: Updated device
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               name: "Renamed Cooler"
 *               status: "OFFLINE"
 */
// PATCH /sysadmin/devices/:device_id
router.patch('/devices/:device_id', sysadminController.updateDevice);

/**
 * @swagger
 * /sysadmin/assignments:
 *   get:
 *     summary: List all device assignments
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             example:
 *               assignments:
 *                 - assignment_id: "assign-0001"
 *                   device_id: "dev-0001"
 *                   admin_user_id: "22222222-2222-2222-2222-222222222222"
 */
// Assignment management
// GET /sysadmin/assignments
router.get('/assignments', sysadminController.getAllAssignments);

/**
 * @swagger
 * /sysadmin/assignments:
 *   post:
 *     summary: Create a new assignment
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             device_id: "dev_1"
 *             location: "Store #2"
 *     responses:
 *       201:
 *         description: Assignment created
 *         content:
 *           application/json:
 *             example:
 *               assignment_id: "assign-0002"
 *               device_id: "dev-0001"
 *               admin_user_id: "33333333-3333-3333-3333-333333333333"
 */
// POST /sysadmin/assignments
router.post('/assignments', sysadminController.createAssignment);

/**
 * @swagger
 * /sysadmin/assignments/{assignment_id}:
 *   patch:
 *     summary: Update an assignment
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: assignment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             location: "Store #3"
 *     responses:
 *       200:
 *         description: Updated assignment
 *         content:
 *           application/json:
 *             example:
 *               id: "assign_1"
 *               location: "Store #3"
 */
// PATCH /sysadmin/assignments/:assignment_id
router.patch('/assignments/:assignment_id', sysadminController.updateAssignment);

/**
 * @swagger
 * /sysadmin/brands:
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
// Brand management
// GET /sysadmin/brands
router.get('/brands', sysadminController.getAllBrands);

/**
 * @swagger
 * /sysadmin/brands:
 *   post:
 *     summary: Create a new brand
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Pepsi"
 *     responses:
 *       201:
 *         description: Brand created
 *         content:
 *           application/json:
 *             example:
 *               brand_id: "brand-0002"
 *               brand_name: "Pepsi"
 */
// POST /sysadmin/brands
router.post('/brands', sysadminController.createBrand);

/**
 * @swagger
 * /sysadmin/brands/{brand_id}:
 *   patch:
 *     summary: Update a brand
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: brand_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Brand Name"
 *     responses:
 *       200:
 *         description: Updated brand
 *         content:
 *           application/json:
 *             example:
 *               brand_id: "brand-0001"
 *               brand_name: "Updated Brand Name"
 */
// PATCH /sysadmin/brands/:brand_id
router.patch('/brands/:brand_id', sysadminController.updateBrand);

/**
 * @swagger
 * /sysadmin/products:
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
// Product management
// GET /sysadmin/products
router.get('/products', sysadminController.getAllProducts);

/**
 * @swagger
 * /sysadmin/products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Sprite 330ml"
 *             brand_id: "brand_1"
 *             price: 45.0
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             example:
 *               product_id: "b3e1b2a4-0000-0000-0000-000000000002"
 *               name: "Sprite 330ml"
 *               brand_id: "brand-0001"
 *               unit_price: 45.0
 */
// POST /sysadmin/products
router.post('/products', sysadminController.createProduct);

/**
 * @swagger
 * /sysadmin/products/{product_id}:
 *   patch:
 *     summary: Update a product
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             price: 55.0
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             example:
 *               product_id: "b3e1b2a4-0000-0000-0000-000000000001"
 *               unit_price: 55.0
 */
// PATCH /sysadmin/products/:product_id
router.patch('/products/:product_id', sysadminController.updateProduct);
/**
 * @swagger
 * /sysadmin/logs:
 *   get:
 *     summary: Get system logs
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: List of system logs
 *         content:
 *           application/json:
 *             example:
 *               logs:
 *                 - id: "log_1"
 *                   level: "info"
 *                   message: "System started"
 */
// System logs
// GET /sysadmin/logs
router.get('/logs', sysadminController.getSystemLogs);

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

