use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use services::{get_user_id};
use models::user::{User};


pub struct Show;

/// Fetches a jsonified user based on the user's token 
impl Handler for Show {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        
        let user = User::find_by_id(user_id);

        let mut response = Response::new().set(((status::Ok), user.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}

