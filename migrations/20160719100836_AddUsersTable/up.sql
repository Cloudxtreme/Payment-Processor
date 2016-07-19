-- USERS table
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  admin BOOL NOT NULL DEFAULT 'f',
  password_hash VARCHAR NOT NULL,
  created_date timestamp without time zone NOT NULL 
  );
