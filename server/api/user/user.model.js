'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var UserSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  password: {type: String, select: false}
});

export default mongoose.model('User', UserSchema);
