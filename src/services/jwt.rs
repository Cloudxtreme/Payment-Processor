use std::default::Default;
use crypto::sha2::Sha256;
use jwt::{
    Header,
    Registered,
    Token,
};

pub fn build_token(user_id: &str) -> String {
    let header: Header = Default::default();
    let claims = Registered {
        iss: Some("mikkyang.com".into()),
        sub: Some(user_id.into()),
        ..Default::default()
    };
    let token = Token::new(header, claims);

    // TODO: Hide secret key
    token.signed(b"secret_key", Sha256::new()).ok().unwrap()
}
