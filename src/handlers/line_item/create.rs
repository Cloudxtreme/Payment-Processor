use chrono::*;
use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::line_item::{LineItem, Createable};
use services::{
    get_user_id, 
    get_route_id,
    get_key_from_body, 
    round_monetary
};


pub struct Create;

/// Creates a new line_item with attributes specified in the body of the request
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let user_id = get_user_id(req);
        let new_line_item = build_new_line_item(req);

        let line_item = LineItem::create(user_id, new_line_item);
            
        let mut response = Response::new().set(((status::Ok), line_item.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_line_item(req: &mut Request) -> Createable {
    let transaction_id = get_route_id(req, "transaction_id");

    let amount = round_monetary(get_key_from_body::<f64>(req, "amount").unwrap());
    let description = get_key_from_body::<String>(req, "description").unwrap();

    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    Createable {
        transaction_id: transaction_id,
        amount: amount,
        description: description.replace("\"", ""),
        created_date: created_date 
    }
}

