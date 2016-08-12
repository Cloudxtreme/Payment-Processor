use diesel::pg::data_types::PgNumeric;
use std::convert::TryFrom;

/// Takes a PgNumeric type (i64) and converts it to a float 
pub fn from_pg_numeric_to_float(numeric: PgNumeric) -> f64 {
    match numeric {
        PgNumeric::Positive{weight, scale, digits} => {
            get_unsigned_number(weight, scale, digits) 
        },
        PgNumeric::Negative{weight, scale, digits} => {
            get_unsigned_number(weight, scale, digits) * -1_f64
        },
        PgNumeric::NaN => {
            0.0_f64
        }
    }
}

// Expects a positive/negative number with exactly 2 decimal places. sorry...will make better 
pub fn from_float_to_pg_numeric(num: f64) -> PgNumeric {
    let mut num_str = num.to_string();
    let weight: i16;
    if num.is_sign_positive() {
        weight = i16::try_from(num_str.len()).unwrap() - 1_i16; // minus one for the decimal place
        num_str = num_str.replace(".", "");
        let mut digits: Vec<i16> = Vec::new();
        get_digits_from_string(num_str.clone(), &mut digits);
        PgNumeric::Positive{ weight: weight, scale: 2_u16, digits: digits}
    }
    else {
        weight = i16::try_from(num_str.len()).unwrap() - 2_i16; // minus two for the decimal place and negative sign
        num_str = num_str.replace(".", "");
        num_str = num_str.replace("-", "");
        let mut digits: Vec<i16> = Vec::new();
        get_digits_from_string(num_str.clone(), &mut digits);

        PgNumeric::Negative{ weight: weight, scale: 2_u16, digits: digits}
    }
}



fn get_unsigned_number(weight: i16, scale: u16, digits: Vec<i16>) -> f64 {
    let mut number = String::new();
    for i in 0..digits.len() {
        number.push_str(&(digits[i].to_string()));
    }
    number.insert(usize::try_from(weight-i16::try_from(scale).unwrap()).unwrap(), '.');
    number.parse::<f64>().unwrap()
}

fn get_digits_from_string(num: String, digits: &mut Vec<i16>) {
    let mut chars = num.chars();
    loop {
        match chars.next() {
            Some(digit) => {
                digits.push(i16::try_from(digit.to_digit(10).unwrap()).unwrap());
            },
            None => { break }
        }
    }
}
