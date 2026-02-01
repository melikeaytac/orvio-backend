const prisma = require('../config/database');
const { hashPassword } = require('../utils/bcrypt');
const { v4: uuidv4 } = require('uuid');

async function getAllAdmins() {
  return prisma.user.findMany({
    where: {
      role_id: { in: ['ADMIN', 'SYSTEM_ADMIN'] },
    },
    orderBy: { email: 'asc' },
  });
}

async function createAdmin(adminData) {
  const passwordHash = await hashPassword(adminData.password);
  
  return prisma.user.create({
    data: {
      user_id: uuidv4(),
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      email: adminData.email,
      password_hash: passwordHash,
      role_id: adminData.role_id || 'ADMIN',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

async function updateAdmin(adminId, adminData) {
  const updateData = {
    updated_at: new Date(),
  };
  
  if (adminData.first_name !== undefined) updateData.first_name = adminData.first_name;
  if (adminData.last_name !== undefined) updateData.last_name = adminData.last_name;
  if (adminData.email !== undefined) updateData.email = adminData.email;
  if (adminData.role_id !== undefined) updateData.role_id = adminData.role_id;
  if (adminData.active !== undefined) updateData.active = adminData.active;
  
  if (adminData.password) {
    updateData.password_hash = await hashPassword(adminData.password);
  }
  
  return prisma.user.update({
    where: { user_id: adminId },
    data: updateData,
  });
}


module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
};

