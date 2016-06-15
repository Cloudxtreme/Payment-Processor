use iron::prelude::*;
use iron::{headers, status};
use iron::Handler;

use rustc_serialize::json::{Json, ToJson};

use urlencoded::{UrlDecodingError, UrlEncodedQuery};



pub struct Index;

impl Handler for Index {

    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let mut response = Response::new().set((status::Ok));
        Ok(response)
    }

}
