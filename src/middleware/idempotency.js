const prisma = require('../config/database');

// Store for in-memory idempotency check (in production, use Redis or database)
const processedEvents = new Set();

async function checkIdempotency(eventId, eventType = 'generic') {
  const key = `${eventType}:${eventId}`;
  
  // Check in-memory cache first
  if (processedEvents.has(key)) {
    return true; // Already processed
  }
  
  // Check database for telemetry events
  if (eventType === 'telemetry') {
    const existing = await prisma.telemetry.findUnique({
      where: { telemetry_id: eventId },
    });
    if (existing) {
      processedEvents.add(key);
      return true;
    }
  }
  
  // Check database for transaction item events using SystemLog
  if (eventType === 'transaction_item') {
    const existing = await prisma.systemLog.findFirst({
      where: {
        title: 'ProductInteractionEvent',
        relational_id: eventId,
      },
    });
    if (existing) {
      processedEvents.add(key);
      return true;
    }
  }
  
  // Check for confirm events
  if (eventType === 'confirm') {
    const existing = await prisma.transaction.findUnique({
      where: { transaction_id: eventId },
    });
    if (existing && existing.status === 'COMPLETED') {
      processedEvents.add(key);
      return true;
    }
  }
  
  return false;
}

async function markAsProcessed(eventId, eventType = 'generic') {
  const key = `${eventType}:${eventId}`;
  processedEvents.add(key);
}

function idempotencyMiddleware(eventType) {
  return async (req, res, next) => {
    const eventId = req.body.event_id || req.body.telemetry_id;
    
    if (!eventId) {
      return next(); // No idempotency check needed
    }
    
    const isDuplicate = await checkIdempotency(eventId, eventType);
    
    if (isDuplicate) {
      return res.status(200).json({
        message: 'Event already processed',
        duplicate: true,
      });
    }
    
    req.eventId = eventId;
    req.eventType = eventType;
    next();
  };
}

module.exports = {
  idempotencyMiddleware,
  checkIdempotency,
  markAsProcessed,
};

