use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use models::credit::{Credit};
use services::get_user_id;
use services::get_route_id;
use util::Orm;

pub struct Delete;

impl Handler for Delete {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let id = Credit::destroy(params.0, params.1);

        let mut response = Response::new().set(((status::Ok), id.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32) {
    let credit_id = get_route_id(req);    
    let user_id = get_user_id(req);

    (credit_id, user_id)
}
