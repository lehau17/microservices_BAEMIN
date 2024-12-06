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

-- Table Definition
CREATE TABLE "public"."carts" (
    "id" int4 NOT NULL,
    "status" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."roles";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS roles_id_seq

-- Table Definition
CREATE TABLE "public"."roles" (
    "id" int4 NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    "role_name" varchar DEFAULT 'USER'::character varying,
    "role_description" varchar,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS users_id_seq

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "usr_username" varchar NOT NULL,
    "usr_password" varchar NOT NULL,
    "usr_first_name" varchar,
    "usr_last_name" varchar,
    "usr_phone" varchar,
    "usr_email" varchar NOT NULL,
    "usr_avatar" varchar,
    "status" int4 DEFAULT 1,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "role_id" int4 NOT NULL,
    "usr_dob" timestamp,
    "usr_gender" Gender,
    "usr_refresh_token" varchar
);



INSERT INTO "public"."carts" ("id", "status", "created_at", "updated_at") VALUES
(4, 1, '2024-11-24 17:12:44.235524', '2024-11-24 17:12:44.235524');
INSERT INTO "public"."carts" ("id", "status", "created_at", "updated_at") VALUES
(17, 1, '2024-11-28 08:34:44.32', '2024-11-28 08:34:44.32');


INSERT INTO "public"."roles" ("id", "role_name", "role_description", "status", "created_at", "updated_at") VALUES
(1, 'USER', NULL, 1, '2024-11-20 18:56:52.171069', '2024-11-20 18:56:52.171069');
INSERT INTO "public"."roles" ("id", "role_name", "role_description", "status", "created_at", "updated_at") VALUES
(2, 'ADMIN', NULL, 1, '2024-11-24 10:35:25.210548', '2024-11-24 10:35:25.210548');


INSERT INTO "public"."users" ("id", "usr_username", "usr_password", "usr_first_name", "usr_last_name", "usr_phone", "usr_email", "usr_avatar", "status", "created_at", "updated_at", "role_id", "usr_dob", "usr_gender", "usr_refresh_token") VALUES
(4, 'lehau17', 'b946ccc987465afcda7e45b1715219711a13518d1f1663b8c53b848cb0143441', NULL, NULL, NULL, 'hau17131203@gmail.com', NULL, 1, '2024-11-20 23:00:02.253', '2024-11-20 23:00:02.253', 2, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoiaGF1MTcxMzEyMDNAZ21haWwuY29tIiwicm9sZSI6eyJpZCI6MSwicm9sZV9uYW1lIjoiVVNFUiJ9LCJpYXQiOjE3MzIxNzUxNDEsImV4cCI6MTczMjc3OTk0MX0.mtyGfVVuEVodfUj_CR7Ph_ZptIgnpenqMsT2dyVRJK0');
INSERT INTO "public"."users" ("id", "usr_username", "usr_password", "usr_first_name", "usr_last_name", "usr_phone", "usr_email", "usr_avatar", "status", "created_at", "updated_at", "role_id", "usr_dob", "usr_gender", "usr_refresh_token") VALUES
(17, 'lehau18', 'b946ccc987465afcda7e45b1715219711a13518d1f1663b8c53b848cb0143441', NULL, NULL, NULL, 'haudz20003@gmail.com', NULL, 1, '2024-11-28 08:34:44.309', '2024-11-28 08:34:44.309', 1, NULL, NULL, NULL);

