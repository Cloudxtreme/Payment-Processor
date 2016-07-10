use diesel::prelude::*;
use diesel::pg::PgConnection;
use std::env;

/// Returns a new database nection
pub fn establish_connection() -> PgConnection {
    let connection_url =
        env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in order to run warehouse");

    PgConnection::establish(&connection_url)
        .expect("Could not connect to the database")
}

