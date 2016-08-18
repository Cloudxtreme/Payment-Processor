use iron::prelude::*;
use iron::{Handler, headers, status};
use diesel::types::structs::data_types::PgTimestamp;
use rustc_serialize::json::{ToJson};
use models::transaction::{Transaction, Alterable};
use services::{get_user_id, get_route_id, get_key_from_body, from_unix_to_postgres_datetime};
use util::Orm;

pub struct Update;

/// Updates the transaction specified by the id in the params with
/// the attributes found in the body
impl Handler for Update {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = get_params(req);

        let income =  Transaction::alter(params.0, params.1, params.2);

        let mut response = Response::new().set(((status::Ok), income.to_json().to_string()));
        response.headers.set(headers::ContentType::json());

        Ok(response)
    }
}
fn get_params(req: &mut Request) -> (i32, i32, Alterable) {
    let income_id = get_route_id(req, "id");
    let user_id = get_user_id(req);
    let creditor_id = get_key_from_body::<i32>(req, "creditorId");
    let debtor_id = get_key_from_body::<i32>(req, "debtorId");
    let project_name = get_key_from_body::<String>(req, "projectName");
    let company_name = get_key_from_body::<String>(req, "companyName");
    let payment_number = get_key_from_body::<i32>(req, "paymentNumber");
    let paid_date = get_key_from_body::<i64>(req, "paidDate").unwrap_or(-1);

    let parsed_paid_date = match paid_date {
        -1 => None,
        _ => Some(PgTimestamp(from_unix_to_postgres_datetime(paid_date)))
    };

    // TODO: validate creditor_id & debtor_id are not equal
    // TODO: validate (creditor_id || debtor_id) == user_id

    let updated_transaction = Alterable {
        creditor_id: creditor_id.unwrap(),
        debtor_id: debtor_id.unwrap(),
        project_name: project_name.unwrap().replace("\"", ""),
        company_name: company_name.unwrap().replace("\"", ""),
        payment_number: payment_number.unwrap(),
        paid_date: parsed_paid_date 
    };

    (income_id, user_id, updated_transaction)
}

