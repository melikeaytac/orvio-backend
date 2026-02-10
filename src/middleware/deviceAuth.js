const prisma = require('../config/database');

async function deviceAuthMiddleware(req, res, next) {
  const deviceToken = req.headers['x-device-token'];
  
  if (!deviceToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'X-Device-Token header required',
    });
  }
  
  // In production, verify device token against database or secret store
  // For now, we'll validate the device exists and token matches
  // This is a simplified implementation - in production, use proper token validation
  
  const deviceId = req.params.device_id || req.body.device_id;
  
  if (deviceId) {
    const device = await prisma.cooler.findUnique({
      where: { device_id: deviceId },
    });
    
    if (!device) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Device not found',
      });
    }
    
    // Store device in request for use in controllers
    req.device = device;
  }
  
  next();
}

module.exports = deviceAuthMiddleware;

