const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const adminAuth = require('../middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: List all brands (filtered by role in service layer)
 *     tags: [Brands]
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
router.get('/', brandController.getBrands);

module.exports = router;
