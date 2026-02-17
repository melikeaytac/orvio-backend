const prisma = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../config/constants');

async function getTransactionSummary(transactionId) {
  const transaction = await prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      },
      device: true,
    },
  });
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  if (transaction.status !== CONSTANTS.TRANSACTION_STATUS.AWAITING_USER_CONFIRMATION) {
    throw new Error('Transaction not awaiting confirmation');
  }
  
  // Aggregate items
  const itemMap = new Map();
  
  for (const item of transaction.items) {
    const productId = item.product_id;
    if (itemMap.has(productId)) {
      const existing = itemMap.get(productId);
      existing.quantity += item.quantity;
      existing.subtotal = existing.quantity * parseFloat(existing.unit_price);
    } else {
      itemMap.set(productId, {
        product_id: item.product_id,
        name: item.product.name,
        brand: item.product.brand.brand_name,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price_at_sale),
        subtotal: item.quantity * parseFloat(item.unit_price_at_sale),
      });
    }
  }
  
  const items = Array.from(itemMap.values());
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  return {
    transaction_id: transaction.transaction_id,
    device_id: transaction.device_id,
    device_name: transaction.device.name,
    status: transaction.status,
    start_time: transaction.start_time,
    end_time: transaction.end_time,
    items,
    total_price: totalPrice,
  };
}

async function confirmTransaction(transactionId, confirmedAt) {
  // Idempotency check
  const transaction = await prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  if (transaction.status === CONSTANTS.TRANSACTION_STATUS.COMPLETED) {
    // Already completed - return without re-applying inventory
    return {
      transaction_id: transaction.transaction_id,
      status: transaction.status,
      inventory_updated: false,
      alerts_created: 0,
      message: 'Transaction already completed',
    };
  }
  
  if (transaction.status !== CONSTANTS.TRANSACTION_STATUS.AWAITING_USER_CONFIRMATION) {
    throw new Error('Transaction not awaiting confirmation');
  }
  
  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Update transaction status
    const updated = await tx.transaction.update({
      where: { transaction_id: transactionId },
      data: {
        status: CONSTANTS.TRANSACTION_STATUS.COMPLETED,
      },
    });
    
    // Update inventory for each item
    let alertsCreated = 0;
    
    for (const item of transaction.items) {
      // Get current inventory
      const inventory = await tx.inventory.findUnique({
        where: {
          device_id_product_id: {
            device_id: transaction.device_id,
            product_id: item.product_id,
          },
        },
      });
      
      if (inventory) {
        const newStock = inventory.current_stock - item.quantity;
        
        await tx.inventory.update({
          where: {
            device_id_product_id: {
              device_id: transaction.device_id,
              product_id: item.product_id,
            },
          },
          data: {
            current_stock: Math.max(0, newStock),
            last_stock_update: new Date(),
          },
        });
        
        // Check if stock is below critical threshold
        if (newStock <= inventory.critic_stock) {
          await tx.alert.create({
            data: {
              alert_id: uuidv4(),
              device_id: transaction.device_id,
              timestamp: new Date(),
              alert_type: 'LOW_STOCK',
              message: `Product ${item.product.name} is below critical stock level`,
              status: CONSTANTS.ALERT_STATUS.OPEN,
            },
          });
          alertsCreated++;
        }
      }
    }
    
    // Log system event
    await tx.systemLog.create({
      data: {
        log_id: uuidv4(),
        title: 'Transaction Completed',
        message: `Transaction ${transactionId} confirmed and inventory updated`,
        level: 'INFO',
        log_date: new Date(),
        relational_id: transactionId,
      },
    });
    
    return { updated, alertsCreated };
  });
  
  return {
    transaction_id: transaction.transaction_id,
    status: CONSTANTS.TRANSACTION_STATUS.COMPLETED,
    inventory_updated: true,
    alerts_created: result.alertsCreated,
  };
}

async function disputeTransaction(transactionId, reason, message, reportedAt) {
  const transaction = await prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
  });
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  if (transaction.status !== CONSTANTS.TRANSACTION_STATUS.AWAITING_USER_CONFIRMATION) {
    throw new Error('Transaction not awaiting confirmation');
  }
  
  // Update transaction status
  const updated = await prisma.transaction.update({
    where: { transaction_id: transactionId },
    data: {
      status: CONSTANTS.TRANSACTION_STATUS.DISPUTED,
    },
  });
  
  // Log dispute
  await prisma.systemLog.create({
    data: {
      log_id: require('uuid').v4(),
      title: 'Transaction Disputed',
      message: `Transaction ${transactionId} disputed: ${reason} - ${message}`,
      level: 'WARN',
      log_date: new Date(reportedAt),
      relational_id: transactionId,
    },
  });
  
  return {
    transaction_id: updated.transaction_id,
    status: updated.status,
    reason,
    message,
  };
}

async function applyInventoryManually(transactionId) {
  // System admin only - manual recovery
  const transaction = await prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  if (transaction.status !== CONSTANTS.TRANSACTION_STATUS.AWAITING_USER_CONFIRMATION &&
      transaction.status !== CONSTANTS.TRANSACTION_STATUS.DISPUTED) {
    throw new Error('Transaction cannot have inventory applied');
  }
  
  // Apply inventory update
  const result = await prisma.$transaction(async (tx) => {
    let alertsCreated = 0;
    
    for (const item of transaction.items) {
      const inventory = await tx.inventory.findUnique({
        where: {
          device_id_product_id: {
            device_id: transaction.device_id,
            product_id: item.product_id,
          },
        },
      });
      
      if (inventory) {
        const newStock = inventory.current_stock - item.quantity;
        
        await tx.inventory.update({
          where: {
            device_id_product_id: {
              device_id: transaction.device_id,
              product_id: item.product_id,
            },
          },
          data: {
            current_stock: Math.max(0, newStock),
            last_stock_update: new Date(),
          },
        });
        
        if (newStock <= inventory.critic_stock) {
          await tx.alert.create({
            data: {
              alert_id: uuidv4(),
              device_id: transaction.device_id,
              timestamp: new Date(),
              alert_type: 'LOW_STOCK',
              message: `Product ${item.product.name} is below critical stock level`,
              status: CONSTANTS.ALERT_STATUS.OPEN,
            },
          });
          alertsCreated++;
        }
      }
    }
    
    // Update transaction status if it was disputed
    if (transaction.status === CONSTANTS.TRANSACTION_STATUS.DISPUTED) {
      await tx.transaction.update({
        where: { transaction_id: transactionId },
        data: {
          status: CONSTANTS.TRANSACTION_STATUS.COMPLETED,
        },
      });
    }
    
    return { alertsCreated };
  });
  
  return {
    transaction_id: transactionId,
    inventory_updated: true,
    alerts_created: result.alertsCreated,
  };
}

async function getTransactionDetails(transactionId, adminUserId, isSystemAdmin) {
  const transaction = await prisma.transaction.findUnique({
    where: { transaction_id: transactionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      },
      device: {
        include: {
          deviceAssignments: {
            where: { is_active: true },
          },
        },
      },
      user: true,
    },
  });

  if (!transaction) {
    return null;
  }

  // System admin değilse, sadece kendi cihazlarının transaction'larını görebilir
  if (!isSystemAdmin) {
    const hasAccess = transaction.device.deviceAssignments.some(
      (assignment) => assignment.admin_user_id === adminUserId
    );

    if (!hasAccess) {
      throw new Error('Access denied');
    }
  }

  return transaction;
}

module.exports = {
  getTransactionSummary,
  confirmTransaction,
  disputeTransaction,
  applyInventoryManually,
  getTransactionDetails,
};

