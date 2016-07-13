#![cfg_attr(feature = "nightly", feature(custom_derive, custom_attribute, plugin))]
#![cfg_attr(feature = "nightly", plugin(diesel_codegen, dotenv_macros))]

extern crate iron;
extern crate router;
extern crate rustc_serialize;
extern crate urlencoded;
extern crate chrono;
extern crate staticfile;
extern crate mount;

#[macro_use]
extern crate diesel;
extern crate dotenv;

#[cfg(feature = "nightly")]
include!("main.rs.in");

#[cfg(feature = "with-syntex")]
include!(concat!(env!("OUT_DIR"), "/main.rs"));

use iron::prelude::*;
use iron::status;
use iron::Url;
use iron::modifiers::Redirect;
use router::Router;
use staticfile::Static;
use mount::Mount;
use std::path::Path;

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
        .get("/api/credits/", handlers::credit::Index)
        .get("/api/credits/:id", handlers::credit::Show);
    //router.get("/api/expenses", Expenses);

    let mut mount = Mount::new();
    mount
        .mount("/", router)
        .mount("/home",
               Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/index.html")));

    Iron::new(mount).http("localhost:3000").unwrap();
}

