### Payment Processor
This project is a web app build on a Rust backend, and AngularJS frontend. It is designed with a 
purpose to allow users to pay and be paid via a payment processing integration. 


### Setup
#### Install rust nightly
```bash
curl -s https://static.rust-lang.org/rustup.sh | sh -s -- --channel=nightly
```

#### Install Cargo Packages 
```bash
cargo install
```

#### Install Diesel CLI
```bash
cargo install diesel_cli
```

#### Get NPM and Node
```bash
brew install npm
```

#### Globally install Grunt and Bower
```bash
npm install -g grunt bower
```

#### Install submodules
```bash
bower install
npm install
```

#### Prepare Database
```bash
~/.cargo/bin/diesel database reset
```

#### Seed Database (optional)
```
  1.) Import seed script to PostMan by navigating to:
      https://www.getpostman.com/collections/75eae9df8adc59106f07
  
  2.) Then Run entire collection in order
```

### Run Server
To get the server running:
```bash
grunt serve
```

Navigate to Web Page:
```
localhost:3000/home
```

