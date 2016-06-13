/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/user              ->  find
 * POST    /api/user              ->  create
 */

'use strict';

import _ from 'lodash';
import config from '../../config/environment';
var User = require('./user.model');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');

var secretKey = config.secrets.session;


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


// Gets a list of Posts
export function find(req, res) {
  res.json(req.user);
}

// Creates a new Post in the DB
export function create(req, res) {
  var user = new User({username: req.body.username});
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    user.password = hash;
    user.save(function(err) {
      if (err) { throw res.send(500); }
      res.send(201);
    });
  });
}
