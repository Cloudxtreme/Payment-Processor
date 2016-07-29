use iron::prelude::*;
use iron::BeforeMiddleware;
use iron::status;
use util::{Auth, Error};
use services::{verify_token};


pub struct EnsureAuthenticated;

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
        // TODO: Add to the util::Error enum a AuthenticationFailure member
        itry!(parse_token(req), status::BadRequest);
        Ok(())
    }
    fn catch(&self, _: &mut Request, _: IronError) -> IronResult<()> { 
        Ok(()) 
    }

}

/// Parses the JWT token from the 'X-Auth' header of the request, if the request is attempting
/// to hit a protected route. If an invalid / no token is received an Error will be returned
/// as the result, and the AfterMiddleware will send an error response back.
fn parse_token(req: &mut Request) -> Result<(), Error> {
    let ref path = req.url.path;                     // Parsed to determine if token is required
    let ref x_auth = req.headers.get_raw("X-Auth");  // Pulls raw X-Auth token bytes from request
    let invalid_token: &[Vec<u8>] = &[Vec::new()];   // Used if there's no X-Auth token the request

    if in_secure_area(path[0].clone(), path[1].clone()) {
        let token = 
        try!(String::from_utf8((*x_auth.unwrap_or(invalid_token))[0].clone()));
        let user_id = try!(verify_token(&token));
        req.extensions.insert::<Auth>(user_id);
    }

    Ok(())
}

/// As of now, are only two open routes are '/home' and 'api/login'
fn in_secure_area(first: String, second: String) -> bool {
    first != "home" && second != "login"
}
