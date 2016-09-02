use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::stripe_info::{StripeInfo};
use services::{get_user_id};

pub struct Delete;

/// Deletes transaction with the id specified in the params
impl Handler for Delete {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);

        let id = StripeInfo::destroy(user_id);

        let mut response = Response::new().set(((status::Ok), id.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
