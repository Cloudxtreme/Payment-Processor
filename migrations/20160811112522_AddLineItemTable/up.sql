-- line_items table
CREATE TABLE IF NOT EXISTS line_items (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  credit_id integer NOT NULL,
  amount Numeric(20, 2) NOT NULL,
  created_date timestamp without time zone NOT NULL 
  );
-- TODO: Add foreign key constraints
