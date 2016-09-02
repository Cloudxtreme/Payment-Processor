use chrono::*;
use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::stripe_info::{StripeInfo, Createable};
use services::{
    get_user_id, 
    get_key_from_body
};


pub struct Create;

/// Creates a new line_item with attributes specified in the body of the request
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        let new_stripe_info = build_new_stripe_info(req, user_id);

        let stripe_info = StripeInfo::create(user_id, new_stripe_info);
            
        let mut response = Response::new().set(((status::Ok), stripe_info.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_stripe_info(req: &mut Request, user_id: i32) -> Createable {
    let access_token = get_key_from_body::<String>(req, "accessToken").unwrap();
    let publishable_key = get_key_from_body::<String>(req, "publishableKey").unwrap();
    let stripe_user_id = get_key_from_body::<String>(req, "stripeUserId").unwrap();


    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    Createable {
        user_id: user_id,
        access_token: access_token.replace("\"", ""),
        publishable_key: publishable_key.replace("\"", ""),
        stripe_user_id: stripe_user_id.replace("\"", ""),
        created_date: created_date 
    }
}

