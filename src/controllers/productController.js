const productService = require('../services/productService');
const { parsePagination } = require('../utils/pagination');

async function getProducts(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await productService.getAllProducts(
      req.adminUser.user_id,
      req.isSystemAdmin,
      { page, limit }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
};
