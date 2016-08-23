use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::stripe_info::{StripeInfo, Alterable};
use services::{
    get_user_id, 
    get_key_from_body, 
};

pub struct Update;

/// Updates the stripe info specified by the id in the params with
/// the attributes found in the body
impl Handler for Update {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let stripe_info = StripeInfo::alter(params.0, params.1);

        let mut response = Response::new().set(((status::Ok), stripe_info.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, Alterable) {
    let user_id = get_user_id(req);

    let access_token = get_key_from_body::<String>(req, "accessToken").unwrap();
    let publishable_key = get_key_from_body::<String>(req, "publishableKey").unwrap();
    let stripe_user_id = get_key_from_body::<String>(req, "stripeUserId").unwrap();


    let updated_stripe_info = Alterable {
        access_token: access_token.replace("\"", ""),
        publishable_key: publishable_key.replace("\"", ""),
        stripe_user_id: stripe_user_id.replace("\"", ""),
    };

    (user_id, updated_stripe_info)
}

