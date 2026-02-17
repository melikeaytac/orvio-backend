const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');

/**
 * @swagger
 * /access/qr:
 *   post:
 *     summary: Process QR code for access
 *     tags: [Access QR]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             qrCode: "11111111-1111-1111-1111-111111111111"  # maps to user_id in seed
 *     responses:
 *       200:
 *         description: Access granted or denied
 *         content:
 *           application/json:
 *             example:
 *               status: "granted"
 *               user_id: "11111111-1111-1111-1111-111111111111"
 *               first_name: "Test"
 *               last_name: "User"
 */

// POST /access/qr
router.post('/qr', accessController.processQR);

module.exports = router;

