use std::default::Default;
use crypto::sha2::Sha256;
use jwt::{
    Header,
    Registered,
    Token,
};
use util::Error;

pub fn build_token(user_id: &str) -> String {
    let header: Header = Default::default();
    let claims = Registered {
        iss: Some("payment_processor.com".into()),
        sub: Some(user_id.into()),
        ..Default::default()
    };
    let token = Token::new(header, claims);

    token.signed(get_secret_key().into_bytes().as_slice(), Sha256::new()).ok().unwrap()
}

pub fn verify_token(token: &str) -> Result<i32, Error> {
    let token = try!(Token::<Header, Registered>::parse(token));

    if token.verify(get_secret_key().into_bytes().as_slice(), Sha256::new()) {
        let raw_token = token.claims.sub.unwrap_or("bad token".to_string());
        let parsed_token = try!(raw_token.parse::<i32>());
        Ok(parsed_token)
    }
    else {
       Err(Error::BadRequest) 
    }
}

fn get_secret_key() -> String {
    dotenv!("SECRET_KEY").to_string()
}
