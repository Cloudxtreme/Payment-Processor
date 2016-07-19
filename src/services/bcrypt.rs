use crypto::bcrypt::{bcrypt};

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
