use iron::prelude::*;
use iron::{Handler, headers, status};
use rustc_serialize::json::{ToJson};
use models::line_item::{LineItem, Alterable};
use services::{
    get_user_id, 
    get_route_id, 
    get_key_from_body, 
    from_float_to_pg_numeric
};

pub struct Update;

/// Updates the line item specified by the id in the params with
/// the attributes found in the body
impl Handler for Update {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let line_item = LineItem::alter(params.0, params.1, params.2, params.3);

        let mut response = Response::new().set(((status::Ok), line_item.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32, i32, Alterable) {
    let line_item_id = get_route_id(req, "id");
    let credit_id = get_route_id(req, "credit_id");
    let user_id = get_user_id(req);

    let amount = from_float_to_pg_numeric(get_key_from_body::<f64>(req, "amount").unwrap());

    let updated_line = Alterable {
        amount: amount
    };

    (line_item_id, user_id, credit_id, updated_line)
}

