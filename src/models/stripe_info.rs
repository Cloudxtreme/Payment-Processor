use rustc_serialize::json::{Json, ToJson};
use std::collections::BTreeMap;
use diesel::types::structs::data_types::PgTimestamp;
use diesel::*;
use schema::{stripe_infos};
use database::establish_connection;
use services::from_postgres_to_unix_datetime;

#[derive(Debug, Queryable)]
pub struct StripeInfo {
    pub id: i32,
    pub user_id: i32,
    pub access_token: String,
    pub publishable_key: String,
    pub stripe_user_id: String,
    pub created_date: PgTimestamp,
}

#[insertable_into(stripe_infos)]
pub struct Createable {
    pub user_id: i32,
    pub access_token: String,
    pub publishable_key: String,
    pub stripe_user_id: String,
    pub created_date: PgTimestamp,
}

pub struct Alterable {
    pub access_token: String,
    pub publishable_key: String,
    pub stripe_user_id: String,
}
 
impl ToJson for StripeInfo {
    fn to_json(&self) -> Json {         
        let mut tree = BTreeMap::new();
        tree.insert("id".to_owned(), self.id.to_json());
        tree.insert("userID".to_owned(), self.user_id.to_json());
        tree.insert("accessToken".to_owned(), self.access_token.to_json());
        tree.insert("publishableKey".to_owned(), self.publishable_key.to_json());
        tree.insert("stripeUserId".to_owned(), self.stripe_user_id.to_json());
        tree.insert("createdDate".to_owned(), from_postgres_to_unix_datetime(self.created_date.0).to_json());
        Json::Object(tree)
    }
}

impl StripeInfo {
    /// Grabs the stripe_info row, for the current_user 
    pub fn get(user_id: i32) -> StripeInfo {
        let source = stripe_infos::table.into_boxed()
            .filter(stripe_infos::user_id.eq(user_id));

        let conn = establish_connection();
        let result: StripeInfo = source.select(
            (
                stripe_infos::id,
                stripe_infos::user_id,
                stripe_infos::access_token,
                stripe_infos::publishable_key,
                stripe_infos::stripe_user_id,
                stripe_infos::created_date
            )
            ).first(&conn).unwrap();
        result
    }

    pub fn alter(user_id: i32, obj: Alterable) -> StripeInfo {
        let conn = establish_connection();

        let query = stripe_infos::table.filter(stripe_infos::user_id.eq(user_id));

        let result = update(query)
            .set(
                (
                    stripe_infos::access_token.eq(obj.access_token),
                    stripe_infos::publishable_key.eq(obj.publishable_key),
                    stripe_infos::stripe_user_id.eq(obj.stripe_user_id),
                )
                ).get_result::<StripeInfo>(&conn)
            .expect(&format!("Unable to find stripe_info for user {}", user_id));
        result
    }

    pub fn create(user_id: i32, new_stripe_info: Createable) -> StripeInfo {
        let conn = establish_connection();

        // Ensures that the user that the info is being added to actually belongs to the user
        if user_id != new_stripe_info.user_id {
            panic!("Attempting to add stripe info a user who is not the current logged in user. Creation of stripe info failed"); // TODO:
        }

        insert(&new_stripe_info).into(stripe_infos::table)
            .get_result::<StripeInfo>(&conn)
            .expect("Error saving new post")
    }

    pub fn destroy(user_id: i32) -> i32 {
        let conn = establish_connection();

        let query = stripe_infos::table.filter(stripe_infos::user_id.eq(user_id));

        let count = delete(query)
            .execute(&conn)
            .expect("Error deleting posts");
        if count > 0 { user_id } else { -1 }
    }
}
