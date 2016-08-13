use iron::prelude::*;
use router::{Router};
use bodyparser::Json;
use std::str::FromStr;
use util::Auth;

/// Finds the user id stored in the request. The authentication middleware will 
/// store it in the request's extentions. If no user_id is found, throw an error.
// TODO: Throw error when no user_id is found
pub fn get_user_id(req: &mut Request) -> i32 {
    req.extensions.get::<Auth>().unwrap().to_owned()
}

/// Finds the id specified in the route of the request. For ex. a request that has a 
/// route "api/credits/4" will produce an id of 4
pub fn get_route_id(req: &mut Request, key: &str) -> i32 {
    req.extensions.get::<Router>().unwrap().find(key).unwrap_or("-1").parse::<i32>().unwrap()
}

/// Finds a particular key in the requests body. If the key does not exist in the 
/// body, it returns None.
pub fn get_key_from_body<T: FromStr>(req: &mut Request, key: &str) -> Option<T> {
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
