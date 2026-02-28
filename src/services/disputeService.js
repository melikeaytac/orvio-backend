const prisma = require('../config/database');
const CONSTANTS = require('../config/constants');
const { paginate } = require('../utils/pagination');

async function getDisputedTransactions(adminUserId, isSystemAdmin, { page, limit }) {
  const where = isSystemAdmin
    ? { status_id: CONSTANTS.TRANSACTION_STATUS.DISPUTED }
    : {
        status_id: CONSTANTS.TRANSACTION_STATUS.DISPUTED,
        device: {
          deviceAssignments: {
            some: {
              admin_user_id: adminUserId,
              is_active: true,
            },
          },
        },
      };

  return paginate(
    prisma.transaction,
    {
      where,
      include: {
        device: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { start_time: 'desc' },
    },
    { page, limit },
  );
}

module.exports = {
  getDisputedTransactions,
};
