extern crate iron;
extern crate router;
extern crate rustc_serialize;
extern crate urlencoded;
extern crate staticfile;
extern crate mount;

use iron::prelude::*;
use iron::status;
use iron::Url;
use iron::modifiers::Redirect;
use router::Router;
use staticfile::Static;
use mount::Mount;
use std::path::Path;

pub mod handlers;
//use handlers;


fn main() {

    fn HomePage(_: &mut Request) -> IronResult<Response> {
        Ok(Response::with((iron::status::Ok, "yo")))
    }
    fn RedirectHome(_: &mut Request) -> IronResult<Response> {
        Ok(Response::with((status::Found,
                           Redirect(Url::parse("http://localhost:3000/home").unwrap()))))
    }

    let mut router = Router::new();
    router
        .get("/", RedirectHome)
        .get("/api/credits/", handlers::credit::Index);
    //router.get("/api/expenses", Expenses);

    let mut mount = Mount::new();
    mount
        .mount("/", router)
        .mount("/home",
               Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/index.html")));
        
    Iron::new(mount).http("localhost:3000").unwrap();
}
