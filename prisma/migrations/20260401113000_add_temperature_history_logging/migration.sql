-- CreateTable
CREATE TABLE "TemperatureHistory" (
    "temperature_history_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "internal_temperature" DECIMAL(5,2) NOT NULL,
    "source_telemetry_id" TEXT,

    CONSTRAINT "TemperatureHistory_pkey" PRIMARY KEY ("temperature_history_id")
);

-- CreateIndex
CREATE INDEX "TemperatureHistory_device_id_idx" ON "TemperatureHistory"("device_id");

-- CreateIndex
CREATE INDEX "TemperatureHistory_timestamp_idx" ON "TemperatureHistory"("timestamp");

-- CreateIndex
CREATE INDEX "TemperatureHistory_source_telemetry_id_idx" ON "TemperatureHistory"("source_telemetry_id");

-- AddForeignKey
ALTER TABLE "TemperatureHistory" ADD CONSTRAINT "TemperatureHistory_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Cooler"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemperatureHistory" ADD CONSTRAINT "TemperatureHistory_source_telemetry_id_fkey" FOREIGN KEY ("source_telemetry_id") REFERENCES "Telemetry"("telemetry_id") ON DELETE SET NULL ON UPDATE CASCADE;
