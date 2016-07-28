use iron::prelude::*;
use iron::BeforeMiddleware;
use iron::status;
use std::error::{Error};
use std::fmt::{self, Debug};
use util::Auth;
use services::{verify_token};

pub struct EnsureAuthenticated;

#[derive(Debug)]
struct StringError(String);

impl fmt::Display for StringError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        Debug::fmt(self, f)
    }
}

impl Error for StringError {
    fn description(&self) -> &str { &*self.0 }
}

/// Middleware that determines if a user is authenticated already or not. If the inbound request
/// contains a token that can be decoded properly into a user id, then the user has already been
/// authenticated, and we will insert the user id into the request's extension member for further
/// use.
///
/// Two Scenarios:
/// * Valid token is received in the 'X-Auth' header, and the user's id will be added to the
///     requests extensions
/// * Invalid / No Token is received in the 'X-Auth' header, and an error will be thrown.
///     (Unless the request was for the index page)
///
impl BeforeMiddleware for EnsureAuthenticated {
    fn before(&self, req: &mut Request) -> IronResult<()> {
        let token =
            String::from_utf8((*req.headers.get_raw("X-Auth").unwrap())[0].clone()).ok().unwrap();
        let user_id = verify_token(&token);


        req.extensions.insert::<Auth>(user_id);
        if user_id == -1 {
            Err(IronError::new(
                    StringError("Error in ErrorProducer BeforeMiddleware".to_string()),
                    status::BadRequest)
               )
        }
        else {
            Ok(())
        }

    }
    fn catch(&self, _: &mut Request, _: IronError) -> IronResult<()> { 
        Ok(()) 
    }

}

