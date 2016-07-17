use iron::prelude::*;
use util::Auth;


pub fn get_user_id(req: &mut Request) -> i32 {
    req.extensions.get::<Auth>().unwrap().to_owned()
}
