use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::{transactions, line_items};
use database::establish_connection;
use services::from_postgres_to_unix_datetime;
use util::Orm;

// This is the data structure that models a database 'credit',
// and have to add diesel annotation in order to generate the 
// correct schema and relationships.
#[derive(Debug, Queryable)]
#[has_many(line_items)]
pub struct Transaction {
    pub id: i32,
    pub creditor_id: i32,
    pub debtor_id: i32,
    pub project_name: String,
    pub company_name: String,
    pub payment_number: i32,
    pub paid_date: Option<PgTimestamp>,
    pub created_date: PgTimestamp,
}

#[insertable_into(transactions)]
pub struct Createable {
    pub creditor_id: i32,
    pub debtor_id: i32,
    pub project_name: String,
    pub company_name: String,
    pub payment_number: i32,
    pub paid_date: Option<PgTimestamp>,
    pub created_date: PgTimestamp
}

pub struct Alterable {
    pub creditor_id: i32,
    pub debtor_id: i32,
    pub project_name: String,
    pub company_name: String,
    pub payment_number: i32,
    pub paid_date: Option<PgTimestamp>,
}

impl ToJson for Transaction {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("creditorId".to_owned(), self.creditor_id.to_json());
        tree.insert("debtorId".to_owned(), self.creditor_id.to_json());
        tree.insert("projectName".to_owned(), self.project_name.to_json());
        tree.insert("companyName".to_owned(), self.company_name.to_json());
        tree.insert("paymentNumber".to_owned(), self.payment_number.to_json());
        
        if let Some(date) = self.paid_date {
            tree.insert("paidDate".to_owned(), from_postgres_to_unix_datetime(date.0).to_json());
        };

        tree.insert("createdDate".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl Orm<Transaction, Createable, Alterable> for Transaction {
    /// Grabs all transactions matching for the given user_id
    fn all(user_id: i32) -> Vec<Transaction> {
        let source = transactions::table.into_boxed().filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)));

        let conn = establish_connection();
        let result: Vec<Transaction> = source.select(
            (
                transactions::id,
                transactions::creditor_id, 
                transactions::debtor_id,
                transactions::project_name,
                transactions::company_name,
                transactions::payment_number,
                transactions::paid_date, 
                transactions::created_date
            )
            ).load(&conn).unwrap();
        result
    }

    fn find(id: i32, user_id: i32) -> Transaction {
        let source = transactions::table.into_boxed()
            .filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)))
            .filter(transactions::id.eq(id));


        let conn = establish_connection();
        let result: Transaction = source.select(
            (
                transactions::id,
                transactions::creditor_id, 
                transactions::debtor_id,
                transactions::project_name,
                transactions::company_name,
                transactions::payment_number,
                transactions::paid_date, 
                transactions::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    fn alter(id: i32, user_id: i32, obj: Alterable) -> Transaction {
        let conn = establish_connection();

        // Ensures right credit is updated, and only by the correct user
        let query = transactions::table.filter(transactions::id.eq(id))
            .filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)));

        let result = update(query)
            .set(
                (
                    transactions::creditor_id.eq(obj.creditor_id),
                    transactions::debtor_id.eq(obj.debtor_id),
                    transactions::project_name.eq(obj.project_name),
                    transactions::company_name.eq(obj.company_name),
                    transactions::payment_number.eq(obj.payment_number),
                    transactions::paid_date.eq(obj.paid_date)
                )
                ).get_result::<Transaction>(&conn)
            .expect(&format!("Unable to find post {}", id));
        result
    }

    fn create(new_transaction: Createable) -> Transaction {
        let conn = establish_connection();

        insert(&new_transaction).into(transactions::table)
            .get_result::<Transaction>(&conn)
            .expect("Error saving new post")
    }

    fn destroy(id: i32, user_id: i32) -> i32 {
        let conn = establish_connection();

        let query = transactions::table.filter(transactions::id.eq(id))
            .filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { id } else { -1 }
    }
}
