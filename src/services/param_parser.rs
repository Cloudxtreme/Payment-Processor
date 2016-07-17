use iron::prelude::*;
use router::{Router};
use util::Auth;


pub fn get_user_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Auth>().unwrap().to_owned()
}

pub fn get_route_id(req: &mut Request) -> i32 {
    // TODO: Wrap in Result
    req.extensions.get::<Router>().unwrap().find("id").unwrap_or("-1").parse::<i32>().unwrap()
}
