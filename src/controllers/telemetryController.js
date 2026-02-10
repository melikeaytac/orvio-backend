const telemetryService = require('../services/telemetryService');

async function recordTelemetry(req, res, next) {
  try {
    const { device_id } = req.params;
    const telemetryData = req.body;

    const result = await telemetryService.recordTelemetry(device_id, {
      ...telemetryData,
      timestamp: new Date(), // ✅ SERVER TIME
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}


async function evaluateTelemetry(req, res, next) {
  try {
    const { telemetry_id } = req.params;
    const result = await telemetryService.evaluateTelemetry(telemetry_id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Telemetry not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = {
  recordTelemetry,
  evaluateTelemetry,
};
