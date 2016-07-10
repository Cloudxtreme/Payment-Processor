use std::collections::HashMap;
use std::str::FromStr;
use error::{Error, Result};

/// Type alias for the type of URI params we get from our request. Mostly just
/// a nice to have so we don't have to type HashMap<String, Vec<String>> a lot
pub type URIParams = HashMap<String, Vec<String>>;


pub fn get<'a>(query: &'a URIParams, key: &'static str)-> Option<&'a String> {
    query.get(key).and_then(|vals| vals.get(0))
}

pub fn get_required<'a>(query: &'a URIParams, key: &'static str) -> Result<&'a String> {
    get(query, key).ok_or(Error::MissingParameter { key: key })
}

pub fn parse<T: FromStr>(query: &URIParams, key: &'static str) -> Option<T> {
    get(query, key).and_then(|val| {
        val.parse::<T>().ok()
    })
}
pub fn parse_required<T: FromStr>( query: &URIParams, key: &'static str) -> Result<T> {
    get_required(query, key).and_then(|val| {
        val.parse::<T>().or(Err(Error::MissingParameter { key: key }))
    })
}


