CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SYSTEM_ADMIN');


ALTER TABLE "User" 
ALTER COLUMN "role_id" TYPE "UserRole" 
USING ("role_id"::"UserRole");


ALTER TABLE "User" ALTER COLUMN "role_id" SET DEFAULT 'ADMIN';