use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use urlencoded::{UrlDecodingError, UrlEncodedQuery};

use models::credit;

pub struct Index;

impl Handler for Index {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);
        let credits = credit::get_from_params(params);

        let mut response = Response::new().set(((status::Ok), credits.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> credit::CreditQueryParams {
    match req.get_ref::<UrlEncodedQuery>() {
        Ok(query) => {
            match credit::CreditQueryParams::from_index_request(query) {
                Ok(params) => params,
                Err(err) => credit::CreditQueryParams { 
                    id: Some(-1), 
                    user_id: Some(-1),
                    created_date_greater_than: None,
                    created_date_less_than: None
                }
            }
        },
        Err(err) => credit::CreditQueryParams { 
            id: Some(-1), 
            user_id: Some(-1),
            created_date_greater_than: None,
            created_date_less_than: None
        }

    }
}

