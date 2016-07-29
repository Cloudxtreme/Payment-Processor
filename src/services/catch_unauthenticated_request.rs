use iron::prelude::*;
use iron::AfterMiddleware;

pub struct CatchUnauthenticatedRequest;

/// Executes if the before middleware raises an error while trying to parse
/// the user's JWT token from the headers. This middleware simply spits the error to stdout,
/// and sends the error response stored in the error.
impl AfterMiddleware for CatchUnauthenticatedRequest {
  fn catch(&self, _: &mut Request, err: IronError) -> IronResult<Response> {
    println!("Unauthorized Request Received. {}", err.error);
    Ok(err.response)
  }
}
