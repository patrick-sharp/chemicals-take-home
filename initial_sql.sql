-- This is what I ran in the vercel postgres backend to set this up

CREATE TABLE products ( 
  id varchar(255) PRIMARY KEY,
  name varchar(255), 
  default_batch_size int
);

INSERT INTO products(id, name, default_batch_size)
VALUES 
  ('chem-a', 'Chemical A',  20),
  ('chem-b', 'Chemical B',  50),
  ('chem-c', 'Chemical C', 300),
  ('chem-d', 'Chemical D', 500);

CREATE TABLE demand ( 
  id varchar(255) PRIMARY KEY,
  product_id varchar(255) references products(id),
  amount int
);

INSERT INTO demand(id, product_id, amount)
VALUES 
  ('dem-0', 'chem-a',  100),
  ('dem-1', 'chem-b',  200),
  ('dem-2', 'chem-c',  500),
  ('dem-3', 'chem-d', 1000);

CREATE TYPE batch_status AS ENUM ('scheduled', 'in-progress', 'completed');

CREATE TABLE batches (
  id serial PRIMARY KEY,
  product_id varchar(255) references products(id),
  amount int,
  status batch_status,
  date_scheduled   timestamp without time zone,
  date_in_progress timestamp without time zone,
  date_completed   timestamp without time zone
);

INSERT INTO batches(product_id, amount, status, date_scheduled, date_in_progress, date_completed)
VALUES 
  ('chem-a',  40, 'completed',   '2024-09-01'::timestamp without time zone, '2024-09-02'::timestamp without time zone, '2024-09-10'::timestamp without time zone),
  ('chem-a',  20, 'in-progress', '2024-09-02'::timestamp without time zone, '2024-09-03'::timestamp without time zone, null                                     ),
  ('chem-a',  20, 'scheduled',   '2024-09-03'::timestamp without time zone, null                                     , null                                     ),
  ('chem-c', 300, 'completed',   '2024-09-04'::timestamp without time zone, '2024-09-05'::timestamp without time zone, '2024-09-14'::timestamp without time zone),
  ('chem-c', 300, 'scheduled',   '2024-09-04'::timestamp without time zone, null                                     , null                                     ),
  ('chem-d', 500, 'in-progress', '2024-09-05'::timestamp without time zone, '2024-09-06'::timestamp without time zone, null                                     );

-- to show all tables
SELECT table_name
  FROM information_schema.tables
 WHERE table_schema='public'
   AND table_type='BASE TABLE';
