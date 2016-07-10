use std::error;
use std::fmt;

pub type Result<T> = ::std::result::Result<T, Error>;


#[derive(Debug, PartialEq)]
pub enum Error {
    /// If the client attempting to connect to the warehouse server is not
    /// authorized. This currently only comes from the Authorization middleware.
    Authorization,
    /// If the client does not pass all required parameters.
    /// For example, this service requires that the client passes in both a
    /// `end_date` and a `start_date`.
    MissingParameter {
        /// Represents the key that was missing.
        key: &'static str,
    },
    /// If the client sent parameters that we were unable to decode.
    UnreadableParameters,
}

impl error::Error for Error {
    fn description(&self) -> &str {
        match *self {
            Error::Authorization => "client could not authorize",
            Error::MissingParameter { .. } => "client did not pass in required parameter",
            Error::UnreadableParameters => "unable to decode query parameters"
        }
    }
}
impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::Authorization => {
                write!(f, "Could not match client token with expected token")
            },
            Error::MissingParameter { key } => {
                write!(f, "Required key {} was missing", key)
            },
            Error::UnreadableParameters =>
            {
                write!(f, "Unable to decode query parameters")
            }
        }
    }
}

