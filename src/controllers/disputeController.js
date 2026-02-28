const disputeService = require('../services/disputeService');
const { parsePagination } = require('../utils/pagination');

async function getDisputedTransactions(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await disputeService.getDisputedTransactions(
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
  getDisputedTransactions,
};
