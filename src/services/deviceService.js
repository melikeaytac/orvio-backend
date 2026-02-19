const prisma = require('../config/database');

async function getAdminDevices(adminUserId, isSystemAdmin) {
  if (isSystemAdmin) {
    // System admin ise kısıtlama olmadan tüm cihazları getir
    return prisma.cooler.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Normal admin ise sadece atanmış olanları getir
  const assignments = await prisma.deviceAssignment.findMany({
    where: {
      admin_user_id: adminUserId,
      is_active: true,
    },
    include: { device: true },
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

async function getDeviceTelemetry(deviceId, limit = 100) {
  return prisma.telemetry.findMany({
    where: { device_id: deviceId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

async function getDeviceAlerts(deviceId, status_id = null) {
  const where = { device_id: deviceId };
  if (status_id !== null) {
    where.status_id = status_id;
  }
  
  return prisma.alert.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });
}

module.exports = {
  getAdminDevices,
  getDeviceInventory,
  getDeviceTransactions,
  getDeviceTelemetry,
  getDeviceAlerts,
};
