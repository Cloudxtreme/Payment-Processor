use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;

/// Returns a new database nection
pub fn establish_connection() -> PgConnection {
    let connection_url = dotenv!("DATABASE_URL");

    PgConnection::establish(&connection_url)
        .expect("Could not connect to the database")
}

