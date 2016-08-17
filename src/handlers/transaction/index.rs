use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use services::get_user_id;
use models::transaction::{Transaction};
use util::Orm;

pub struct Index;

/// Fetches a json array of credits based on the user id
impl Handler for Index {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        let incomes = Transaction::all(user_id);

        let mut response = Response::new().set(((status::Ok), incomes.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}

