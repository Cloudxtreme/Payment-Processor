use chrono::*;
use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::credit::{Credit, Createable};
use services::{get_user_id, get_key_from_body, from_unix_to_postgres_datetime};
use util::Orm;


pub struct Create;

/// Creates a new credit with attributes specified in the body of the request
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let new_credit = build_new_credit(req);

        let credit = Credit::create(new_credit);
            
        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_credit(req: &mut Request) -> Createable {
    let user_id = get_user_id(req);
    let amount = get_key_from_body::<i32>(req, "amount");
    let paid_date = from_unix_to_postgres_datetime(
        get_key_from_body::<i64>(req, "paid_date").unwrap()
    );
    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    Createable {
        user_id: user_id,
        amount: amount,
        paid_date: Some(PgTimestamp(paid_date)),
        created_date: created_date
    }
}

