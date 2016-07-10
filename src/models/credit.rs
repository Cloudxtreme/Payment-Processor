use chrono::NaiveDateTime;
use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use uri_params::{self, URIParams};
use schema::credits as credits;
use database::establish_connection;
use error::{Error, Result};

// This is the data structure that models a database 'credit',
// and have to add diesel annotation in order to generate the 
// correct schema and relationships.
#[derive(Debug, Queryable)]
pub struct Credit {
    pub id: i32,
    pub user_id: Option<i32>,
    pub amount: Option<i32>,
    pub paid_date: Option<PgTimestamp>,
    pub created_date: PgTimestamp,
}

/// This is an example of us implementing a 'trait' for a specific
/// 'struct'. When you implement a 'trait' for a struct, you must define
/// all of the functions in that trait. 
impl ToJson for Credit {
    // '&self' is just a reference to a Credit. Couldn't be just 'self' since its an object
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("user_id".to_owned(), self.user_id.to_json());
        tree.insert("amount".to_owned(), self.amount.to_json());
        tree.insert("paid_date".to_owned(), convert_pg_timestamp_to_unix_timestamp(self.paid_date.unwrap_or(PgTimestamp(0)).0).to_json());
        tree.insert("created_date".to_owned(), convert_pg_timestamp_to_unix_timestamp(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

#[derive(Debug, PartialEq)]
pub struct CreditQueryParams {
    pub id: Option<i32>,
    pub user_id: Option<i32>,
    pub created_date_greater_than: Option<NaiveDateTime>,
    pub created_date_less_than: Option<NaiveDateTime>,
}


impl CreditQueryParams {
    pub fn from_request(uri_params: &URIParams) -> Result<CreditQueryParams> {
        let id = uri_params::parse::<i32>(uri_params, "id"); 
        let user_id = uri_params::parse::<i32>(uri_params, "user_id"); 

        try!(Self::is_missing_params(vec![id, user_id]));

        Ok(
            CreditQueryParams {
                id: id,
                user_id: user_id,
                created_date_greater_than: None,
                created_date_less_than: None
            }
          )
    }

    pub fn is_missing_params(required_params: Vec<Option<i32>>) -> Result<()> {
        if required_params.iter().all(|param| param.is_none()) {
            Err(Error::MissingParameter { key: "project_id" })
        }
        else {
            Ok(())
        }
    }
}


/// Grabs all session pages matching the query parameters in `CreditQueryParams`
pub fn get_from_params(query_params: CreditQueryParams) -> Vec<Credit> {
    let source = credits::table.into_boxed()
        .filter(credits::id.eq(query_params.id.unwrap_or(-1)))
        .filter(credits::user_id.eq(query_params.user_id));

    // This is a shortcut from using 'match'. Since we want to do nothing in the case that
    // the 'created_date is 'None', we can use this statement to execute what's in the block,
    // only if 'created_date' is 'Some'. It also destructures 'created_date' for us
    /*
    if let Some(created_date_greater_than) = query_params.created_date_greater_than { 
        source = source.filter(credits::created_date.ge(created_date_greater_than))
    }
    if let Some(created_date_less_than) = query_params.created_date_less_than {
        source = source.filter(credits::created_date.ge(created_date_less_than))
    }
    */

    let conn = establish_connection();
    let result: Vec<Credit> = source.select((credits::id,credits::user_id, credits::amount,
                                            credits::paid_date, credits::created_date)).load(&conn).unwrap();
    result
}


/*
   pub fn get_by_id(id: i32) -> Vec<Credit> {

   }
   */


pub fn convert_pg_timestamp_to_unix_timestamp(pg_timestamp: i64) -> i64 {
    // The Postgres epoch is 2000-01-01, and Diesel converts Postgres timestamps
    // into microseconds, so we need to go from microseconds since 2000-01-01 to
    // seconds since 1970-01-01
    let seconds_since_pg_epoch = pg_timestamp / 1000000;
    let epoch_difference =
        "2000-01-01T00:00:00".parse::<NaiveDateTime>().unwrap().timestamp();

    seconds_since_pg_epoch + epoch_difference
}
