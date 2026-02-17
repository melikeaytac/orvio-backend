const brandService = require('../services/brandService');

async function getBrands(req, res, next) {
  try {
    const brands = await brandService.getAllBrands(
      req.adminUser.user_id, // adminAuth middleware'inden geliyor
      req.isSystemAdmin      // adminAuth middleware'inden geliyor
    );
    res.json(brands);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBrands,
};
