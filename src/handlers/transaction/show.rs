use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use services::{get_user_id, get_route_id};
use models::transaction::{Transaction};
use util::Orm;


pub struct Show;

/// Fetches a jsonified transaction with an id specified in the params
impl Handler for Show {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);
        
        let transaction = Transaction::find(params.0, params.1);

        let mut response = Response::new().set(((status::Ok), transaction.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32) {
    let income_id = get_route_id(req, "id");
    let user_id = get_user_id(req);
    (income_id, user_id) 
}

