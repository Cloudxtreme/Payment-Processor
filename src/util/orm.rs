
pub trait Orm<Model, Createable, Alterable> {
    /// Grabs all credits matching for the given user_id
    fn all(user_id: i32) -> Vec<Model>; 
    fn find(id: i32, user_id: i32) -> Model;
    fn alter(id: i32, user_id: i32, obj: Alterable) -> Model; 
    fn create(new_model: Createable) -> Model; 
    fn destroy(id: i32, user_id: i32) -> i32; 
}
