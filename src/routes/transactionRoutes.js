const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const adminAuth = require('../middleware/adminAuth');
const { idempotencyMiddleware } = require('../middleware/idempotency');

/**
 * @swagger
 * /transactions/{transaction_id}:
 *   get:
 *     summary: Get a specific transaction (role-based access in service layer)
 *     tags: [Transactions]
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
router.get('/transactions/:transaction_id', adminAuth, transactionController.getTransaction);

/**
 * @swagger
 * /transactions/{transaction_id}/summary:
 *   get:
 *     summary: Get transaction summary
 *     tags: [Transactions]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction summary
 *         content:
 *           application/json:
 *             example:
 *               transaction_id: "7f2c4d9e-0000-0000-0000-000000000001"
 *               user_id: "11111111-1111-1111-1111-111111111111"
 *               device_id: "dev-0001"
 *               status: "COMPLETED"
 *               items:
 *                 - transaction_item_id: "9c1d2e3f-0000-0000-0000-000000000001"
 *                   product_id: "b3e1b2a4-0000-0000-0000-000000000001"
 *                   name: "Coke 330ml"
 *                   quantity: 2
 *                   unit_price_at_sale: 50.0
 */
router.get('/transactions/:transaction_id/summary', transactionController.getTransactionSummary);


/**
 * @swagger
 * /sessions/{transaction_id}/confirm:
 *   post:
 *     summary: Confirm a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             user_id: "user123"
 *             payment_method: "credit_card"
 *     responses:
 *       200:
 *         description: Transaction confirmed
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Transaction confirmed."
 */
router.post(
  '/sessions/:transaction_id/confirm',
  idempotencyMiddleware('confirm'),
  transactionController.confirmTransaction
);


/**
 * @swagger
 * /sessions/{transaction_id}/dispute:
 *   post:
 *     summary: Dispute a transaction
 *     description: Reports an issue with the transaction. reported_at is handled automatically. Defaults to reason 'OTHER' if not provided.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 enum:
 *                   - WRONG_ITEM
 *                   - MISSING_ITEM
 *                   - OTHER
 *                 default: OTHER
 *               message:
 *                 type: string
 *                 example: "The item was damaged."
 *     responses:
 *       200:
 *         description: Dispute submitted
 */

router.post('/sessions/:transaction_id/dispute', transactionController.disputeTransaction);


// POST /transactions/:transaction_id/inventory/apply (System Admin only - handled in sysadmin routes)
// This is included here for completeness but should be protected by sysadmin middleware

module.exports = router;

