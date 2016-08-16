use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::credits as credits;
use database::establish_connection;
use services::from_postgres_to_unix_datetime;
use util::Orm;

// This is the data structure that models a database 'credit',
// and have to add diesel annotation in order to generate the 
// correct schema and relationships.
#[derive(Debug, Queryable)]
pub struct Credit {
    pub id: i32,
    pub user_id: Option<i32>,
    pub project_name: String,
    pub payment_number: i32,
    pub amount: Option<i32>,
    pub paid_date: Option<PgTimestamp>,
    pub created_date: PgTimestamp,
}

#[insertable_into(credits)]
pub struct Createable {
    pub user_id: i32,
    pub project_name: String,
    pub payment_number: i32,
    pub amount: Option<i32>,
    pub paid_date: Option<PgTimestamp>,
    pub created_date: PgTimestamp
}

pub struct Alterable {
    pub project_name: String,
    pub payment_number: i32,
    pub amount: Option<i32>,
    pub paid_date: Option<PgTimestamp>,
}

impl ToJson for Credit {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("userId".to_owned(), self.user_id.to_json());
        tree.insert("projectName".to_owned(), self.project_name.to_json());
        tree.insert("paymentNumber".to_owned(), self.payment_number.to_json());
        tree.insert("amount".to_owned(), self.amount.to_json());
        
        if let Some(date) = self.paid_date {
            tree.insert("paidDate".to_owned(), from_postgres_to_unix_datetime(date.0).to_json());
        };

        tree.insert("createdDate".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl Orm<Credit, Createable, Alterable> for Credit {
    /// Grabs all credits matching for the given user_id
    fn all(user_id: i32) -> Vec<Credit> {
        let source = credits::table.into_boxed().filter(credits::user_id.eq(user_id));

        let conn = establish_connection();
        let result: Vec<Credit> = source.select(
            (
                credits::id,
                credits::user_id, 
                credits::project_name,
                credits::payment_number,
                credits::amount,
                credits::paid_date, 
                credits::created_date
            )
            ).load(&conn).unwrap();
        result
    }

    fn find(id: i32, user_id: i32) -> Credit {
        let source = credits::table.into_boxed()
            .filter(credits::user_id.eq(user_id))
            .filter(credits::id.eq(id));


        let conn = establish_connection();
        let result: Credit = source.select(
            (
                credits::id,
                credits::user_id, 
                credits::project_name,
                credits::payment_number,
                credits::amount,
                credits::paid_date, 
                credits::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    fn alter(id: i32, user_id: i32, obj: Alterable) -> Credit {
        let conn = establish_connection();

        // Ensures right credit is updated, and only by the correct user
        let query = credits::table.filter(credits::id.eq(id))
            .filter(credits::user_id.eq(user_id));

        let result = update(query)
            .set(
                (
                    credits::project_name.eq(obj.project_name),
                    credits::payment_number.eq(obj.payment_number),
                    credits::amount.eq(obj.amount),
                    credits::paid_date.eq(obj.paid_date)
                )
                ).get_result::<Credit>(&conn)
            .expect(&format!("Unable to find post {}", id));
        result
    }

    fn create(new_credit: Createable) -> Credit {
        let conn = establish_connection();

        insert(&new_credit).into(credits::table)
            .get_result::<Credit>(&conn)
            .expect("Error saving new post")
    }

    fn destroy(id: i32, user_id: i32) -> i32 {
        let conn = establish_connection();

        let query = credits::table.filter(credits::id.eq(id))
            .filter(credits::user_id.eq(user_id));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { id } else { -1 }
    }
}
