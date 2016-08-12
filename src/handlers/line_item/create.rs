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
    from_float_to_pg_numeric
};


pub struct Create;

/// Creates a new line_item with attributes specified in the body of the request
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let new_line_item = build_new_line_item(req);

        let line_item = LineItem::create(new_line_item);
            
        let mut response = Response::new().set(((status::Ok), line_item.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn build_new_line_item(req: &mut Request) -> Createable {
    let credit_id = get_route_id(req, "credit_id");
    let user_id = get_user_id(req);

    let amount = from_float_to_pg_numeric(get_key_from_body::<f64>(req, "amount").unwrap());
    let created_date = PgTimestamp(Local::now().naive_local().timestamp() );

    Createable {
        user_id: user_id,
        credit_id: credit_id,
        amount: amount,
        created_date: created_date 
    }
}

