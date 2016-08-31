use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::user::{User};
use services::{get_key_from_body, authenticate};
use util::{AuthToken};

pub struct Login;

/// Creates a new user with attributes specified in the body of the request
impl Handler for Login {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        // TODO: Wrap in result, in scenario where neccessary keys don't exist in the body
        let params = get_params(req);

        let token = authenticate(params.0, params.1.password_hash, params.1.id);

        let status = get_status(token.clone());
            
        let mut response = Response::new().set((status, token.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (String, User) {
    let email = get_key_from_body::<String>(req, "email").unwrap().replace("\"", "");
    let password = get_key_from_body::<String>(req, "password").unwrap().replace("\"", "");

    let user = User::find_by_email(email);

    (password, user)
}

fn get_status(auth_token: AuthToken) -> status::Status {
    if auth_token.token.eq("Authentication Failed") {
        status::Unauthorized
    }
    else {
        status::Ok
    }
}

