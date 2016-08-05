use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::users as users;
use database::establish_connection;
use services::from_postgres_to_unix_datetime;

// This is the data structure that models a database 'user',
// and have to add diesel annotation in order to generate the 
// correct schema and relationships.
#[derive(Debug, Queryable)]
pub struct User {
    pub id: i32,
    pub admin: bool,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub password_hash: String,
    pub created_date: PgTimestamp,
}

#[derive(Debug, Queryable)]
pub struct Retrievable {
    pub id: i32,
    pub admin: bool,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub created_date: PgTimestamp,
}

#[insertable_into(users)]
pub struct Createable {
    pub admin: bool,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub password_hash: String,
    pub created_date: PgTimestamp
}

pub struct Alterable {
    pub admin: bool,
    pub first_name: String,
    pub last_name: String,
    pub password_hash: String
}
 
impl ToJson for User {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("admin".to_owned(), self.admin.to_json());
        tree.insert("email".to_owned(), self.email.to_json());
        tree.insert("first_name".to_owned(), self.first_name.to_json());
        tree.insert("last_name".to_owned(), self.last_name.to_json());
        tree.insert("created_date".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl User {
    /// Grabs all users, if current user is admin 
    // TODO: Enforce admin constraint
    pub fn all() -> Vec<Retrievable> {
        let source = users::table.into_boxed();

        let conn = establish_connection();
        let result: Vec<Retrievable> = source.select(
            (
                users::id,
                users::admin,
                users::email,
                users::first_name,
                users::last_name,
                users::created_date
            )
            ).load(&conn).unwrap();
        result
    }

    pub fn find_by_id(id: i32) -> User {
        let source = users::table.into_boxed().filter(users::id.eq(id));

        let conn = establish_connection();
        let result: User = source.select(
            (
                users::id,
                users::admin,
                users::email,
                users::first_name,
                users::last_name,
                users::password_hash,
                users::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    pub fn find_by_email(email: String) -> User {
        let source = users::table.into_boxed().filter(users::email.eq(email));

        let conn = establish_connection();
        let result: User = source.select(
            (
                users::id,
                users::admin,
                users::email,
                users::first_name,
                users::last_name,
                users::password_hash,
                users::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    pub fn alter(id: i32, obj: Alterable) -> User {
        let conn = establish_connection();

        let query = users::table.filter(users::id.eq(id));

        // TODO: add ability to save paid date as well
        let result = update(query)
            .set(
                (
                    users::admin.eq(obj.admin),
                    users::first_name.eq(obj.first_name),
                    users::last_name.eq(obj.last_name),
                    users::password_hash.eq(obj.password_hash)
                )
                ).get_result::<User>(&conn)
            .expect(&format!("Unable to find post {}", id));
        result
    }

    pub fn create(new_user: Createable) -> User {
        let conn = establish_connection();

        insert(&new_user).into(users::table)
            .get_result::<User>(&conn)
            .expect("Error saving new post")
    }

    pub fn destroy(id: i32) -> i32 {
        let conn = establish_connection();

        let query = users::table.filter(users::id.eq(id));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { id } else { -1 }
    }
}
