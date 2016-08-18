use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::{transactions, line_items};
use models::transaction::Transaction;
use database::establish_connection;
use services::from_postgres_to_unix_datetime;
use util::Orm;


#[derive(Debug, Queryable)]
#[belongs_to(transaction)]
pub struct LineItem {
    pub id: i32,
    pub transaction_id: i32,
    pub amount: f64,
    pub description: String,
    pub created_date: PgTimestamp,
}

#[insertable_into(line_items)]
pub struct Createable {
    pub transaction_id: i32,
    pub amount: f64,
    pub description: String,
    pub created_date: PgTimestamp,
}

pub struct Alterable {
    pub amount: f64,
    pub description: String,
}

impl ToJson for LineItem {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("transactionId".to_owned(), self.transaction_id.to_json());
        tree.insert("amount".to_owned(), self.amount.to_json());
        tree.insert("description".to_owned(), self.description.to_json());
        tree.insert("createdDate".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl LineItem {
    /// Grabs all line_items matching for the given user_id and transaction_id
    pub fn all(user_id: i32, transaction_id: i32) -> Vec<LineItem> {
        let source = line_items::table
            .inner_join(transactions::table)
            .into_boxed()
            .filter(line_items::transaction_id.eq(transaction_id))
            .filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)));

        let conn = establish_connection();
        let result: Vec<LineItem> = source.select(
            (
                line_items::id,
                line_items::transaction_id,
                line_items::amount,
                line_items::description,
                line_items::created_date
            )
            ).load(&conn).unwrap();
        result
    }

    pub fn find(id: i32, user_id: i32, transaction_id: i32) -> LineItem {
        let source = line_items::table
            .inner_join(transactions::table)
            .into_boxed()
            .filter(line_items::id.eq(id))
            .filter(line_items::transaction_id.eq(transaction_id))
            .filter(transactions::creditor_id.eq(user_id).or(transactions::debtor_id.eq(user_id)));

        let conn = establish_connection();
        let result: LineItem = source.select(
            (
                line_items::id,
                line_items::transaction_id,
                line_items::amount,
                line_items::description,
                line_items::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    pub fn alter(id: i32, user_id: i32, transaction_id: i32, obj: Alterable) -> LineItem {
        let conn = establish_connection();
        
        // This lets us ensure that the Line item does in fact belong to this user
        let line = LineItem::find(id, user_id, transaction_id);
        let query = line_items::table
            .filter(line_items::id.eq(line.id))
            .filter(line_items::transaction_id.eq(transaction_id));

        let result = update(query)
            .set(
                (
                    line_items::amount.eq(obj.amount),
                    line_items::description.eq(obj.description),
                )
                ).get_result::<LineItem>(&conn)
            .expect(&format!("Unable to find post {}", id));
        result
    }

    pub fn create(user_id: i32, new_line_item: Createable) -> LineItem {
        let conn = establish_connection();

        // Ensures that the transaction the line item is being added to actually belongs to the user
        let transaction = Transaction::find(new_line_item.transaction_id, user_id);
        if transaction.id != new_line_item.transaction_id {
            panic!("Transaction does not belong to the user. Creation of line item failed"); // TODO:
        }

        insert(&new_line_item).into(line_items::table)
            .get_result::<LineItem>(&conn)
            .expect("Error saving new post")
    }

    pub fn destroy(id: i32, user_id: i32, transaction_id: i32) -> i32 {
        let conn = establish_connection();

        // Ensures that the transaction the line item is being added to actually belongs to the user
        let transaction = Transaction::find(transaction_id, user_id);
        if transaction.id != transaction_id {
            panic!("Transaction does not belong to the user. Deletion of line item failed"); // TODO:
        }

        let query = line_items::table
            .filter(line_items::id.eq(id))
            .filter(line_items::transaction_id.eq(transaction_id));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { id } else { -1 }
    }
}
