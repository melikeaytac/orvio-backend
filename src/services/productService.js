const prisma = require('../config/database');

async function getAllProducts(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System Admin tüm ürünleri görür
    return prisma.product.findMany({
      include: {
        brand: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // Normal Admin: Sadece kendine atanmış cihazlardaki ürünleri görür
  return prisma.product.findMany({
    where: {
      inventories: {
        some: {
          device: {
            deviceAssignments: {
              some: {
                admin_user_id: adminUserId,
                is_active: true,
              },
            },
          },
        },
      },
    },
    include: {
      brand: true,
    },
    orderBy: { name: 'asc' },
  });
}

module.exports = {
  getAllProducts,
};
