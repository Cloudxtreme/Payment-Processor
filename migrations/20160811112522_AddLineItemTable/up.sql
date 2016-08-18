-- line_items table
CREATE TABLE IF NOT EXISTS line_items (
  id serial PRIMARY KEY,
  transaction_id integer NOT NULL,
  amount float NOT NULL,
  description varchar NOT NULL,
  created_date timestamp without time zone NOT NULL 
  );
-- TODO: Add foreign key constraints
