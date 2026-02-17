const disputeService = require('../services/disputeService');

async function getDisputedTransactions(req, res, next) {
  try {
    const disputes = await disputeService.getDisputedTransactions(
      req.adminUser.user_id,
      req.isSystemAdmin
    );
    res.json(disputes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDisputedTransactions,
};
