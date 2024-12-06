DROP TABLE IF EXISTS "public"."cart_items";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS cart_items_id_seq

-- Table Definition
CREATE TABLE "public"."cart_items" (
    "id" int4 NOT NULL DEFAULT nextval('cart_items_id_seq'::regclass),
    "cart_id" int4 NOT NULL,
    "food_id" int4 NOT NULL,
    "quantity" int4 DEFAULT 1,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "price" float8,
    CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."carts";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS carts_id_seq

-- Table Definition
CREATE TABLE "public"."carts" (
    "id" int4 NOT NULL DEFAULT nextval('carts_id_seq'::regclass),
    "user_id" int4,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);




