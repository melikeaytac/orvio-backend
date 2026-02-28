const brandService = require('../services/brandService');
const { parsePagination } = require('../utils/pagination');

async function getBrands(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await brandService.getAllBrands(
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
  getBrands,
};
