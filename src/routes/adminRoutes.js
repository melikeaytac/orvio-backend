const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const deviceAccess = require('../middleware/deviceAccess');


// All routes below require admin authentication

/**
 * @swagger
 * /admin/devices/{device_id}/telemetry:
 *   get:
 *     summary: Get recent telemetry for a device
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Telemetry records
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               telemetry:
 *                 - telemetry_id: "tele-0001"
 *                   temperature: 4.5
 *                   humidity: 60
 *                   door_status: false
 */
// GET /admin/devices/:device_id/telemetry
//router.get('/devices/:device_id/telemetry', deviceAccess, adminController.getDeviceTelemetry);
router.get(
  '/devices/:device_id/telemetry',
  adminAuth,        
  deviceAccess,     
  adminController.getDeviceTelemetry
);


/**
 * @swagger
 * /admin/devices/{device_id}/alerts:
 *   get:
 *     summary: Get alerts for a device
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Alerts for the device
 *         content:
 *           application/json:
 *             example:
 *               device_id: "dev-0001"
 *               alerts:
 *                 - alert_id: "alert-0001"
 *                   type: "temperature_high"
 *                   status: "OPEN"
 */
// GET /admin/devices/:device_id/alerts
router.get('/devices/:device_id/alerts', adminAuth, deviceAccess, adminController.getDeviceAlerts);

/**
 * @swagger
 * /admin/alerts/{alert_id}:
 *   patch:
 *     summary: Update an alert
 *     tags: [Telemetry]
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: path
 *         name: alert_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the alert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "resolved"
 *             note: "Checked device, temperature back to normal."
 *     responses:
 *       200:
 *         description: Updated alert
 *         content:
 *           application/json:
 *             example:
 *               alert_id: "alert-0001"
 *               status: "RESOLVED"
 */
// PATCH /admin/alerts/:alert_id
router.patch('/alerts/:alert_id', adminAuth, adminController.updateAlert);


module.exports = router;

