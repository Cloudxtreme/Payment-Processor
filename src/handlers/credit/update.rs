use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::credit::{Credit, Alterable};
use services::{get_user_id, get_route_id, get_key_from_body, from_unix_to_postgres_datetime};
use util::Orm;

pub struct Update;

/// Updates the credit specified by the id in the params with
/// the attributes found in the body
impl Handler for Update {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let credit =  Credit::alter(params.0, params.1, params.2);

        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32, Alterable) {
    let credit_id = get_route_id(req);
    let user_id = get_user_id(req);

    let amount = get_key_from_body::<i32>(req, "amount");
    let paid_date = from_unix_to_postgres_datetime(
        get_key_from_body::<i64>(req, "paidDate").unwrap()
    );

    let updated_credit = Alterable {
        amount: amount,
        paid_date: Some(PgTimestamp(paid_date))
    };

    (credit_id, user_id, updated_credit)
}

