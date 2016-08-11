use chrono::*;
use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::user::{User, Createable};
use services::{get_key_from_body, hash_password};

pub struct Create;

/// Creates a new user with attributes specified in the body of the request
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let new_user = build_new_user(req);

        let user = User::create(new_user);

        let mut response = Response::new().set(((status::Ok), user.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_user(req: &mut Request) -> Createable {
    let admin = get_key_from_body::<bool>(req, "admin");
    let email = get_key_from_body::<String>(req, "email");
    let company_name = get_key_from_body::<String>(req, "companyName");
    let first_name = get_key_from_body::<String>(req, "firstName");
    let last_name = get_key_from_body::<String>(req, "lastName");
    let password = get_key_from_body::<String>(req,"password").unwrap();
    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    let password_hash = hash_password(password.replace("\"",""));

    Createable {
        admin: admin.unwrap(),
        email: email.unwrap().replace("\"", ""),
        company_name: company_name.unwrap().replace("\"", ""),
        first_name: first_name.unwrap().replace("\"", ""),
        last_name: last_name.unwrap().replace("\"", ""),
        password_hash: password_hash,
        created_date: created_date
    }
}

