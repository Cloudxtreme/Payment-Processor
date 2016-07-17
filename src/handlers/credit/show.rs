use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use services::get_user_id;
use services::get_route_id;
use models::credit;


pub struct Show;

impl Handler for Show {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);
        
        let credit = credit::find(params.0, params.1);

        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32) {
    let credit_id = get_route_id(req);
    let user_id = get_user_id(req);
    (credit_id, user_id) 
}

