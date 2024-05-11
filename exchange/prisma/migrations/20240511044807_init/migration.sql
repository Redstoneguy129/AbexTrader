/*
  Warnings:

  - You are about to drop the column `stock_symbol` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `Ownership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock_symbol` on the `Ownership` table. All the data in the column will be lost.
  - You are about to drop the column `high_price` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `low_price` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `symbol` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Ownership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trading_close` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trading_open` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_stock_symbol_fkey";

-- DropForeignKey
ALTER TABLE "Ownership" DROP CONSTRAINT "Ownership_stock_symbol_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stock_symbol",
ADD COLUMN     "symbol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ownership" DROP CONSTRAINT "Ownership_pkey",
DROP COLUMN "stock_symbol",
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD CONSTRAINT "Ownership_pkey" PRIMARY KEY ("trader_id", "symbol");

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "high_price",
DROP COLUMN "low_price",
ADD COLUMN     "trading_close" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "trading_open" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "StockPrice" (
    "id" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trading_high" DOUBLE PRECISION NOT NULL,
    "trading_low" DOUBLE PRECISION NOT NULL,
    "trading_open" DOUBLE PRECISION NOT NULL,
    "trading_close" DOUBLE PRECISION NOT NULL,
    "probable_high" DOUBLE PRECISION NOT NULL,
    "probable_low" DOUBLE PRECISION NOT NULL,
    "pivot" DOUBLE PRECISION NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "StockPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockPrice" ADD CONSTRAINT "StockPrice_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
