/*
  Warnings:

  - The values [TEACHER,PARENT,INTERNAL_DEVICE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `role` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "profile" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "role" "Role" NOT NULL;
