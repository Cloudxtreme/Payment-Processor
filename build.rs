

#[cfg(feature = "with-syntex")]
fn main() {
    extern crate syntex;
    extern crate diesel_codegen;
    extern crate dotenv_codegen;

    use std::env;
    use std::path::Path;


    let out_dir = env::var_os("OUT_DIR").unwrap();
    let mut registry = syntex::Registry::new();
    diesel_codegen::register(&mut registry);
    dotenv_codegen::register(&mut registry);

    let src = Path::new("src/main.rs.in");
    let dst = Path::new(&out_dir).join("main.rs");

    registry.expand("", &src, &dst).unwrap();
}

#[cfg(feature = "nightly")]
fn main() {}
