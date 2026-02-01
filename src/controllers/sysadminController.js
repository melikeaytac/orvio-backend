const sysadminService = require('../services/sysadminService');

// Admin management
async function getAllAdmins(req, res, next) {
  try {
    const admins = await sysadminService.getAllAdmins();
    res.json(admins);
  } catch (error) {
    next(error);
  }
}

async function createAdmin(req, res, next) {
  try {
    const { first_name, last_name, email, password, role_id } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'email and password are required',
      });
    }
    
    const admin = await sysadminService.createAdmin({
      first_name,
      last_name,
      email,
      password,
      role_id: role_id || 'ADMIN',
    });
    
    res.status(201).json(admin);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already exists',
      });
    }
    next(error);
  }
}

async function updateAdmin(req, res, next) {
  try {
    const { admin_id } = req.params;
    const admin = await sysadminService.updateAdmin(admin_id, req.body);
    res.json(admin);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Admin not found',
      });
    }
    next(error);
  }
}

// Device management
async function getAllDevices(req, res, next) {
  try {
    const devices = await sysadminService.getAllDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
}

async function createDevice(req, res, next) {
  try {
    const device = await sysadminService.createDevice(req.body);
    res.status(201).json(device);
  } catch (error) {
    next(error);
  }
}

async function updateDevice(req, res, next) {
  try {
    const { device_id } = req.params;
    const device = await sysadminService.updateDevice(device_id, req.body);
    res.json(device);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
    }
    next(error);
  }
}


module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  getAllDevices,
  createDevice,
  updateDevice,
};

