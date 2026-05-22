-- CreateTable
CREATE TABLE "api_key" (
    "api_key_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key_hash" VARCHAR(64) NOT NULL,
    "key_prefix" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("api_key_id"),
    CONSTRAINT "api_key_key_hash_key" UNIQUE ("key_hash")
);

-- CreateIndex
CREATE INDEX "api_key_user_id_idx" ON "api_key"("user_id");
CREATE INDEX "api_key_key_hash_idx" ON "api_key"("key_hash");
