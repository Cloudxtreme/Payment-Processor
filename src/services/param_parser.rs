use iron::prelude::*;
use router::{Router};
use bodyparser::Json;
use std::str::FromStr;
use util::Auth;
use std::collections::HashMap;

pub fn get_user_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Auth>().unwrap().to_owned()
}

pub fn get_route_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Router>().unwrap().find("id").unwrap_or("-1").parse::<i32>().unwrap()
}

pub fn get_key_from_body<T: FromStr>(req: &mut Request, key: &str) -> Option<T> {
    // TODO: Wrap in Result
    let json_body = req.get::<Json>();
    match json_body {
        Ok(Some(json)) => {
            match json.find(key) {
                Some(value) => value.to_string().parse::<T>().ok(),
                None => None
            }
        }
        Ok(None) => None,
        Err(_) => None 
    }
}

pub fn get_key_from_uri_query<T: FromStr>(query: &HashMap<String, Vec<String>>, key: &'static str) -> Option<T> {
    query.get(key).and_then(|vals| vals.get(0)).and_then(|val| {
        val.parse::<T>().ok()
    })
}
