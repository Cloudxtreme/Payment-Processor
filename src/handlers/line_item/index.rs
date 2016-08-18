use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use services::{get_user_id, get_route_id};
use models::line_item::{LineItem};

pub struct Index;

/// Fetches a json array of line items based on the user and user ids
impl Handler for Index {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        let transaction_id = get_route_id(req, "transaction_id");

        let line_items = LineItem::all(user_id, transaction_id);

        let mut response = Response::new().set(((status::Ok), line_items.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}

