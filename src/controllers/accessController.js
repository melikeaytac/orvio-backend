const accessService = require('../services/accessService');

async function processQR(req, res, next) {
  try {
    // Accept both qr_data and qrCode for flexibility in testing
    const qr_data = req.body.qr_data || req.body.qrCode;
    if (!qr_data) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'qr_data is required',
      });
    }
    const result = await accessService.processQR(qr_data);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  processQR,
};

