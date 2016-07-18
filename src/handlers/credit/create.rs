use chrono::*;
use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::credit;
use services::get_user_id;
use services::get_key_from_body;


pub struct Create;

impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let new_credit = build_new_credit(req);

        let credit = credit::create(new_credit);
            
        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_credit(req: &mut Request) -> credit::InsertableCredit {
    // TODO: Mke it so that you can specify a `paid date` as well
    let user_id = get_user_id(req);
    let amount = get_key_from_body::<i32>(req, "amount");
    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    credit::InsertableCredit {
        user_id: user_id,
        amount: amount,
        created_date: created_date
    }
}

