const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const deviceAuth = require('../middleware/deviceAuth');
const { idempotencyMiddleware } = require('../middleware/idempotency');

/**
 * @swagger
 * /devices/{device_id}/telemetry:
 *   post:
 *     summary: Record telemetry data for a device
 *     tags: [Telemetry]
 *     security:
 *       - DeviceToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - internal_temperature
 *               - door_sensor_status
 *             properties:
 *               internal_temperature:
 *                 type: number
 *                 example: 4.2
 *               door_sensor_status:
 *                 type: boolean
 *                 example: false
 *               gps_latitude:
 *                 type: number
 *                 example: 38.4237
 *               gps_longitude:
 *                 type: number
 *                 example: 27.1428
 *     responses:
 *       201:
 *         description: Telemetry recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 telemetry_id:
 *                   type: string
 *                   example: "uuid-generated-id"
 *                 device_id:
 *                   type: string
 *                   example: "dev-0001"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// POST /devices/:device_id/telemetry idempotency ekle 
router.post(
  '/devices/:device_id/telemetry',
  deviceAuth,
  telemetryController.recordTelemetry
);

/**
 * @swagger
 * /devices/{device_id}/telemetry/{telemetry_id}/evaluate:
 *   post:
 *     summary: Evaluate a specific telemetry record for a device
 *     tags: [Telemetry]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *       - in: path
 *         name: telemetry_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the telemetry record
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           example:
 *             overrideThresholds: true
 *             temperatureThreshold: 8
 *             humidityThreshold: 70
 *     responses:
 *       200:
 *         description: Telemetry evaluation result
 *         content:
 *           application/json:
 *             example:
 *               telemetry_id: "tele123"
 *               status: "within_range"
 *               alertsGenerated: false
 */
// POST /devices/:device_id/telemetry/:telemetry_id/evaluate
router.post('/devices/:device_id/telemetry/:telemetry_id/evaluate', telemetryController.evaluateTelemetry);

module.exports = router;

