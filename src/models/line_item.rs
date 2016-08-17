use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::line_items as line_items;
use database::establish_connection;
use services::from_postgres_to_unix_datetime;

#[derive(Debug, Queryable)]
pub struct LineItem {
    pub id: i32,
    pub user_id: i32,
    pub credit_id: i32,
    pub amount: f64,
    pub description: String,
    pub created_date: PgTimestamp,
}

#[insertable_into(line_items)]
pub struct Createable {
    pub user_id: i32,
    pub credit_id: i32,
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
        tree.insert("userId".to_owned(), self.user_id.to_json());
        tree.insert("creditId".to_owned(), self.credit_id.to_json());
        tree.insert("amount".to_owned(), self.amount.to_json());
        tree.insert("description".to_owned(), self.description.to_json());
        tree.insert("createdDate".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl LineItem {
    /// Grabs all line_items matching for the given user_id and credit_id
    pub fn all(user_id: i32, credit_id: i32) -> Vec<LineItem> {
        let source = line_items::table
            .into_boxed()
            .filter(line_items::user_id.eq(user_id))
            .filter(line_items::credit_id.eq(credit_id));

        let conn = establish_connection();
        let result: Vec<LineItem> = source.select(
            (
                line_items::id,
                line_items::user_id, 
                line_items::credit_id,
                line_items::amount,
                line_items::description,
                line_items::created_date
            )
            ).load(&conn).unwrap();
        result
    }

    pub fn find(id: i32, user_id: i32, credit_id: i32) -> LineItem {
        let source = line_items::table.into_boxed()
            .filter(line_items::user_id.eq(user_id))
            .filter(line_items::credit_id.eq(credit_id))
            .filter(line_items::id.eq(id));


        let conn = establish_connection();
        let result: LineItem = source.select(
            (
                line_items::id,
                line_items::user_id, 
                line_items::credit_id,
                line_items::amount,
                line_items::description,
                line_items::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    pub fn alter(id: i32, user_id: i32, credit_id: i32, obj: Alterable) -> LineItem {
        let conn = establish_connection();

        // Ensures right line_item is updated, and only by the correct user
        let query = line_items::table.filter(line_items::id.eq(id))
            .filter(line_items::user_id.eq(user_id))
            .filter(line_items::credit_id.eq(credit_id));

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

    pub fn create(new_line_item: Createable) -> LineItem {
        let conn = establish_connection();

        insert(&new_line_item).into(line_items::table)
            .get_result::<LineItem>(&conn)
            .expect("Error saving new post")
    }

    pub fn destroy(id: i32, user_id: i32, credit_id: i32) -> i32 {
        let conn = establish_connection();

        let query = line_items::table.filter(line_items::id.eq(id))
            .filter(line_items::user_id.eq(user_id))
            .filter(line_items::credit_id.eq(credit_id));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { id } else { -1 }
    }
}
