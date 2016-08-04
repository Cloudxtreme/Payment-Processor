### Payment Processor
This project is a web app build on a Rust backend, and AngularJS frontend. It is designed with a 
purpose to allow users to pay and be paid via a payment processing integration. 


### Setup
First Step is to install rust nightly
```bash
curl -s https://static.rust-lang.org/rustup.sh | sh -s -- --channel=nightly
```

Get npm and node
```bash
brew install npm
```

Next we need to globally install grunt and bower
```bash
npm install -g grunt bower
```

Install submodules
```bash
bower install
npm install
```


### Run Server
To get the server running, first compile the client:
```bash
grunt build
```

Now start the server:
```bash
cargo run
```

Navigate to Web Page:
```
localhost:3000/home
```

