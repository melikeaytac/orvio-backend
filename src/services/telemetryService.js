const prisma = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../config/constants');

async function recordTelemetry(deviceId, telemetryData) {
  if (telemetryData.internal_temperature == null) {
    throw new Error('internal_temperature is required');
  }

  if (telemetryData.door_sensor_status == null) {
    throw new Error('door_sensor_status is required');
  }

  const now = new Date();

  const telemetry = await prisma.telemetry.create({
    data: {
      device_id: deviceId,
      timestamp: now,
      internal_temperature: telemetryData.internal_temperature,
      gps_latitude: telemetryData.gps_latitude ?? null,
      gps_longitude: telemetryData.gps_longitude ?? null,
      door_sensor_status: telemetryData.door_sensor_status,
    },
  });

  await prisma.cooler.update({
    where: { device_id: deviceId },
    data: {
      last_checkin_time: now,
      door_status: telemetryData.door_sensor_status,
    },
  });

  return {
    telemetry_id: telemetry.telemetry_id,
    device_id: telemetry.device_id,
    timestamp: telemetry.timestamp,
  };
}



async function evaluateTelemetry(telemetryId) {
  const telemetry = await prisma.telemetry.findUnique({
    where: { telemetry_id: telemetryId },
    include: { device: true },
  });
  
  if (!telemetry) {
    throw new Error('Telemetry not found');
  }
  
  const alerts = [];
  
  // Check temperature
  if (telemetry.device.default_temperature) {
    const tempDiff = Math.abs(
      parseFloat(telemetry.internal_temperature) - 
      parseFloat(telemetry.device.default_temperature)
    );
    
    if (tempDiff > 2.0) {
      const alert = await prisma.alert.create({
        data: {
          alert_id: uuidv4(),
          device_id: telemetry.device_id,
          timestamp: new Date(),
          alert_type: 'TEMPERATURE_DEVIATION',
          message: `Temperature deviation detected: ${telemetry.internal_temperature}°C (expected: ${telemetry.device.default_temperature}°C)`,
          status: CONSTANTS.ALERT_STATUS.OPEN,
        },
      });
      alerts.push(alert);
    }
  }
  
  // Check GPS location (if device moved significantly)
  if (telemetry.gps_latitude && telemetry.gps_longitude &&
      telemetry.device.gps_latitude && telemetry.device.gps_longitude) {
    const latDiff = Math.abs(
      parseFloat(telemetry.gps_latitude) - 
      parseFloat(telemetry.device.gps_latitude)
    );
    const lonDiff = Math.abs(
      parseFloat(telemetry.gps_longitude) - 
      parseFloat(telemetry.device.gps_longitude)
    );
    
    // Rough check - in production, use proper distance calculation
    if (latDiff > 0.001 || lonDiff > 0.001) {
      const alert = await prisma.alert.create({
        data: {
          alert_id: uuidv4(),
          device_id: telemetry.device_id,
          timestamp: new Date(),
          alert_type: 'LOCATION_CHANGE',
          message: `Device location changed significantly`,
          status: CONSTANTS.ALERT_STATUS.OPEN,
        },
      });
      alerts.push(alert);
    }
  }
  
  // Log evaluation
  await prisma.systemLog.create({
    data: {
      log_id: uuidv4(),
      title: 'Telemetry Evaluated',
      message: `Telemetry ${telemetryId} evaluated, ${alerts.length} alerts created`,
      level: alerts.length > 0 ? 'WARN' : 'INFO',
      log_date: new Date(),
      relational_id: telemetryId,
    },
  });
  
  return {
    telemetry_id: telemetryId,
    alerts_created: alerts.length,
    alerts,
  };
}

module.exports = {
  recordTelemetry,
  evaluateTelemetry,
};

