const prisma = require('../config/database');
const { generateSessionInitToken } = require('../utils/jwt');
const { decodeQR } = require('../utils/qr');
const CONSTANTS = require('../config/constants');

async function processQR(qrData) {
  const deviceId = decodeQR(qrData);
  
  if (!deviceId) {
    throw new Error('Invalid QR data');
  }
  
  const device = await prisma.cooler.findUnique({
    where: { device_id: deviceId },
  });
  
  if (!device) {
    return {
      device_id: null,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.DEVICE_INACTIVE,
    };
  }
  
  // Check device status
  if (device.status !== CONSTANTS.DEVICE_STATUS.ACTIVE) {
    return {
      device_id: deviceId,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.DEVICE_INACTIVE,
    };
  }
  
  // Check if device is offline (stale checkin)
  const now = new Date();
  const checkinAge = (now - device.last_checkin_time) / 1000 / 60; // minutes
  if (checkinAge > CONSTANTS.DEVICE_OFFLINE_THRESHOLD_MINUTES) {
    return {
      device_id: deviceId,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.DEVICE_OFFLINE,
    };
  }
  
  // Check if door is already open
  if (device.door_status === true) {
    return {
      device_id: deviceId,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.DOOR_ALREADY_OPEN,
    };
  }
  
  // Check for active session
  const activeTransaction = await prisma.transaction.findFirst({
    where: {
      device_id: deviceId,
      is_active: true,
      status: CONSTANTS.TRANSACTION_STATUS.ACTIVE,
    },
  });
  
  if (activeTransaction) {
    return {
      device_id: deviceId,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.ACTIVE_SESSION_EXISTS,
    };
  }
  
  // Check session limit (simplified - count active sessions)
  const activeSessionsCount = await prisma.transaction.count({
    where: {
      device_id: deviceId,
      is_active: true,
    },
  });
  
  if (activeSessionsCount >= device.session_limit) {
    return {
      device_id: deviceId,
      access_granted: false,
      reason: CONSTANTS.ACCESS_REASON.SESSION_LIMIT_REACHED,
    };
  }
  
  // Generate session init token
  const sessionInitToken = generateSessionInitToken(deviceId);
  
  return {
    device_id: deviceId,
    access_granted: true,
    reason: CONSTANTS.ACCESS_REASON.OK,
    session_init_token: sessionInitToken,
    expires_in_seconds: CONSTANTS.SESSION_INIT_TOKEN_EXPIRY_SECONDS,
  };
}

module.exports = {
  processQR,
};

