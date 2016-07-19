use iron::typemap::Key;

/// A struct containing the authentication meta data. This struct
/// is inserted into the request's extention once a user's token 
/// has been parsed.
pub struct Auth {
    pub id: i32
}
impl Key for Auth {
    type Value = i32;
}
