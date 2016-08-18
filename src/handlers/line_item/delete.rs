use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::line_item::{LineItem};
use services::{get_user_id, get_route_id};

pub struct Delete;

/// Deletes transaction with the id specified in the params
impl Handler for Delete {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let id = LineItem::destroy(params.0, params.1, params.2);

        let mut response = Response::new().set(((status::Ok), id.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32, i32) {
    let line_item_id = get_route_id(req, "id");
    let transaction_id = get_route_id(req, "transaction_id");
    let user_id = get_user_id(req);
    (line_item_id, user_id, transaction_id) 
}
