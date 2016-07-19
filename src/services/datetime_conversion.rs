use chrono::*;

/// Takes a postgres datetime (i64) and converts it to a unix datetime 
pub fn from_postgres_to_unix_datetime(pg_timestamp: i64) -> i64 {
    // The Postgres epoch is 2000-01-01, and Diesel converts Postgres timestamps
    // into microseconds, so we need to go from microseconds since 2000-01-01 to
    // seconds since 1970-01-01
    let seconds_since_pg_epoch = pg_timestamp / 1000000;
    let epoch_difference =
        "2000-01-01T00:00:00".parse::<NaiveDateTime>().unwrap().timestamp();

    seconds_since_pg_epoch + epoch_difference
}
