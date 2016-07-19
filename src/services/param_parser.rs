use iron::prelude::*;
use router::{Router};
use bodyparser::Json;
use std::str::FromStr;
use util::Auth;
use std::collections::HashMap;

/// Finds the user id stored in the request. The authentication middleware will 
/// store it in the request's extentions. If no user_id is found, throw an error.
// TODO: Throw error when no user_id is found
pub fn get_user_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Auth>().unwrap().to_owned()
}

/// Finds the id specified in the route of the request. For ex. a request that has a 
/// route "api/credits/4" will produce an id of 4
pub fn get_route_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Router>().unwrap().find("id").unwrap_or("-1").parse::<i32>().unwrap()
}

/// Finds a particular key in the requests body. If the key does not exist in the 
/// body, it returns None.
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

/// Used only in the authentication service as of now. Will be removed once the
/// authentication algorithm changes
// TODO: Delete function
pub fn get_key_from_uri_query<T: FromStr>(query: &HashMap<String, Vec<String>>, key: &'static str) -> Option<T> {
    query.get(key).and_then(|vals| vals.get(0)).and_then(|val| {
        val.parse::<T>().ok()
    })
}
