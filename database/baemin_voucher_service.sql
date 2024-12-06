DROP TABLE IF EXISTS "public"."voucher_usage";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS voucher_usage_id_seq

-- Table Definition
CREATE TABLE "public"."voucher_usage" (
    "id" int4 NOT NULL DEFAULT nextval('voucher_usage_id_seq'::regclass),
    "voucher_id" int4 NOT NULL,
    "vchru_discount_applied" float8 NOT NULL,
    "vchru_usage_date" timestamp NOT NULL,
    "order_id" int4 NOT NULL,
    "status" int4 NOT NULL,
    "user_id" int4 NOT NULL,
    CONSTRAINT "voucher_usage_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."voucher_user";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."voucher_user" (
    "voucher_id" int4 NOT NULL,
    "user_id" int4 NOT NULL,
    "expires_at" timestamp NOT NULL
);

DROP TABLE IF EXISTS "public"."vouchers";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS vouchers_id_seq

-- Table Definition
CREATE TABLE "public"."vouchers" (
    "id" int4 NOT NULL DEFAULT nextval('vouchers_id_seq'::regclass),
    "vchr_code" text NOT NULL,
    "vchr_createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vchr_discount_value" float8 NOT NULL,
    "vchr_expiration_date" timestamp NOT NULL,
    "vchr_is_active" bool NOT NULL DEFAULT true,
    "vchr_max_discount" float8,
    "vchr_min_purchase_amount" float8 DEFAULT 0,
    "vchr_updatedAt" timestamp NOT NULL,
    "shop_id" int4,
    "vchr_discount_type" text NOT NULL,
    "vchr_voucher_type" text NOT NULL,
    "vchr_max_quantity" int4 DEFAULT 0,
    "vchr_use_quantity" int4 DEFAULT 0
);





INSERT INTO "public"."vouchers" ("id", "vchr_code", "vchr_createdAt", "vchr_discount_value", "vchr_expiration_date", "vchr_is_active", "vchr_max_discount", "vchr_min_purchase_amount", "vchr_updatedAt", "shop_id", "vchr_discount_type", "vchr_voucher_type", "vchr_max_quantity", "vchr_use_quantity") VALUES
(1, '1234', '2024-12-06 03:15:19.057', 20000, '2024-12-06 02:53:50.67', 't', 100000000, 200000, '2024-12-06 03:15:19.057', 4, 'shop', 'shop', 0, 0);

