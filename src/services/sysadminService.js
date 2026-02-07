const prisma = require('../config/database');
const { hashPassword } = require('../utils/bcrypt');
const { v4: uuidv4 } = require('uuid');
const { USER_ROLE } = require('../config/constants');

async function getAllAdmins() {
  return prisma.user.findMany({
    where: {
      role_id: { in: [USER_ROLE.ADMIN, USER_ROLE.SYSTEM_ADMIN] },
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
      role_id: adminData.role_id || USER_ROLE.ADMIN,
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

async function getAllDevices() {
  return prisma.cooler.findMany({
    include: {
      assignedAdmin: true,
    },
    orderBy: { name: 'asc' },
  });
}

async function createDevice(deviceData) {
  return prisma.cooler.create({
    data: {
      device_id: uuidv4(),
      name: deviceData.name,
      location_description: deviceData.location_description,
      gps_latitude: deviceData.gps_latitude,
      gps_longitude: deviceData.gps_longitude,
      default_temperature: deviceData.default_temperature,
      status: deviceData.status || 'ACTIVE',
      last_checkin_time: new Date(),
      assigned_admin_id: deviceData.assigned_admin_id,
      door_status: false,
      shelf_count: deviceData.shelf_count || 1,
      session_limit: deviceData.session_limit || 1,
    },
  });
}

async function updateDevice(deviceId, deviceData) {
  const updateData = {};
  
  if (deviceData.name !== undefined) updateData.name = deviceData.name;
  if (deviceData.location_description !== undefined) updateData.location_description = deviceData.location_description;
  if (deviceData.gps_latitude !== undefined) updateData.gps_latitude = deviceData.gps_latitude;
  if (deviceData.gps_longitude !== undefined) updateData.gps_longitude = deviceData.gps_longitude;
  if (deviceData.default_temperature !== undefined) updateData.default_temperature = deviceData.default_temperature;
  if (deviceData.status !== undefined) updateData.status = deviceData.status;
  if (deviceData.assigned_admin_id !== undefined) updateData.assigned_admin_id = deviceData.assigned_admin_id;
  if (deviceData.shelf_count !== undefined) updateData.shelf_count = deviceData.shelf_count;
  if (deviceData.session_limit !== undefined) updateData.session_limit = deviceData.session_limit;
  
  return prisma.cooler.update({
    where: { device_id: deviceId },
    data: updateData,
  });
}



module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  getAllDevices,
  createDevice,
  updateDevice,
};

