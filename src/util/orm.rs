
pub trait Orm<Model, Createable, Alterable> {
    /// Queries the database for all Models for the given user_id 
    fn all(user_id: i32) -> Vec<Model>; 
    /// Queries the database for one Model based on its id, and a user_id
    fn find(id: i32, user_id: i32) -> Model;
    /// Performs an update on one particular Model, taking its id, the current user_id, and the
    /// modified version of the object stored in Alterable
    fn alter(id: i32, user_id: i32, obj: Alterable) -> Model; 
    /// Creates a new Model, taking in a Createable struct that contains all its attributes
    fn create(new_model: Createable) -> Model; 
    /// Deletes a Model with a specific id, taking in the user_id to ensure proper permission
    fn destroy(id: i32, user_id: i32) -> i32; 
}
