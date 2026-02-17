const prisma = require('../config/database');

async function getAllBrands(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System Admin her şeyi görür
    return prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { brand_name: 'asc' },
    });
  }

  // Normal Admin: Sadece kendine atanmış cihazlardaki ürünlerin markalarını görür
  return prisma.brand.findMany({
    where: {
      products: {
        some: {
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
      },
    },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { brand_name: 'asc' },
  });
}

module.exports = {
  getAllBrands,
};
