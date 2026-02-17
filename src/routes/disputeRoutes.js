const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const adminAuth = require('../middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * /disputes/transactions:
 *   get:
 *     summary: Get all disputed transactions (filtered by role in service layer)
 *     tags: [Disputes]
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
router.get('/transactions', disputeController.getDisputedTransactions);

module.exports = router;
