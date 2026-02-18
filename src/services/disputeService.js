const prisma = require('../config/database');
const CONSTANTS = require('../config/constants');

async function getDisputedTransactions(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System Admin tüm disputed transaction'ları görür
    return prisma.transaction.findMany({
      where: {
        status_id: CONSTANTS.TRANSACTION_STATUS.DISPUTED,
      },
      include: {
        device: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { start_time: 'desc' },
    });
  }

  // Normal Admin: Sadece kendine atanmış cihazlardaki disputed transaction'ları görür
  return prisma.transaction.findMany({
    where: {
      status_id: CONSTANTS.TRANSACTION_STATUS.DISPUTED,
      device: {
        deviceAssignments: {
          some: {
            admin_user_id: adminUserId,
            is_active: true,
          },
        },
      },
    },
    include: {
      device: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { start_time: 'desc' },
  });
}

module.exports = {
  getDisputedTransactions,
};
