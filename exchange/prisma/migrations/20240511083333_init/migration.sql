/*
  Warnings:

  - You are about to drop the column `trading_close` on the `StockPrice` table. All the data in the column will be lost.
  - You are about to drop the column `trading_open` on the `StockPrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "filled_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockPrice" DROP COLUMN "trading_close",
DROP COLUMN "trading_open";
