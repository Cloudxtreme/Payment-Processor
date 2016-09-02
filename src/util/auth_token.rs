use rustc_serialize::json::{ToJson, Json};
use std::collections::BTreeMap;

#[derive(Clone)]
pub struct AuthToken {
    pub token: String
}

impl ToJson for AuthToken {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("token".to_owned(), self.token.to_json());
        Json::Object(tree)
    }
}
