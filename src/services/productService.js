const prisma = require('../config/database');
const { paginate } = require('../utils/pagination');

async function getAllProducts(adminUserId, isSystemAdmin, { page, limit }) {
  const where = isSystemAdmin
    ? {}
    : {
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
      };

  return paginate(
    prisma.product,
    {
      where,
      include: { brand: true },
      orderBy: { name: 'asc' },
    },
    { page, limit },
  );
}

module.exports = {
  getAllProducts,
};
