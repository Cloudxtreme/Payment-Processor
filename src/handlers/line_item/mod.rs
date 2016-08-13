mod index;
mod show;
mod update;
mod create;
mod delete;
                              /// GET    /api/credits
pub use self::index::Index;   
                              /// POST   /api/credits
pub use self::create::Create; 
                              /// GET    /api/credits/:id
pub use self::show::Show;     
                              /// PUT    /api/credits/:id
pub use self::update::Update;                               
                              /// DELETE /api/credits/:id
pub use self::delete::Delete; 
