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


module.exports = {
  getAdminDevices,
  findUserByEmail,
  createAdminUser,
  getDeviceTelemetry,
  getDeviceAlerts,
  updateAlert,
};

