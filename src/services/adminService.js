const prisma = require('../config/database');

async function getAdminDevices(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System admin sees all devices
    return prisma.cooler.findMany({
      orderBy: { name: 'asc' },
    });
  }
  
  // Regular admin sees only assigned devices
  const assignments = await prisma.deviceAssignment.findMany({
    where: {
      admin_user_id: adminUserId,
      is_active: true,
    },
    include: {
      device: true,
    },
  });
  
  return assignments.map(a => a.device);
}

async function getDeviceInventory(deviceId) {
  const inventory = await prisma.inventory.findMany({
    where: { device_id: deviceId },
    include: {
      product: {
        include: {
          brand: true,
        },
      },
    },
  });
  
  return inventory.map(inv => ({
    product_id: inv.product_id,
    product_name: inv.product.name,
    brand_name: inv.product.brand.brand_name,
    current_stock: inv.current_stock,
    critic_stock: inv.critic_stock,
    last_stock_update: inv.last_stock_update,
  }));
}

async function getDeviceTransactions(deviceId, limit = 100) {
  return prisma.transaction.findMany({
    where: { device_id: deviceId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { start_time: 'desc' },
    take: limit,
  });
}

async function getTransactionDetails(transactionId) {
  return prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      },
      device: true,
      user: true,
    },
  });
}

async function getDeviceTelemetry(deviceId, limit = 100) {
  return prisma.telemetry.findMany({
    where: { device_id: deviceId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

async function getDeviceAlerts(deviceId, status = null) {
  const where = { device_id: deviceId };
  if (status) {
    where.status = status;
  }
  
  return prisma.alert.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });
}

async function updateAlert(alertId, status, message) {
  const updateData = {};
  if (status) updateData.status = status;
  if (message) updateData.message = message;
  
  return prisma.alert.update({
    where: { alert_id: alertId },
    data: updateData,
  });
}

async function getDisputedTransactions() {
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
  getDeviceInventory,
  getDeviceTransactions,
  getTransactionDetails,
  getDeviceTelemetry,
  getDeviceAlerts,
  updateAlert,
  getDisputedTransactions,
  findUserByEmail,
  createAdminUser,
};

