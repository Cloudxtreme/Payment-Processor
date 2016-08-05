use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::user::{User};
use services::{get_key_from_body, authenticate};

pub struct Login;

/// Creates a new user with attributes specified in the body of the request
impl Handler for Login {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let token = authenticate(params.0, params.1.password_hash, params.1.id);
            
        let mut response = Response::new().set(((status::Ok), token.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (String, User) {
    // TODO: Authenticate via username, not user_id
    let user_id = get_key_from_body::<i32>(req, "user_id").unwrap();
    let password = get_key_from_body::<String>(req, "password").unwrap();

    let user = User::find(user_id);

    (password, user)
}

