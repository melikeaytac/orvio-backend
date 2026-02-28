const prisma = require('../config/database');
const { paginate } = require('../utils/pagination');

async function getAllBrands(adminUserId, isSystemAdmin, { page, limit }) {
  const where = isSystemAdmin
    ? {}
    : {
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
      };

  return paginate(
    prisma.brand,
    {
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { brand_name: 'asc' },
    },
    { page, limit },
  );
}

module.exports = {
  getAllBrands,
};
