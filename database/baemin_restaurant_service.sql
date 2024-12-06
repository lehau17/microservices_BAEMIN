DROP TABLE IF EXISTS "public"."restaurant_ratings";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS restaurant_ratings_id_seq

-- Table Definition
CREATE TABLE "public"."restaurant_ratings" (
    "id" int4 NOT NULL DEFAULT nextval('restaurant_ratings_id_seq'::regclass),
    "user_id" int4,
    "res_id" int4,
    "res_rate_point" int4,
    "res_rate_comment" text,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restaurant_ratings_res_id_fkey" FOREIGN KEY ("res_id") REFERENCES "public"."restaurants"("id"),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."restaurants";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."restaurants" (
    "id" int4 NOT NULL,
    "res_name" varchar NOT NULL,
    "res_address" jsonb NOT NULL,
    "res_avg_rating" float4 DEFAULT 4.5,
    "res_time_start" varchar DEFAULT '10.00'::character varying,
    "res_time_end" varchar DEFAULT '22.00'::character varying,
    "res_total_rating" int4 DEFAULT 0,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "res_description" text
);

INSERT INTO "public"."restaurant_ratings" ("id", "user_id", "res_id", "res_rate_point", "res_rate_comment", "status", "created_at", "updated_at") VALUES
(1, 4, 4, 2, NULL, 1, '2024-11-24 09:43:09.545', '2024-11-24 09:43:09.545');


INSERT INTO "public"."restaurants" ("id", "res_name", "res_address", "res_avg_rating", "res_time_start", "res_time_end", "res_total_rating", "status", "created_at", "updated_at", "res_description") VALUES
(4, 'hhhhhhh', '{"city": "Thành Phố Hồ Chí Minh"}', 4.5, '2024-11-22T09:21:50.677Z', '2024-11-22T09:21:50.677Z', 0, 1, '2024-11-23 08:22:06.623', '2024-11-23 09:22:55.204', NULL);

