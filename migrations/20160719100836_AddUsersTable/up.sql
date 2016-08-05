-- USERS table
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  admin BOOL NOT NULL DEFAULT 'f',
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_date timestamp without time zone NOT NULL 
  );

ALTER TABLE users ADD CONSTRAINT unique_user_email UNIQUE (email);

