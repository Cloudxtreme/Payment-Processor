

/// Takes a float (i64) and converts it to a float with 2 decimal places
pub fn round_monetary(num: f64) -> f64 {
    (num * 100.0).round() / 100.0
}

