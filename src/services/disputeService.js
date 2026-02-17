const prisma = require('../config/database');

async function getDisputedTransactions(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System Admin tüm disputed transaction'ları görür
    return prisma.transaction.findMany({
      where: {
        status: 'DISPUTED',
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
      status: 'DISPUTED',
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
