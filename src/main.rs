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
        
        .get("/api/credits/:credit_id/line_items/", handlers::line_item::Index)
        .get("/api/credits/:credit_id/line_items/:id", handlers::line_item::Show)
        .put("/api/credits/:credit_id/line_items/:id", handlers::line_item::Update)
        .post("api/credits/:credit_id/line_items/", handlers::line_item::Create)
        .delete("api/credits/:credit_id/line_items/:id", handlers::line_item::Delete)

        .get("api/user", handlers::user::Show)
        .post("api/users/", handlers::user::Create)
        .post("api/login", handlers::session::Login);

    chain = Chain::new(router);
    chain
        .link_before(Read::<bodyparser::MaxBodyLength>::one(MAX_BODY_LENGTH))
        .link_before(services::EnsureAuthenticated)
        .link_after(services::CatchUnauthenticatedRequest);

    mount
        .mount("/", chain)
        .mount("/app", Static::new(get_client_resources_path())) // TODO: make route 'public/
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


fn get_client_resources_path<'a>() -> &'a Path {
    // TODO: Not hardcode file path
    Path::new("/Users/gabeharms/Desktop/Practice/Payment-Processor/dist/client/app")}
