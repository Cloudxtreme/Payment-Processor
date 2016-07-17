use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use services::get_user_id;
use models::credit;

pub struct Index;

impl Handler for Index {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        let credits = credit::all(user_id);

        let mut response = Response::new().set(((status::Ok), credits.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}

