#![cfg_attr(feature = "nightly", feature(custom_derive, custom_attribute, plugin))]
#![cfg_attr(feature = "nightly", plugin(diesel_codegen, dotenv_macros))]

#[macro_use] extern crate iron;
extern crate router;
extern crate rustc_serialize;
extern crate urlencoded;
extern crate chrono;
extern crate staticfile;
extern crate mount;
extern crate bodyparser;
extern crate persistent;
extern crate crypto;
extern crate jwt;

#[macro_use]
extern crate diesel;
extern crate dotenv;
#[macro_use] extern crate hyper;

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
use persistent::Read;

const MAX_BODY_LENGTH: usize = 1024 * 1024 * 10;



fn main() {
    let mut router = Router::new(); // Routes
    let mut chain;                  // Middleware
    let mut mount = Mount::new();   // Static File Server (for Index page)

    router
        .get("/", redirect_home)
        .get("/api/credits/", handlers::credit::Index)
        .get("/api/credits/:id", handlers::credit::Show)
        .put("/api/credits/:id", handlers::credit::Update)
        .post("api/credits/", handlers::credit::Create)
        .delete("api/credits/:id", handlers::credit::Delete)
        // TODO: Add GET /api/users/:id route
        .post("api/users/", handlers::user::Create)
        .post("api/login", handlers::session::Login);

    chain = Chain::new(router);
    chain
        .link_before(Read::<bodyparser::MaxBodyLength>::one(MAX_BODY_LENGTH))
        .link_before(services::EnsureAuthenticated)
        .link_after(services::CatchUnauthenticatedRequest);

    mount
        .mount("/", chain)
        .mount("/app", Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/dist/client/app")))
        //.mount("/app", Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/client/app")))
        .mount("/components", Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/client/components")))
        .mount("/bower_components", Static::new(Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/client/bower_components")))
        .mount("/home", Static::new(get_index_file_path()));


    Iron::new(mount).http("localhost:3000").unwrap();
}

fn redirect_home(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Found,
                       Redirect(Url::parse("http://localhost:3000/home").unwrap()))))
}

fn get_index_file_path<'a>() -> &'a Path {
    // TODO: Not hardcode file path
    Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/dist/client/index.html")
}
