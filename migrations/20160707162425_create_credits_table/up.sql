-- CREDITS table
-- Should probably add a company table and foreign key
-- to company on the credit, and remove company name from user tabl
CREATE TABLE IF NOT EXISTS credits (
  id serial PRIMARY KEY,
  user_id integer,
  project_name VARCHAR NOT NULL,
  payment_number INTEGER NOT NULL,
  amount integer,
  paid_date timestamp without time zone,
  created_date timestamp without time zone NOT NULL 
  );
