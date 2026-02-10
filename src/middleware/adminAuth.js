const prisma = require('../config/database');
const jwtAuthMiddleware = require('./jwtAuth');
const { USER_ROLE } = require('../config/constants');

async function adminAuthMiddleware(req, res, next) {
  // First verify JWT
  jwtAuthMiddleware(req, res, async () => {
   if (!req.user) {
  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Invalid or missing token',
  });
}

    
    // Check if user is admin or system admin
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.userId || req.user.user_id },
    });
    
    if (!user || !user.active) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User not active or not found',
      });
    }
    

    const isAdmin = user.role_id === USER_ROLE.ADMIN || user.role_id === USER_ROLE.SYSTEM_ADMIN;
    
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }
    
    req.adminUser = user;
    req.isSystemAdmin = user.role_id === USER_ROLE.SYSTEM_ADMIN;
    next();

  });
}

module.exports = adminAuthMiddleware;

