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

async function getDeviceInventory(req, res, next) {
  try {
    const { device_id } = req.params;
    const inventory = await adminService.getDeviceInventory(device_id);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
}

async function getDeviceTransactions(req, res, next) {
  try {
    const { device_id } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const transactions = await adminService.getDeviceTransactions(device_id, limit);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function getTransaction(req, res, next) {
  try {
    const { transaction_id } = req.params;
    const transaction = await adminService.getTransactionDetails(transaction_id);
    
    if (!transaction) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found',
      });
    }
    
    res.json(transaction);
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

async function getDisputedTransactions(req, res, next) {
  try {
    const disputes = await adminService.getDisputedTransactions();
    res.json(disputes);
  } catch (error) {
    next(error);
  }
}

async function getBrands(req, res, next) {
  try {
    const brands = await require('../services/sysadminService').getAllBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await require('../services/sysadminService').getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'email and password are required',
      });
    }
    // Check if user already exists
    const existing = await adminService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already registered',
      });
    }
    const password_hash = await hashPassword(password);
    const user = await adminService.createAdminUser({
      email,
      password_hash,
      first_name,
      last_name,
      role_id: 'ADMIN',
      active: true,
    });
    res.status(201).json({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role_id,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register,
  getDevices,
  getDeviceInventory,
  getDeviceTransactions,
  getTransaction,
  getDeviceTelemetry,
  getDeviceAlerts,
  updateAlert,
  getDisputedTransactions,
  getBrands,
  getProducts,
};

