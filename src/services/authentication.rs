use iron::prelude::*;
use iron::BeforeMiddleware;
use iron::status;
use std::error::{Error};
use std::fmt::{self, Debug};
use util::Auth;
use services::{verify_token};

pub struct Authentication;

// TODO:
// This is initial Implementation. Next iteration will pull token from headers, decode
// it, and check to make sure its a valid user id. Otherwise an error will be thrown.
// This is of course after we add a users table and create login endpoints. There will also
// have to be some whitelist check to make sure that the login endpoints are accessible without
// a user id token in the headers. Consider renaming this to 'Authenticated'.
// Don't forget to blank out whatever is existing in the requests extentions to avoid a
// vulnerability

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
/// use
impl BeforeMiddleware for Authentication {
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

