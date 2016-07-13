use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{ToJson};
use urlencoded::{UrlDecodingError, UrlEncodedQuery};
use router::{Router};

use models::credit;

pub struct Show;

impl Handler for Show {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);
        
        let json = match credit::get_from_params(params).pop() {
            Some(credit) => credit.to_json().to_string(),
            None => "{}".to_string() 
        };

        let mut response = Response::new().set(((status::Ok), json));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> credit::CreditQueryParams {
    let credit_id = req.extensions.get::<Router>().unwrap().find("id").unwrap_or("").to_string();
    let params_result = req.get_mut::<UrlEncodedQuery>();
    match params_result {
        Ok(params) => {
            params.insert("id".to_string(), vec![credit_id]);
            match credit::CreditQueryParams::from_show_request(params) {
                Ok(query_params) => query_params,
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

