-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "role_id" TEXT,
    "active" BOOLEAN,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "brand_id" TEXT NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brand_id" TEXT NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "image_reference" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Cooler" (
    "device_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location_description" VARCHAR(255),
    "gps_latitude" DECIMAL(10,8),
    "gps_longitude" DECIMAL(10,8),
    "default_temperature" DECIMAL(2,2),
    "status" TEXT NOT NULL,
    "last_checkin_time" TIMESTAMP(3) NOT NULL,
    "assigned_admin_id" TEXT,
    "door_status" BOOLEAN NOT NULL,
    "shelf_count" INTEGER NOT NULL,
    "session_limit" INTEGER NOT NULL,

    CONSTRAINT "Cooler_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "device_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "critic_stock" INTEGER NOT NULL,
    "last_stock_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("device_id","product_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT,
    "device_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "transaction_type" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "transaction_item_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "unit_price_at_sale" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("transaction_item_id")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "telemetry_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "internal_temperature" DECIMAL(5,2) NOT NULL,
    "gps_latitude" DECIMAL(10,8),
    "gps_longitude" DECIMAL(10,8),
    "door_sensor_status" BOOLEAN NOT NULL,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("telemetry_id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "alert_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "alert_type" TEXT NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("alert_id")
);

-- CreateTable
CREATE TABLE "ProductBrand" (
    "product_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "ProductBrand_pkey" PRIMARY KEY ("product_id","brand_id")
);

-- CreateTable
CREATE TABLE "DeviceAssignment" (
    "assignment_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL,
    "unassigned_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "DeviceAssignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "log_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "log_date" TIMESTAMPTZ NOT NULL,
    "relational_id" TEXT,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brand_name_key" ON "Brand"("brand_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooler" ADD CONSTRAINT "Cooler_assigned_admin_id_fkey" FOREIGN KEY ("assigned_admin_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrand" ADD CONSTRAINT "ProductBrand_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrand" ADD CONSTRAINT "ProductBrand_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAssignment" ADD CONSTRAINT "DeviceAssignment_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAssignment" ADD CONSTRAINT "DeviceAssignment_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
