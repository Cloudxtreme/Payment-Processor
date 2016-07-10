-- CREDITS table
CREATE TABLE IF NOT EXISTS credits (
  id integer PRIMARY KEY,
  user_id integer,
  amount integer,
  paid_date timestamp without time zone,
  created_date timestamp without time zone NOT NULL 
  );
