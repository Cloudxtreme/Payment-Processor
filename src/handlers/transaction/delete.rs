use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::transaction::{Transaction};
use services::{get_user_id, get_route_id};
use util::Orm;

pub struct Delete;

/// Deletes credit with the id specified in the params
impl Handler for Delete {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let id = Transaction::destroy(params.0, params.1);

        let mut response = Response::new().set(((status::Ok), id.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32) {
    let income_id = get_route_id(req, "id");    
    let user_id = get_user_id(req);

    (income_id, user_id)
}
