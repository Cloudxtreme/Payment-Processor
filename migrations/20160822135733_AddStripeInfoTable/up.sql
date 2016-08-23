-- STRIPE_INFOS table
CREATE TABLE IF NOT EXISTS stripe_infos (
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL,
  access_token VARCHAR NOT NULL,
  publishable_key VARCHAR NOT NULL,
  stripe_user_id VARCHAR NOT NULL,
  created_date timestamp without time zone NOT NULL 
  );

ALTER TABLE stripe_infos ADD CONSTRAINT unique_access_token UNIQUE (access_token);

-- TODO: Add foreign key constraint
