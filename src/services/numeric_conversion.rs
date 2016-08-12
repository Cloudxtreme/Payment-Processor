use diesel::pg::data_types::PgNumeric;
use std::convert::TryFrom;

// TODO: Bug in saving/retrieving amounts. Not sure if the bug is in saving, retrieving or both
//      Need to do more research. Here is an example though.
//      Amount stored in database: 3000400000000.00
//      Params received in PgNumeric: weight: 3, precision: 4, digits: [3,4]
//      weird

/// Takes a PgNumeric type (i64) and converts it to a float 
pub fn from_pg_numeric_to_float(numeric: PgNumeric) -> f64 {
    match numeric {
        PgNumeric::Positive{weight, scale, digits} => {
            println!("{}", weight);
            println!("{}", scale);

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
        let mut num_with_zeros = append_decimal_zeros_as_needed(num_str.clone());
        weight = get_weight(num_with_zeros.clone());
        num_with_zeros = num_with_zeros.replace(".", "");
        let mut digits: Vec<i16> = Vec::new();
        get_digits_from_string(num_with_zeros.clone(), &mut digits);
        println!("{}", weight);
        println!("{:?}", digits);
        PgNumeric::Positive{ weight: 20_i16, scale: 2_u16, digits: digits}
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


// Needs plenty of optimization, just getting it working
fn append_decimal_zeros_as_needed(num: String) -> String {
    let mut num_with_zeros = num.clone();
    let decimal_place_index = get_string_decimal_place(num.clone());
    for _ in 0..(num.len() - (num.len() - decimal_place_index - 2)) {
        num_with_zeros.push_str("0");       
    }
    println!("{}", num_with_zeros);
    num_with_zeros
}

fn get_string_decimal_place(num: String) -> usize {
    let mut iterator = num.char_indices();
    loop {
        match iterator.next() {
            Some(str_with_index) => if str_with_index.1.eq(&'.') { return str_with_index.0 },
            None => break
        }
    }
    0_usize
}

fn get_weight(num: String) -> i16 {
    let mut unsigned_num = num.replace("-", "");
    unsigned_num = unsigned_num.replace(".", "");
    i16::try_from(unsigned_num.len()).unwrap() 
}

fn get_unsigned_number(weight: i16, scale: u16, digits: Vec<i16>) -> f64 {
    let mut number = String::new();
    println!("{:?}", digits);
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
