DROP TABLE IF EXISTS "public"."addresses";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS addresses_id_seq

-- Table Definition
CREATE TABLE "public"."addresses" (
    "id" int4 NOT NULL DEFAULT nextval('addresses_id_seq'::regclass),
    "adr_phone" varchar NOT NULL,
    "adr_name" varchar NOT NULL,
    "adr_address" jsonb NOT NULL,
    "user_id" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."order_details";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS order_details_id_seq

-- Table Definition
CREATE TABLE "public"."order_details" (
    "id" int4 NOT NULL DEFAULT nextval('order_details_id_seq'::regclass),
    "order_id" int4 NOT NULL,
    "food_id" int4 NOT NULL,
    "quantity" int4 DEFAULT 1,
    "price" float8 NOT NULL,
    "total_price" float8 NOT NULL,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."orders";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS orders_id_seq

-- Table Definition
CREATE TABLE "public"."orders" (
    "id" int4 NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    "user_id" int4 NOT NULL,
    "res_id" int4 NOT NULL,
    "total_amount" float8 NOT NULL,
    "total_price" float8 NOT NULL,
    "voucher_used" jsonb,
    "status" int4 NOT NULL DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "address_shipping" jsonb
);

DROP TABLE IF EXISTS "public"."vouchers";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS vouchers_id_seq

-- Table Definition
CREATE TABLE "public"."vouchers" (
    "id" int4 NOT NULL DEFAULT nextval('vouchers_id_seq'::regclass),
    "code" varchar NOT NULL,
    "discount_percent" float8,
    "discount_amount" float8,
    "minimum_order" float8,
    "valid_from" timestamp NOT NULL,
    "valid_to" timestamp NOT NULL,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);



INSERT INTO "public"."order_details" ("id", "order_id", "food_id", "quantity", "price", "total_price", "status", "created_at", "updated_at") VALUES
(1, 1, 7, 140, 2000, 280000, 1, '2024-11-28 06:14:48.401', '2024-11-28 06:14:48.401');
INSERT INTO "public"."order_details" ("id", "order_id", "food_id", "quantity", "price", "total_price", "status", "created_at", "updated_at") VALUES
(2, 2, 9, 10, 2000, 20000, 1, '2024-11-28 09:12:28.898', '2024-11-28 09:12:28.898');


INSERT INTO "public"."orders" ("id", "user_id", "res_id", "total_amount", "total_price", "voucher_used", "status", "created_at", "updated_at", "address_shipping") VALUES
(1, 4, 4, 140, 280000, '[]', 0, '2024-11-28 06:14:48.361', '2024-11-28 06:14:48.361', '{"city": "Bờ biển nga"}');
INSERT INTO "public"."orders" ("id", "user_id", "res_id", "total_amount", "total_price", "voucher_used", "status", "created_at", "updated_at", "address_shipping") VALUES
(2, 4, 4, 10, 20000, '[]', 1, '2024-11-28 09:12:28.836', '2024-11-28 09:12:28.836', '{"city": "haule"}');



