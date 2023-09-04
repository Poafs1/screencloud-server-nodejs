\c "screencloud-dev"

-- Clean all data in tables
TRUNCATE TABLE "machine_balance" CASCADE;

-- Reset auto increment
ALTER SEQUENCE "machine_balance_id_seq" RESTART WITH 1;

-- Insert data
INSERT INTO "machine_balance" (note, amount) VALUES
(5, 4),
(10, 15),
(20, 7);