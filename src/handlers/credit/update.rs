use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::credit::{Credit, Alterable};
use services::{get_user_id, get_route_id, get_key_from_body};
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
    // TODO: Make it so that you can update `paid_date` as well
    let credit_id = get_route_id(req);
    let user_id = get_user_id(req);

    let amount = get_key_from_body::<i32>(req, "amount");
    let updated_credit = Alterable {
        amount: amount
    };

    (credit_id, user_id, updated_credit)
}

