use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;
use rustc_serialize::json::{Json, ToJson};
use urlencoded::{UrlDecodingError, UrlEncodedQuery};
use diesel::types::structs::data_types::PgTimestamp; // Temporary Test


use models::credit;

pub struct Index;

impl Handler for Index {

    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        // Temporary Test
        let credit1 = credit::Credit {
            id: 5,
            user_id: Some(5),
            amount: Some(5),
            paid_date: Some(PgTimestamp(500736408041057)),
            created_date: PgTimestamp(500736408041057)
        };
        
        let mut response = Response::new().set(((status::Ok), credit1.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }

}
