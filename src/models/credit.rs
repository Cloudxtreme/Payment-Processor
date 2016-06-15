use chrono::NaiveDateTime;
use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;


// This is the data structure that models a database 'credit',
// and have to add diesel annotation in order to generate the 
// correct schema and relationships.
#[derive(Debug, Queryable)]
pub struct Credit {
    pub id: i32,
    pub user_id: Option<i32>,
    pub amount: Option<i32>,
    pub paid_date: PgTimestamp,
    pub created_date: PgTimestamp,
}

impl ToJson for Credit {
    fn to_json(&self) -> Json {
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("user_id".to_owned(), self.user_id.to_json());
        tree.insert("amount".to_owned(), self.amount.to_json());
        tree.insert("paid_date".to_owned(), convert_pg_timestamp_to_unix_timestamp(self.paid_date.0).to_json());
        tree.insert("created_date".to_owned(), convert_pg_timestamp_to_unix_timestamp(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

//pub fn get_by_id(id: i32) -> Vec<Credit> {

//}

pub fn convert_pg_timestamp_to_unix_timestamp(pg_timestamp: i64) -> i64 {
    // The Postgres epoch is 2000-01-01, and Diesel converts Postgres timestamps
    // into microseconds, so we need to go from microseconds since 2000-01-01 to
    // seconds since 1970-01-01
    let seconds_since_pg_epoch = pg_timestamp / 1000000;
    let epoch_difference =
        "2000-01-01T00:00:00".parse::<NaiveDateTime>().unwrap().timestamp();

    seconds_since_pg_epoch + epoch_difference
}
