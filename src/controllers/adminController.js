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


module.exports = {
  login,
  getDevices,
};

