use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use services::{get_user_id, get_route_id};
use models::transaction::{Transaction};
use models::stripe_info::{StripeInfo};
use util::Orm;


pub struct ShowDestination;

/// Fetches a jsonified transaction with an id specified in the params
impl Handler for ShowDestination {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);
        
        let transaction = Transaction::find(params.0, params.1);

        let creditor_stripe_info = StripeInfo::get(transaction.creditor_id);

        let mut tree = BTreeMap::new();
        tree.insert("destination_id".to_owned(), creditor_stripe_info.stripe_user_id.to_json());

        let mut response = Response::new().set(((status::Ok), Json::Object(tree).to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32) {
    let income_id = get_route_id(req, "id");
    let user_id = get_user_id(req);
    (income_id, user_id) 
}

