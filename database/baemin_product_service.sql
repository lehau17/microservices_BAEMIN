DROP TABLE IF EXISTS "public"."categories";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS categories_id_seq

-- Table Definition
CREATE TABLE "public"."categories" (
    "id" int4 NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    "cate_name" varchar,
    "cate_description" text,
    "cate_icon" varchar,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."food_likes";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS food_likes_id_seq

-- Table Definition
CREATE TABLE "public"."food_likes" (
    "id" int4 NOT NULL DEFAULT nextval('food_likes_id_seq'::regclass),
    "user_id" int4,
    "food_id" int4,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."food_ratings";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS food_ratings_id_seq

-- Table Definition
CREATE TABLE "public"."food_ratings" (
    "id" int4 NOT NULL DEFAULT nextval('food_ratings_id_seq'::regclass),
    "user_id" int4,
    "food_id" int4,
    "food_rate_point" int4,
    "food_rate_comment" text,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."foods";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS foods_id_seq

-- Table Definition
CREATE TABLE "public"."foods" (
    "id" int4 NOT NULL DEFAULT nextval('foods_id_seq'::regclass),
    "res_id" int4,
    "cate_id" int4,
    "food_name" varchar,
    "food_description" text,
    "food_images" varchar,
    "food_total_like" int4 DEFAULT 0,
    "food_total_rating" int4 DEFAULT 0,
    "food_avg_rating" int4 DEFAULT 0,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."foods_details";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."foods_details" (
    "id" int4 NOT NULL,
    "food_price" float8 NOT NULL,
    "food_stock" int4 NOT NULL
);

INSERT INTO "public"."categories" ("id", "cate_name", "cate_description", "cate_icon", "status", "created_at", "updated_at") VALUES
(2, 'Túi Xách Xì Tin', 'Túi xách sext', 'https://picsum.photo/200', 0, '2024-11-24 10:39:40.454', '2024-11-24 10:39:40.454');
INSERT INTO "public"."categories" ("id", "cate_name", "cate_description", "cate_icon", "status", "created_at", "updated_at") VALUES
(1, 'Túi Xách Xì Tin', 'Túi xách sext', 'https://picsum.photo/200', 0, '2024-11-24 10:39:26.607', '2024-11-24 10:39:26.607');






INSERT INTO "public"."foods" ("id", "res_id", "cate_id", "food_name", "food_description", "food_images", "food_total_like", "food_total_rating", "food_avg_rating", "status", "created_at", "updated_at") VALUES
(3, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-24 12:44:13.291', '2024-11-24 12:44:13.291');
INSERT INTO "public"."foods" ("id", "res_id", "cate_id", "food_name", "food_description", "food_images", "food_total_like", "food_total_rating", "food_avg_rating", "status", "created_at", "updated_at") VALUES
(4, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-24 12:44:13.325', '2024-11-24 12:44:13.325');
INSERT INTO "public"."foods" ("id", "res_id", "cate_id", "food_name", "food_description", "food_images", "food_total_like", "food_total_rating", "food_avg_rating", "status", "created_at", "updated_at") VALUES
(5, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-24 12:44:31.456', '2024-11-24 12:44:31.456');
INSERT INTO "public"."foods" ("id", "res_id", "cate_id", "food_name", "food_description", "food_images", "food_total_like", "food_total_rating", "food_avg_rating", "status", "created_at", "updated_at") VALUES
(2, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-24 12:44:13.287', '2024-11-24 12:44:13.287'),
(1, 4, 1, 'Bán nước mía cybersoft', NULL, 'https://picsum.photos/id/237/200/300', 1, 0, 0, 1, '2024-11-24 12:44:13.286', '2024-11-24 12:44:13.286'),
(6, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-24 12:44:31.456', '2024-11-24 12:44:31.456'),
(7, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-28 05:59:44.439', '2024-11-28 05:59:44.439'),
(8, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-28 05:59:47.859', '2024-11-28 05:59:47.859'),
(9, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-28 05:59:48.884', '2024-11-28 05:59:48.884'),
(10, 4, 1, 'Gà rán mún ớt', NULL, 'https://picsum.photos/id/237/200/300', 0, 0, 0, 1, '2024-11-28 05:59:49.703', '2024-11-28 05:59:49.703');

INSERT INTO "public"."foods_details" ("id", "food_price", "food_stock") VALUES
(3, 2000, 50);
INSERT INTO "public"."foods_details" ("id", "food_price", "food_stock") VALUES
(2, 2000, 50);
INSERT INTO "public"."foods_details" ("id", "food_price", "food_stock") VALUES
(5, 2000, 50);
INSERT INTO "public"."foods_details" ("id", "food_price", "food_stock") VALUES
(1, 2000, 10),
(8, 2000, 50),
(10, 2000, 50),
(7, 2000, -90),
(9, 2000, 40),
(4, 2000, 50);
