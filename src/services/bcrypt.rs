use crypto::bcrypt::{bcrypt};
use util::{AuthToken};
use services::{build_token};

pub fn hash_password(password: String) -> String {
    let salt = b"salt for you now";  // Must be 16 chars
    let mut output = [0u8; 24];
    bcrypt(2, salt, password.as_bytes(), &mut output);

    let mut password_hash = String::with_capacity(output.len() * 2);
    for c in output.iter() {
        password_hash.push_str(&format!("{:02x}", c));
    }
    password_hash
}

// TODO: Possibly rename this service
pub fn authenticate(password: String, hash: String, user_id: i32) -> AuthToken {
    let generated_hash = hash_password(password);

    if hash.eq(&generated_hash) {
        AuthToken { token: build_token(&user_id.to_string()) }
    }
    else {
        AuthToken { token: "Authentication Failed".to_string().to_owned() }
    }
}
