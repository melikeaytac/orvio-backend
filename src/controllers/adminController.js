const adminService = require('../services/adminService');
const authService = require('../services/authService');
const { hashPassword } = require('../utils/bcrypt');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'email and password are required',
      });
    }
    
    const result = await authService.loginAdmin(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message === 'Access denied') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
    }
    next(error);
  }
}

async function getDevices(req, res, next) {
  try {
    const devices = await adminService.getAdminDevices(
      req.adminUser.user_id,
      req.isSystemAdmin
    );
    res.json(devices);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTelemetry(req, res, next) {
  try {
    const { device_id } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const telemetry = await adminService.getDeviceTelemetry(device_id, limit);
    res.json(telemetry);
  } catch (error) {
    next(error);
  }
}

async function getDeviceAlerts(req, res, next) {
  try {
    const { device_id } = req.params;
    const status = req.query.status || null;
    const alerts = await adminService.getDeviceAlerts(device_id, status);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
}

async function updateAlert(req, res, next) {
  try {
    const { alert_id } = req.params;
    const { status, message } = req.body;
    
    const alert = await adminService.updateAlert(alert_id, status, message);
    res.json(alert);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Alert not found',
      });
    }
    next(error);
  }
}

module.exports = {
  login,
  getDevices,
  getDeviceTelemetry,
  getDeviceAlerts,
  updateAlert,
};

