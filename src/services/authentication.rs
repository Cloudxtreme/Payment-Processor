use iron::prelude::*;
use iron::BeforeMiddleware;
use urlencoded::{UrlEncodedQuery};
use util::Auth;
use services::get_key_from_uri_query;

pub struct Authentication;

// TODO:
// This is initial Implementation. Next iteration will pull token from headers, decode
// it, and check to make sure its a valid user id. Otherwise an error will be thrown.
// This is of course after we add a users table and create login endpoints. There will also
// have to be some whitelist check to make sure that the login endpoints are accessible without
// a user id token in the headers. Consider renaming this to 'Authenticated'.
// Don't forget to blank out whatever is existing in the requests extentions to avoid a
// vulnerability

/// Middleware that determines if a user is authenticated already or not. If the inbound request
/// contains a token that can be decoded properly into a user id, then the user has already been
/// authenticated, and we will insert the user id into the request's extension member for further
/// use
impl BeforeMiddleware for Authentication {
    fn before(&self, req: &mut Request) -> IronResult<()> {
        if let Ok(params) = req.get::<UrlEncodedQuery>() {
            let user_id = get_key_from_uri_query::<i32>(&params, "user_id"); 
            req.extensions.insert::<Auth>(user_id.unwrap());
        }
        Ok(())  
            //Err(IronError::new(StringError("Error in ErrorProducer
            //                                      BeforeMiddleware".to_string()), status::BadRequest))

    }
    fn catch(&self, _: &mut Request, _: IronError) -> IronResult<()> { 
        Ok(()) 
    }

}

