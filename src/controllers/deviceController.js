const deviceService = require('../services/deviceService');
const { parsePagination } = require('../utils/pagination');

async function getDevices(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await deviceService.getAdminDevices(
      req.adminUser.user_id, 
      req.isSystemAdmin,
      { page, limit }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getDeviceInventory(req, res, next) {
  try {
    const { device_id } = req.params;
    const { page, limit } = parsePagination(req.query);
    const result = await deviceService.getDeviceInventory(device_id, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTransactions(req, res, next) {
  try {
    const { device_id } = req.params;
    const { page, limit } = parsePagination(req.query);
    const result = await deviceService.getDeviceTransactions(device_id, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTelemetry(req, res, next) {
  try {
    const { device_id } = req.params;
    const { page, limit } = parsePagination(req.query);
    const result = await deviceService.getDeviceTelemetry(device_id, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getDeviceAlerts(req, res, next) {
  try {
    const { device_id } = req.params;
    const { page, limit } = parsePagination(req.query);
    const status_id = req.query.status_id ? parseInt(req.query.status_id) : null;
    const result = await deviceService.getDeviceAlerts(device_id, status_id, { page, limit });
    res.json(result);
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
