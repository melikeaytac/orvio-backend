const deviceService = require('../services/deviceService');

async function getDevices(req, res, next) {
  try {
    // adminAuth middleware'inden gelen req.adminUser ve req.isSystemAdmin'i kullanıyoruz
    const devices = await deviceService.getAdminDevices(
      req.adminUser.user_id, 
      req.isSystemAdmin
    );
    res.json(devices);
  } catch (error) {
    next(error);
  }
}

async function getDeviceInventory(req, res, next) {
  try {
    const { device_id } = req.params;
    const inventory = await deviceService.getDeviceInventory(device_id);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTransactions(req, res, next) {
  try {
    const { device_id } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const transactions = await deviceService.getDeviceTransactions(device_id, limit);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTelemetry(req, res, next) {
  try {
    const { device_id } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const telemetry = await deviceService.getDeviceTelemetry(device_id, limit);
    res.json(telemetry);
  } catch (error) {
    next(error);
  }
}

async function getDeviceAlerts(req, res, next) {
  try {
    const { device_id } = req.params;
    const status_id = req.query.status_id ? parseInt(req.query.status_id) : null;
    const alerts = await deviceService.getDeviceAlerts(device_id, status_id);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDevices,
  getDeviceInventory,
  getDeviceTransactions,
  getDeviceTelemetry,
  getDeviceAlerts,
};
