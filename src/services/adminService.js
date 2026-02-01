const prisma = require('../config/database');

async function getAdminDevices(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System admin sees all devices
    return prisma.cooler.findMany({
      orderBy: { name: 'asc' },
    });
  }
}  

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createAdminUser({ email, password_hash, first_name, last_name, role_id, active }) {
  return prisma.user.create({
    data: {
      email,
      password_hash,
      first_name,
      last_name,
      role_id,
      active,
    },
  });
}

module.exports = {
  getAdminDevices,
  findUserByEmail,
  createAdminUser,
};

