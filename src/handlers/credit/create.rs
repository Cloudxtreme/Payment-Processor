use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use urlencoded::{UrlDecodingError, UrlEncodedQuery};
use router::{Router};
use bodyparser::Json;
use models::credit;
use uri_params::{self, URIParams};
use std::collections::HashMap;

pub struct Create;

impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let mut params = get_params(req);

        let credit = credit::create_from_params(&mut params);
            
        let mut response = Response::new().set(((status::Ok), credit.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> credit::NewCredit {
    let json_body = req.get::<Json>();
    let mut user_id: Option<i64> = None;
    match json_body {
        Ok(Some(json_body)) => user_id = json_body.find("user_id").unwrap().as_i64(),
        Ok(None) => println!("No body"),
        Err(err) => println!("Error: {:?}", err)
    };
    let mut params = URIParams::new();
    params.insert("user_id".to_string(), vec![user_id.unwrap().to_string() ]);
    match credit::CreditQueryParams::from_create_request(&params) {
        Ok(query_params) => query_params,
        Err(err) => credit::NewCredit { 
            user_id: Some(-1),
            amount: Some(-1),
            paid_date: Some(PgTimestamp(0)),
            created_date: PgTimestamp(0)
        }
    }
}

