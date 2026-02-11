// QR decoder utility
// In production, this would decode the QR data to extract device_id
// For now, we'll assume the QR data contains the device_id directly or in a simple format

function decodeQR(qrData) {
  // Simple implementation - in production, this would decode the actual QR format
  // For now, we'll assume qrData might be:
  // - A UUID directly
  // - A base64 encoded JSON with device_id
  // - A URL with device_id as a parameter
  
  try {
    // Try parsing as JSON (base64 decoded)
    const decoded = Buffer.from(qrData, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed.device_id) {
      return parsed.device_id;
    }
  } catch (e) {
    // Not base64 JSON, continue
  }
  
  // Try as direct UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(qrData)) {
    return qrData;
  }
  
  // Try extracting from URL
  const urlMatch = qrData.match(/device[_-]?id[=:]([0-9a-f-]+)/i);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  return null;
}

module.exports = {
  decodeQR,
};

