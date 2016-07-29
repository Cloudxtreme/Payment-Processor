use std::error;
use std::fmt;
use std::convert::From; 
use std::string::FromUtf8Error;
use std::num::ParseIntError;
use jwt;

#[derive(Debug, PartialEq)]
pub enum Error {
    BadRequest
}

impl error::Error for Error {
    fn description(&self) -> &str {
        match *self {
            Error::BadRequest => "Bad Request Data"
        }
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::BadRequest => {
                write!(f, "Request did not have valid data")
            },
        }
    }
}

impl From<FromUtf8Error> for Error {
    fn from(_: FromUtf8Error) -> Self {
        Error::BadRequest
    }
}

impl From<jwt::Error> for Error {
    fn from(_: jwt::Error) -> Self {
        Error::BadRequest
    }
}

impl From<ParseIntError> for Error {
    fn from(_: ParseIntError) -> Self {
        Error::BadRequest
    }
}

