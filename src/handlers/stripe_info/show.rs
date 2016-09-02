use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use services::get_user_id;
use models::stripe_info::{StripeInfo};

// TODO: 500s when no stripe info exists. Should be a 404, or empty json or something

pub struct Show;

/// Fetches a jsonified line_item with an id specified in the params based off the user and transaction
/// ids
impl Handler for Show {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        
        let stripe_info = StripeInfo::get(user_id);

        let mut response = Response::new().set(((status::Ok), stripe_info.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
