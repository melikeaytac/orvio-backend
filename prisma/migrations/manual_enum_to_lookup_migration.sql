-- ========================================
-- MANUAL MIGRATION: Enum to Lookup Tables
-- ========================================
-- This migration converts enums and string-based status fields 
-- to numeric lookup tables with FIXED integer IDs.
--
-- CRITICAL: This is a MANUAL migration that must be run carefully.
-- Test on a staging environment first!
-- ========================================

BEGIN;

-- ========================================
-- STEP 1: Create Lookup Tables
-- ========================================

CREATE TABLE "UserRoleLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "UserRoleLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserRoleLookup_name_key" ON "UserRoleLookup"("name");

CREATE TABLE "DeviceStatusLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "DeviceStatusLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeviceStatusLookup_name_key" ON "DeviceStatusLookup"("name");

CREATE TABLE "AlertStatusLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "AlertStatusLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AlertStatusLookup_name_key" ON "AlertStatusLookup"("name");

CREATE TABLE "TransactionStatusLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "TransactionStatusLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TransactionStatusLookup_name_key" ON "TransactionStatusLookup"("name");

CREATE TABLE "ActionTypeLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "ActionTypeLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ActionTypeLookup_name_key" ON "ActionTypeLookup"("name");

CREATE TABLE "AccessReasonLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "AccessReasonLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AccessReasonLookup_name_key" ON "AccessReasonLookup"("name");

CREATE TABLE "DisputeReasonLookup" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "DisputeReasonLookup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DisputeReasonLookup_name_key" ON "DisputeReasonLookup"("name");

-- ========================================
-- STEP 2: Insert Seed Data with Fixed IDs
-- ========================================

-- UserRoleLookup
INSERT INTO "UserRoleLookup" ("id", "name") VALUES
    (0, 'ADMIN'),
    (1, 'SYSTEM_ADMIN');

-- DeviceStatusLookup
INSERT INTO "DeviceStatusLookup" ("id", "name") VALUES
    (0, 'ACTIVE'),
    (1, 'INACTIVE'),
    (2, 'OFFLINE');

-- AlertStatusLookup
INSERT INTO "AlertStatusLookup" ("id", "name") VALUES
    (0, 'OPEN'),
    (1, 'RESOLVED'),
    (2, 'ACKNOWLEDGED');

-- TransactionStatusLookup
INSERT INTO "TransactionStatusLookup" ("id", "name") VALUES
    (0, 'ACTIVE'),
    (1, 'AWAITING_USER_CONFIRMATION'),
    (2, 'COMPLETED'),
    (3, 'DISPUTED'),
    (4, 'CANCELLED'),
    (5, 'FAILED');

-- ActionTypeLookup
INSERT INTO "ActionTypeLookup" ("id", "name") VALUES
    (0, 'ADD'),
    (1, 'REMOVE');

-- AccessReasonLookup
INSERT INTO "AccessReasonLookup" ("id", "name") VALUES
    (0, 'OK'),
    (1, 'DEVICE_OFFLINE'),
    (2, 'DEVICE_INACTIVE'),
    (3, 'SESSION_LIMIT_REACHED'),
    (4, 'DOOR_ALREADY_OPEN'),
    (5, 'ACTIVE_SESSION_EXISTS');

-- DisputeReasonLookup
INSERT INTO "DisputeReasonLookup" ("id", "name") VALUES
    (0, 'WRONG_ITEM'),
    (1, 'MISSING_ITEM'),
    (2, 'OTHER');

-- ========================================
-- STEP 3: Add New FK Columns (Nullable for now)
-- ========================================

-- User table: Add role_id_new column
ALTER TABLE "User" ADD COLUMN "role_id_new" INTEGER;

-- Cooler table: Add status_id column
ALTER TABLE "Cooler" ADD COLUMN "status_id" INTEGER;

-- Alert table: Add status_id column
ALTER TABLE "Alert" ADD COLUMN "status_id" INTEGER;

-- Transaction table: Add status_id column
ALTER TABLE "Transaction" ADD COLUMN "status_id" INTEGER;

-- TransactionItem table: Add action_type_id column
ALTER TABLE "TransactionItem" ADD COLUMN "action_type_id" INTEGER;

-- ========================================
-- STEP 4: Backfill Data
-- ========================================

-- User: Map role_id enum to role_id_new integer
UPDATE "User"
SET "role_id_new" = 
    CASE 
        WHEN "role_id"::text = 'ADMIN' THEN 0
        WHEN "role_id"::text = 'SYSTEM_ADMIN' THEN 1
        ELSE 0 -- Default to ADMIN
    END;

-- Cooler: Map status string to status_id integer
UPDATE "Cooler"
SET "status_id" = 
    CASE 
        WHEN "status" = 'ACTIVE' THEN 0
        WHEN "status" = 'INACTIVE' THEN 1
        WHEN "status" = 'OFFLINE' THEN 2
        ELSE 0 -- Default to ACTIVE
    END;

-- Alert: Map status string to status_id integer
UPDATE "Alert"
SET "status_id" = 
    CASE 
        WHEN "status" = 'OPEN' THEN 0
        WHEN "status" = 'RESOLVED' THEN 1
        WHEN "status" = 'ACKNOWLEDGED' THEN 2
        ELSE 0 -- Default to OPEN
    END;

-- Transaction: Map status string to status_id integer
UPDATE "Transaction"
SET "status_id" = 
    CASE 
        WHEN "status" = 'ACTIVE' THEN 0
        WHEN "status" = 'AWAITING_USER_CONFIRMATION' THEN 1
        WHEN "status" = 'COMPLETED' THEN 2
        WHEN "status" = 'DISPUTED' THEN 3
        WHEN "status" = 'CANCELLED' THEN 4
        WHEN "status" = 'FAILED' THEN 5
        ELSE 0 -- Default to ACTIVE
    END;

-- TransactionItem: Map action_type string to action_type_id integer
UPDATE "TransactionItem"
SET "action_type_id" = 
    CASE 
        WHEN "action_type" = 'ADD' THEN 0
        WHEN "action_type" = 'REMOVE' THEN 1
        ELSE 0 -- Default to ADD
    END;

-- ========================================
-- STEP 5: Drop Old Columns
-- ========================================

-- Drop old User.role_id enum column
ALTER TABLE "User" DROP COLUMN "role_id";

-- Drop old Cooler.status string column
ALTER TABLE "Cooler" DROP COLUMN "status";

-- Drop old Alert.status string column and its index
DROP INDEX IF EXISTS "Alert_status_idx";
ALTER TABLE "Alert" DROP COLUMN "status";

-- Drop old Transaction.status string column
ALTER TABLE "Transaction" DROP COLUMN "status";

-- Drop old TransactionItem.action_type string column
ALTER TABLE "TransactionItem" DROP COLUMN "action_type";

-- Drop the UserRole enum type
DROP TYPE IF EXISTS "UserRole";

-- ========================================
-- STEP 6: Rename New Columns
-- ========================================

-- Rename User.role_id_new to role_id
ALTER TABLE "User" RENAME COLUMN "role_id_new" TO "role_id";

-- ========================================
-- STEP 7: Add NOT NULL Constraints
-- ========================================

ALTER TABLE "User" ALTER COLUMN "role_id" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role_id" SET DEFAULT 0;

ALTER TABLE "Cooler" ALTER COLUMN "status_id" SET NOT NULL;

ALTER TABLE "Alert" ALTER COLUMN "status_id" SET NOT NULL;

ALTER TABLE "Transaction" ALTER COLUMN "status_id" SET NOT NULL;

ALTER TABLE "TransactionItem" ALTER COLUMN "action_type_id" SET NOT NULL;

-- ========================================
-- STEP 8: Add Foreign Key Constraints
-- ========================================

ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" 
    FOREIGN KEY ("role_id") REFERENCES "UserRoleLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Cooler" ADD CONSTRAINT "Cooler_status_id_fkey" 
    FOREIGN KEY ("status_id") REFERENCES "DeviceStatusLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_status_id_fkey" 
    FOREIGN KEY ("status_id") REFERENCES "AlertStatusLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_status_id_fkey" 
    FOREIGN KEY ("status_id") REFERENCES "TransactionStatusLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_action_type_id_fkey" 
    FOREIGN KEY ("action_type_id") REFERENCES "ActionTypeLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ========================================
-- STEP 9: Add Indexes on FK Columns
-- ========================================

CREATE INDEX "User_role_id_idx" ON "User"("role_id");

CREATE INDEX "Cooler_status_id_idx" ON "Cooler"("status_id");

CREATE INDEX "Alert_status_id_idx" ON "Alert"("status_id");

CREATE INDEX "Transaction_status_id_idx" ON "Transaction"("status_id");

CREATE INDEX "TransactionItem_action_type_id_idx" ON "TransactionItem"("action_type_id");

-- ========================================
-- COMMIT
-- ========================================

COMMIT;

-- ========================================
-- Post-Migration Verification Queries
-- ========================================
-- Run these queries after the migration to verify data integrity:
--
-- SELECT COUNT(*) FROM "User" WHERE "role_id" IS NULL;
-- SELECT COUNT(*) FROM "Cooler" WHERE "status_id" IS NULL;
-- SELECT COUNT(*) FROM "Alert" WHERE "status_id" IS NULL;
-- SELECT COUNT(*) FROM "Transaction" WHERE "status_id" IS NULL;
-- SELECT COUNT(*) FROM "TransactionItem" WHERE "action_type_id" IS NULL;
--
-- All counts should be 0.
-- ========================================
