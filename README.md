### Setup
First Step is to install npm and node
```bash
brew install npm
```
Also install MongoDB with brew
```bash
brew install mongodb
```
Create Directories Required by MongoDB
```bash
sudo mkdir /data
sudo mkdir /data/db
sudo chown -R [CURRENT_USER] /data
```

Now we install ruby and sass
```bash
brew install ruby
gem install bundler
gem install sass
```

Next we need to globally install grunt and bower
```bash
npm install -g grunt bower
```



Finally, install submodules
```bash
bower install
npm install
```


### Run Server
To get the server running, start MongoDB in a separate tab
```bash
mongod
```
Now start the web server on port 9000, like so
```bash
grunt serve
```
