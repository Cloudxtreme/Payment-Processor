/// This tells Diesel (our ORM) to go looking in the database for tables by
/// these names, and then create a schema from the tables it finds. 
infer_schema!(dotenv!("DATABASE_URL"));
