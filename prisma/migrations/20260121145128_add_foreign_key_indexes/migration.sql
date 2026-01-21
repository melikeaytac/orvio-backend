-- CreateIndex
CREATE INDEX "Alert_device_id_idx" ON "Alert"("device_id");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Cooler_assigned_admin_id_idx" ON "Cooler"("assigned_admin_id");

-- CreateIndex
CREATE INDEX "DeviceAssignment_device_id_idx" ON "DeviceAssignment"("device_id");

-- CreateIndex
CREATE INDEX "DeviceAssignment_admin_user_id_idx" ON "DeviceAssignment"("admin_user_id");

-- CreateIndex
CREATE INDEX "Inventory_product_id_idx" ON "Inventory"("product_id");

-- CreateIndex
CREATE INDEX "Product_brand_id_idx" ON "Product"("brand_id");

-- CreateIndex
CREATE INDEX "ProductBrand_brand_id_idx" ON "ProductBrand"("brand_id");

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_log_date_idx" ON "SystemLog"("log_date");

-- CreateIndex
CREATE INDEX "Telemetry_device_id_idx" ON "Telemetry"("device_id");

-- CreateIndex
CREATE INDEX "Telemetry_timestamp_idx" ON "Telemetry"("timestamp");

-- CreateIndex
CREATE INDEX "Transaction_user_id_idx" ON "Transaction"("user_id");

-- CreateIndex
CREATE INDEX "Transaction_device_id_idx" ON "Transaction"("device_id");

-- CreateIndex
CREATE INDEX "TransactionItem_transaction_id_idx" ON "TransactionItem"("transaction_id");

-- CreateIndex
CREATE INDEX "TransactionItem_product_id_idx" ON "TransactionItem"("product_id");
