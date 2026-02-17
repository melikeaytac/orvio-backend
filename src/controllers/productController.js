const productService = require('../services/productService');

async function getProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts(
      req.adminUser.user_id, // adminAuth middleware'inden geliyor
      req.isSystemAdmin      // adminAuth middleware'inden geliyor
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
};
