use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use models::credit;
use services::get_user_id;
use services::get_route_id;
use services::get_key_from_body;

pub struct Update;

impl Handler for Update {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let credit =  credit::alter(params.0, params.1, params.2);

        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32, credit::UpdateableCredit) {
    let credit_id = get_route_id(req);
    let user_id = get_user_id(req);

    let amount = get_key_from_body::<i32>(req, "amount");
    let updated_credit = credit::UpdateableCredit {
        amount: amount
    };

    (credit_id, user_id, updated_credit)
}

