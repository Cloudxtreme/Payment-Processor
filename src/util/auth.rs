use iron::typemap::Key;


pub struct Auth {
    pub id: i32
}
impl Key for Auth {
    type Value = i32;
}
