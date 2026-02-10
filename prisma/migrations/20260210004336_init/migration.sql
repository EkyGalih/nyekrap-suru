-- CreateTable
CREATE TABLE "ScrapeCache" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "scrapedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ScrapeCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapeCache_cacheKey_key" ON "ScrapeCache"("cacheKey");

-- CreateIndex
CREATE INDEX "ScrapeCache_endpoint_idx" ON "ScrapeCache"("endpoint");
